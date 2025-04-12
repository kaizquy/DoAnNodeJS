const userSchema = require('../schemas/user');
const roleSchema = require('../schemas/role');
const bcrypt = require('bcrypt');

module.exports = {
  GetAllUser: async function () {
    return await userSchema.find({}).populate('role');
  },

  GetUserByID: async function (id) {
    return await userSchema.findById(id).populate('role');
  },

  GetUserByEmail: async function (email) {
    return await userSchema.findOne({ email }).populate('role');
  },

  GetUserByToken: async function (token) {
    return await userSchema.findOne({ resetPasswordToken: token }).populate('role');
  },

  CreateAnUser: async function (username, password, email, role) {
    try {
      const roleObj = await roleSchema.findOne({ name: role });
      if (!roleObj) {
        throw new Error('Role không tồn tại');
      }

      // ✅ Mã hóa mật khẩu trước khi lưu
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new userSchema({
        username,
        password: hashedPassword,
        email,
        role: roleObj._id
      });

      return await newUser.save();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  UpdateAnUser: async function (id, body) {
    const allowField = ["password", "email", "imgURL"];
    const getUser = await userSchema.findById(id);

    for (const key of Object.keys(body)) {
      if (allowField.includes(key)) {
        getUser[key] = body[key];
      }
    }

    return await getUser.save();
  },

  DeleteAnUser: async function (id) {
    return await userSchema.findByIdAndUpdate(id, { status: false }, { new: true });
  },

  CheckLogin: async function (username, password) {
    const user = await userSchema.findOne({ username });
    if (!user) {
      throw new Error("Username hoặc password không đúng");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Username hoặc password không đúng");
    }

    return user._id;
  },

  Change_Password: async function (user, oldpassword, newpassword) {
    const isMatch = await bcrypt.compare(oldpassword, user.password);
    if (!isMatch) {
      throw new Error("Mật khẩu cũ không đúng");
    }

    const hashedNewPassword = await bcrypt.hash(newpassword, 10);
    user.password = hashedNewPassword;
    await user.save();
  }
};
