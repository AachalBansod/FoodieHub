import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { signToken, authMiddleware } from '../lib/auth.js';

const router = Router();

router.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ ok: false, error: 'Missing fields' });
    const existing = await User.findOne({ email: email.toLowerCase() }).lean();
    if (existing) return res.status(409).json({ ok: false, error: 'Email already in use' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: email.toLowerCase(), passwordHash: hash });
    const token = signToken({ id: user._id.toString(), email: user.email, name: user.name });
    res.json({ ok: true, token, user: { id: user._id.toString(), name: user.name, email: user.email } });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ ok: false, error: 'Missing fields' });
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ ok: false, error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ ok: false, error: 'Invalid credentials' });
    const token = signToken({ id: user._id.toString(), email: user.email, name: user.name });
    res.json({ ok: true, token, user: { id: user._id.toString(), name: user.name, email: user.email } });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get('/api/auth/me', authMiddleware, async (req, res) => {
  res.json({ ok: true, user: req.user });
});

export default router;
