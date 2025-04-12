let { body, validationResult } = require('express-validator');
let constants = require('./constants');
let util = require('util');
let { CreateErrorResponse } = require('./responseHandler');

let options = {
    password: {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    },
    username: {
        minLength: 6
    }
};

module.exports = {
    validate: function (req, res, next) {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(err => err.msg);
            CreateErrorResponse(res, 400, errorMessages);
        } else {
            next();
        }
    },

    SignUpValidator: [
        body("username")
            .isLength(options.username)
            .withMessage(util.format(constants.VALIDATOR_ERROR_USERNAME, options.username.minLength)),

        body("password")
            .isLength({ min: options.password.minLength })
            .withMessage(util.format(constants.VALIDATOR_ERROR_PASSWORD_LENGTH, options.password.minLength))
            .matches(/[a-z]/)
            .withMessage(util.format(constants.VALIDATOR_ERROR_PASSWORD_LOWERCASE, options.password.minLowercase))
            .matches(/[A-Z]/)
            .withMessage(util.format(constants.VALIDATOR_ERROR_PASSWORD_UPPERCASE, options.password.minUppercase))
            .matches(/\d/)
            .withMessage(util.format(constants.VALIDATOR_ERROR_PASSWORD_NUMBERS, options.password.minNumbers))
            .matches(/[^A-Za-z0-9]/)
            .withMessage(util.format(constants.VALIDATOR_ERROR_PASSWORD_SYMBOLS, options.password.minSymbols)),

        body("email")
            .isEmail()
            .withMessage(constants.VALIDATOR_ERROR_EMAIL)
    ],

    LoginValidator: [
        body("username")
            .isLength(options.username)
            .withMessage("Tên đăng nhập hoặc mật khẩu sai"),

        body("password")
            .isLength({ min: options.password.minLength })
            .withMessage("Tên đăng nhập hoặc mật khẩu sai")
    ]
};
