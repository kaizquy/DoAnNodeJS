const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [
    {
      car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
      quantity: { type: Number, default: 1 }
    }
  ],
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
