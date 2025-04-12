const User = require('../models/User');
const bcrypt = require('bcrypt');

async function CheckLogin(username, password) {
    const user = await User.findOne({ username: username });

    if (!user) {
        throw new Error('Tài khoản không tồn tại');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Mật khẩu không đúng');
    }

    return user._id;
}

module.exports = {
    CheckLogin
};
