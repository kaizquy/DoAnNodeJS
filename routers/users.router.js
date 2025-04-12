const express = require('express');
const router = express.Router();
const { CheckLogin } = require('../controllers/user.controller');
const jwt = require('jsonwebtoken');
const constants = require('../utils/constants');

// Middleware này nếu bạn cần gửi thông báo lỗi cho view
function renderError(res, message) {
    res.status(400).render('error', { message });
    // Hoặc nếu bạn không dùng view engine thì:
    // res.sendFile(path.join(__dirname, '../views/error.html'));
}

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user_id = await CheckLogin(username, password);

        const exp = new Date(Date.now() + 60 * 60 * 1000).getTime();
        const token = jwt.sign({ id: user_id, exp }, constants.SECRET_KEY);

        // Nếu bạn dùng cookie cho session:
        res.cookie('token', token, {
            httpOnly: true,
            expires: new Date(exp)
        });

        // Sau khi login thành công thì redirect đến index
        res.redirect('/index');
    } catch (err) {
        console.error("Lỗi đăng nhập:", err.message);
        renderError(res, "Tài khoản hoặc mật khẩu không đúng!");
    }
});

module.exports = router;
