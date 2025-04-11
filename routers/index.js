var express = require('express');
var router = express.Router();
let categorySchema = require('../schemas/category')
let carSchema = require('../schemas/car')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

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

module.exports = router;
