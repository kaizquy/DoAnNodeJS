var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');

let { CreateSuccessResponse, CreateErrorResponse } = require('./utils/responseHandler');
let constants = require('./utils/constants');

// Import routers
var indexRouter = require('./routers/index');
var usersRouter = require('./routers/users');
var authRouter = require('./routers/auth');
var menusRouter = require('./routers/menus');
var rolesRouter = require('./routers/roles');
var carsRouter = require('./routers/cars');
var categoriesRouter = require('./routers/categories');
var cartRouter = require('./routers/carts');
var ordersRouter = require('./routers/orders');

// App init
var app = express();

// CORS
app.use(cors({ origin: '*' }));

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/S6");
mongoose.connection.on('connected', () => {
  console.log("MongoDB connected!");
});
mongoose.connection.on('error', (err) => {
  console.error("MongoDB connection error:", err);
});

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(constants.SECRET_KEY_COOKIE));
app.use(express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/menus', menusRouter);
app.use('/roles', rolesRouter);
app.use('/cars', carsRouter);
app.use('/categories', categoriesRouter);
app.use('/cart', cartRouter);
app.use('/orders', ordersRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  CreateErrorResponse(res, err.status || 500, err.message);
});

module.exports = app;
