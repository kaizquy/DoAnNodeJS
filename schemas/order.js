let mongoose = require('mongoose');

let orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    car: {
        type: mongoose.Types.ObjectId,
        ref: 'car',
        required: true
    },
    quantity: {
        type: Number,
        min: 1,
        default: 1
    },
    totalPrice: {
        type: Number,
        min: 0,
        required: true
    },
    status: {
        type: String,
        enum: ['chờ xác nhận', 'đã xác nhận', 'đang giao', 'đã giao', 'đã huỷ'],
        default: 'chờ xác nhận'
    },
    shippingAddress: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('order', orderSchema);
