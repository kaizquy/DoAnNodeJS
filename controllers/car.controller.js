const Car = require('../schemas/car');

const carController = {
    list: async (req, res) => {
        try {
            const cars = await Car.find({ isDeleted: false }).populate('category');
            res.render('cars', { cars });
        } catch (error) {
            console.error('Lỗi khi lấy danh sách xe:', error);
            res.status(500).send('Lỗi server');
        }
    }
};

module.exports = carController;
