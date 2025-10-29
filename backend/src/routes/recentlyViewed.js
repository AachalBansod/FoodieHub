import { Router } from 'express';
import RecentlyViewed from '../models/RecentlyViewed.js';

const router = Router();

function requireDeviceId(req, res) {
  const deviceId = (req.query.deviceId || req.body.deviceId || '').toString().trim();
  if (!deviceId) {
    res.status(400).json({ ok: false, error: 'deviceId is required' });
    return null;
  }
  return deviceId;
}

// Get last N (default 20)
router.get('/api/recently-viewed', async (req, res) => {
  const deviceId = requireDeviceId(req, res);
  if (!deviceId) return;
  const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);
  const items = await RecentlyViewed.find({ deviceId }).sort({ viewedAt: -1 }).limit(limit).lean();
  res.json({ ok: true, items });
});

// Record a view
router.post('/api/recently-viewed', async (req, res) => {
  const deviceId = requireDeviceId(req, res);
  if (!deviceId) return;
  const { restaurantId, info } = req.body || {};
  if (!restaurantId) {
    return res.status(400).json({ ok: false, error: 'restaurantId is required' });
  }
  try {
    const doc = await RecentlyViewed.findOneAndUpdate(
      { deviceId, restaurantId },
      { $set: { info: info || {}, viewedAt: new Date() } },
      { new: true, upsert: true }
    ).lean();

    // Enforce max history length of 50 per deviceId
    const count = await RecentlyViewed.countDocuments({ deviceId });
    const max = 50;
    if (count > max) {
      const toRemove = count - max;
      const oldItems = await RecentlyViewed.find({ deviceId }).sort({ viewedAt: 1 }).limit(toRemove).select('_id');
      const ids = oldItems.map(d => d._id);
      if (ids.length) await RecentlyViewed.deleteMany({ _id: { $in: ids } });
    }

    res.json({ ok: true, item: doc });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
