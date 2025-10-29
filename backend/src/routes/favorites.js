import { Router } from 'express';
import Favorite from '../models/Favorite.js';
import { authMiddleware } from '../lib/auth.js';

const router = Router();

// All favorites routes now require auth
router.get('/api/favorites', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const items = await Favorite.find({ userId }).sort({ updatedAt: -1 }).limit(200).lean();
  res.json({ ok: true, items });
});

router.post('/api/favorites', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { restaurantId, info } = req.body || {};
  if (!restaurantId) return res.status(400).json({ ok: false, error: 'restaurantId is required' });
  try {
    const doc = await Favorite.findOneAndUpdate(
      { userId, restaurantId },
      { $set: { info: info || {} } },
      { new: true, upsert: true }
    ).lean();
    res.json({ ok: true, item: doc });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.delete('/api/favorites/:restaurantId', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { restaurantId } = req.params;
  await Favorite.deleteOne({ userId, restaurantId });
  res.json({ ok: true });
});

export default router;
