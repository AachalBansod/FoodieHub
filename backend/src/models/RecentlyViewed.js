import mongoose from '../lib/db.js';

const RecentlyViewedSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, index: true },
  restaurantId: { type: String, required: true },
  info: { type: Object },
  viewedAt: { type: Date, default: Date.now, index: true },
}, { timestamps: true });

RecentlyViewedSchema.index({ deviceId: 1, restaurantId: 1 }, { unique: true });

export default mongoose.model('RecentlyViewed', RecentlyViewedSchema);
