var express = require('express');
var router = express.Router();
let categorySchema = require('../schemas/category')
let carSchema = require('../schemas/car')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// Lấy toàn bộ danh mục
router.get('/api/categories', async function (req, res, next) {
  let categories = await categorySchema.find({ isDeleted: false });
  res.send(categories);
});

// Lấy toàn bộ xe
router.get('/api/cars', async function (req, res, next) {
  let cars = await carSchema.find({ isDeleted: false }).populate('category');
  res.send(cars);
});

// Lấy danh sách xe theo category
router.get('/api/:category', async function (req, res, next) {
  let categorySlug = req.params.category;
  let category = await categorySchema.findOne({
    slug: categorySlug
  })
  let cars = await carSchema.find({
    category: category._id
  })
  res.send(cars)
});

// Lấy xe theo slug của category và slug của xe
router.get('/api/:category/:car', async function (req, res, next) {
  let categorySlug = req.params.category;
  let carSlug = req.params.car;
  let category = await categorySchema.findOne({
    slug: categorySlug
  })
  let cars = await carSchema.find({
    category: category._id,
    slug: carSlug
  })
  res.send(cars)
});

// Lấy top 5 xe nổi bật (theo giá giảm dần)
router.get('/api/highlight/top5', async function (req, res, next) {
  let cars = await carSchema.find({ isDeleted: false }).sort({ price: -1 }).limit(5);
  res.send(cars);
});

// Gợi ý xe cùng danh mục
router.get('/api/recommend/:carId', async function (req, res, next) {
  let car = await carSchema.findById(req.params.carId);
  let relatedCars = await carSchema.find({
    category: car.category,
    _id: { $ne: car._id },
    isDeleted: false
  }).limit(4);
  res.send(relatedCars);
});

module.exports = router;
