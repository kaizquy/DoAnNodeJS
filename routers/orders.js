const express = require('express');
const router = express.Router();
const orderSchema = require('../schemas/order');
const { CreateSuccessResponse, CreateErrorResponse } = require('../utils/responseHandler');
const { check_authentication } = require('../utils/check_auth');

// GET all non-deleted orders
router.get('/', check_authentication, async (req, res) => {
    try {
        let orders = await orderSchema.find({ isDeleted: false }).populate('user').populate('car');
        CreateSuccessResponse(res, 200, orders);
    } catch (error) {
        CreateErrorResponse(res, 404, error.message);
    }
});

// POST create a new order
router.post('/', check_authentication, async (req, res) => {
    try {
        const body = req.body;
        let newOrder = new orderSchema({
            user: body.user,
            car: body.car,
            quantity: body.quantity || 1,
            status: body.status || 'pending',
            isDeleted: false,
            orderDate: new Date()
        });
        await newOrder.save();
        CreateSuccessResponse(res, 200, newOrder);
    } catch (error) {
        CreateErrorResponse(res, 404, error.message);
    }
});

// SOFT DELETE: update isDeleted = true
router.delete('/:id', check_authentication, async (req, res) => {
    try {
        let deletedOrder = await orderSchema.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );
        if (!deletedOrder) {
            return CreateErrorResponse(res, 404, 'Order not found');
        }
        CreateSuccessResponse(res, 200, deletedOrder);
    } catch (error) {
        CreateErrorResponse(res, 404, error.message);
    }
});

module.exports = router;
