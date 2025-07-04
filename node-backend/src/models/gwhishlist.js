const mongoose = require('mongoose');

const gwhishlistSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

gwhishlistSchema.virtual('user', {
  ref: 'User',
  localField: 'user_id',
  foreignField: '_id',
  justOne: true
});

gwhishlistSchema.virtual('product', {
  ref: 'Product',
  localField: 'product_id',
  foreignField: '_id',
  justOne: true
});

gwhishlistSchema.index({ user_id: 1 });
gwhishlistSchema.index({ product_id: 1 });

gwhishlistSchema.index({ user_id: 1, product_id: 1 }, { unique: true });

const Gwhishlist = mongoose.model('Gwhishlist', gwhishlistSchema);

module.exports = Gwhishlist;
