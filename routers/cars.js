var express = require('express');
var router = express.Router();
let carSchema = require('../schemas/car');
let categorySchema = require('../schemas/category');
let slugify = require('slugify');

/* GET cars listing. */
router.get('/', async function (req, res, next) {
    let query = req.query;
    console.log(query);
    let objQuery = {};
    if (query.name) {
        objQuery.name = new RegExp(query.name, 'i')
    } else {
        objQuery.name = new RegExp("", 'i')
    }

    objQuery.price = {};
    if (query.price) {
        if (query.price.$gte) {
            objQuery.price.$gte = Number(query.price.$gte);
        } else {
            objQuery.price.$gte = 0;
        }
        if (query.price.$lte) {
            objQuery.price.$lte = Number(query.price.$lte);
        } else {
            objQuery.price.$lte = 1000000;
        }
    } else {
        objQuery.price.$lte = 1000000;
        objQuery.price.$gte = 0;
    }

    let cars = await carSchema.find(objQuery).populate(
        { path: 'category', select: 'name' }
    );
    res.send(cars);
});

router.get('/:id', async function (req, res, next) {
    try {
        let car = await carSchema.findById(req.params.id);
        res.send({
            success: true,
            data: car
        });
    } catch (error) {
        res.status(404).send({
            success: false,
            message: error.message
        })
    }
});

router.post('/', async function (req, res, next) {
    try {
        let body = req.body;
        let category = await categorySchema.findOne({ name: body.category })
        if (category) {
            let newCar = carSchema({
                name: body.name,
                price: body.price ? body.price : 10000,
                quantity: body.quantity ? body.quantity : 1,
                category: category._id,
                slug: slugify(body.name, {
                    lower: true
                })
            });
            await newCar.save()
            res.status(200).send({
                success: true,
                data: newCar
            });
        } else {
            res.status(404).send({
                success: false,
                message: "Không tìm thấy category"
            })
        }
    } catch (error) {
        res.status(404).send({
            success: false,
            message: error.message
        })
    }
});

router.put('/:id', async function (req, res, next) {
    try {
        let body = req.body;
        let updatedObj = {}
        if (body.name) updatedObj.name = body.name;
        if (body.quantity) updatedObj.quantity = body.quantity;
        if (body.price) updatedObj.price = body.price;
        if (body.category) updatedObj.category = body.category;

        let updatedCar = await carSchema.findByIdAndUpdate(req.params.id, updatedObj, { new: true });
        res.status(200).send({
            success: true,
            data: updatedCar
        });
    } catch (error) {
        res.status(404).send({
            success: false,
            message: error.message
        })
    }
});

router.delete('/:id', async function (req, res, next) {
    try {
        let updatedCar = await carSchema.findByIdAndUpdate(req.params.id, {
            isDeleted: true
        }, { new: true })
        res.status(200).send({
            success: true,
            data: updatedCar
        });
    } catch (error) {
        res.status(404).send({
            success: false,
            message: error.message
        })
    }
});

module.exports = router;
