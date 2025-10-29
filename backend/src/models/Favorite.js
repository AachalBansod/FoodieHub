import mongoose from '../lib/db.js';

const FavoriteSchema = new mongoose.Schema({
  // Either userId (preferred) or deviceId (legacy fallback)
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  deviceId: { type: String, index: true },
  restaurantId: { type: String, required: true },
  info: { type: Object },
}, { timestamps: true });

// Unique per owner+restaurant
FavoriteSchema.index({ userId: 1, restaurantId: 1 }, { unique: true, partialFilterExpression: { userId: { $type: 'objectId' } } });
FavoriteSchema.index({ deviceId: 1, restaurantId: 1 }, { unique: true, partialFilterExpression: { deviceId: { $type: 'string' } } });

export default mongoose.model('Favorite', FavoriteSchema);
