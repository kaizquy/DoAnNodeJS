const express = require('express');
const router = express.Router();
const Cart = require('../schemas/cart');
const { check_authentication } = require('../utils/check_auth');

// Lấy giỏ hàng của người dùng
router.get('/', check_authentication, async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id, isDeleted: false }).populate('items.car');
  if (!cart) cart = { items: [] };
  res.send(cart);
});

// Thêm vào giỏ hàng
router.post('/add', check_authentication, async (req, res) => {
  const { carId, quantity } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }
  const existingItem = cart.items.find(i => i.car.toString() === carId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ car: carId, quantity });
  }
  await cart.save();
  res.send(cart);
});

// Xóa một mục trong giỏ
router.delete('/remove/:carId', check_authentication, async (req, res) => {
  const { carId } = req.params;
  let cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.items = cart.items.filter(i => i.car.toString() !== carId);
    await cart.save();
  }
  res.send(cart);
});
module.exports = router;
