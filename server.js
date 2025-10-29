// Minimal Express server to serve the built frontend and provide API proxy endpoints
// Assumes backend API routes already exist in another service; if you also run backend in same app,
// mount them here under /api. For Render "frontend via backend", this server serves static files
// and forwards /api calls to your actual backend base URL if provided.

const express = require("express");
const path = require("path");
const compression = require("compression");
const morgan = require("morgan");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const MONGODB_URI = process.env.MONGODB_URI || "";
const CACHE_TTL = Number(process.env.CACHE_TTL || 180);

// Basic middleware
app.use(compression());
app.use(morgan("tiny"));
app.use(express.json({ limit: "1mb" }));
app.use(cors()); // Render same-origin won’t need it, but safe

// Connect Mongo if configured
if (MONGODB_URI) {
  mongoose
    .connect(MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((e) => console.warn("Mongo connection error", e.message));
}

// Schemas & models
const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, index: true },
    passwordHash: String,
  },
  { timestamps: true }
);
const User = mongoose.models.User || mongoose.model("User", UserSchema);

const FavoriteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    restaurantId: { type: String, required: true },
    info: { type: Object },
  },
  { timestamps: true }
);
FavoriteSchema.index({ userId: 1, restaurantId: 1 }, { unique: true });
const Favorite =
  mongoose.models.Favorite || mongoose.model("Favorite", FavoriteSchema);

const RecentlyViewedSchema = new mongoose.Schema(
  {
    deviceId: { type: String, index: true },
    restaurantId: String,
    info: Object,
    viewedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
RecentlyViewedSchema.index({ deviceId: 1, viewedAt: -1 });
const RecentlyViewed =
  mongoose.models.RecentlyViewed ||
  mongoose.model("RecentlyViewed", RecentlyViewedSchema);

// Auth helpers
function signToken(user) {
  return jwt.sign({ sub: String(user._id), email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });
}
async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [, token] = header.split(" ");
    if (!token) return res.status(401).json({ ok: false, error: "Unauthorized" });
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch (e) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }
}

// ===== API routes =====
// Health
app.get("/api/health", (req, res) => res.json({ ok: true, status: "up" }));

// Auth
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ ok: false, error: "Missing fields" });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ ok: false, error: "Email already in use" });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });
    const token = signToken(user);
    res.json({ ok: true, token, user: { id: String(user._id), name: user.name, email: user.email } });
  } catch (e) {
    res.status(500).json({ ok: false, error: "Signup failed" });
  }
});
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ ok: false, error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.passwordHash || "");
    if (!ok) return res.status(401).json({ ok: false, error: "Invalid credentials" });
    const token = signToken(user);
    res.json({ ok: true, token, user: { id: String(user._id), name: user.name, email: user.email } });
  } catch (e) {
    res.status(500).json({ ok: false, error: "Login failed" });
  }
});
app.get("/api/auth/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId).lean();
  if (!user) return res.status(404).json({ ok: false });
  res.json({ ok: true, user: { id: String(user._id), name: user.name, email: user.email } });
});

// Favorites (protected)
app.get("/api/favorites", authMiddleware, async (req, res) => {
  const items = await Favorite.find({ userId: req.userId }).lean();
  res.json({ ok: true, items: items.map((x) => ({ ...x, id: String(x._id) })) });
});
app.post("/api/favorites", authMiddleware, async (req, res) => {
  const { restaurantId, info } = req.body || {};
  if (!restaurantId) return res.status(400).json({ ok: false, error: "Missing restaurantId" });
  await Favorite.updateOne(
    { userId: req.userId, restaurantId: String(restaurantId) },
    { $set: { info: info || {} } },
    { upsert: true }
  );
  res.json({ ok: true });
});
app.delete("/api/favorites/:id", authMiddleware, async (req, res) => {
  await Favorite.deleteOne({ userId: req.userId, restaurantId: String(req.params.id) });
  res.json({ ok: true });
});

// Recently viewed (device-based, unauthed)
app.post("/api/recently-viewed", async (req, res) => {
  try {
    const { deviceId, restaurantId, info } = req.body || {};
    if (!deviceId || !restaurantId) return res.status(400).json({ ok: false, error: "Missing fields" });
    await RecentlyViewed.create({ deviceId, restaurantId: String(restaurantId), info: info || {} });
    // keep only last 50 per device
    const list = await RecentlyViewed.find({ deviceId }).sort({ viewedAt: -1 }).lean();
    if (list.length > 50) {
      const ids = list.slice(50).map((x) => x._id);
      await RecentlyViewed.deleteMany({ _id: { $in: ids } });
    }
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false });
  }
});
app.get("/api/recently-viewed", async (req, res) => {
  const { deviceId } = req.query;
  if (!deviceId) return res.json({ ok: true, items: [] });
  const items = await RecentlyViewed.find({ deviceId })
    .sort({ viewedAt: -1 })
    .limit(20)
    .lean();
  res.json({ ok: true, items });
});

// In-memory cache for Swiggy responses
const cache = new Map();
function setCache(key, value) {
  cache.set(key, { value, expires: Date.now() + CACHE_TTL * 1000 });
}
function getCache(key) {
  const e = cache.get(key);
  if (!e) return null;
  if (Date.now() > e.expires) {
    cache.delete(key);
    return null;
  }
  return e.value;
}

// Swiggy proxy endpoints
app.get("/api/restaurants", async (req, res) => {
  const { lat, lng } = req.query;
  const key = `list:${lat}:${lng}`;
  const cached = getCache(key);
  if (cached) return res.json(cached);
  try {
    const url = `https://www.swiggy.com/dapi/restaurants/list/v5?lat=${encodeURIComponent(
      lat || "18.5204"
    )}&lng=${encodeURIComponent(lng || "73.8567")}&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING`;
    const { data } = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    setCache(key, data);
    res.json(data);
  } catch (e) {
    res.status(500).json({ ok: false, error: "Failed to fetch restaurants" });
  }
});

app.get("/api/restaurants/:id", async (req, res) => {
  const { lat, lng } = req.query;
  const { id } = req.params;
  const key = `menu:${id}:${lat}:${lng}`;
  const cached = getCache(key);
  if (cached) return res.json(cached);
  try {
    const url = `https://www.swiggy.com/mapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=${encodeURIComponent(
      lat || "18.5204"
    )}&lng=${encodeURIComponent(lng || "73.8567")}&restaurantId=${encodeURIComponent(
      id
    )}&submitAction=ENTER`;
    const { data } = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    setCache(key, data);
    res.json(data);
  } catch (e) {
    res.status(500).json({ ok: false, error: "Failed to fetch menu" });
  }
});

// Static assets
const distDir = path.join(__dirname, "dist");
app.use(express.static(distDir, { maxAge: "1h", etag: true }));

// SPA fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Web server listening on ${PORT}`);
});
