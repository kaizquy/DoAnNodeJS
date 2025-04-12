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
var cartsRouter = require('./routers/carts');
var ordersRouter = require('./routers/orders');

// App init
var app = express();

// CORS configuration (chỉ cho phép từ domain của bạn khi deploy)
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/S6", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on('connected', () => {
  console.log("MongoDB connected!");
});
mongoose.connection.on('error', (err) => {
  console.error("MongoDB connection error:", err);
});

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(constants.SECRET_KEY_COOKIE));

// Cấu hình phục vụ file tĩnh (HTML/CSS/JS)
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/menus', menusRouter);
app.use('/api/roles', rolesRouter);
app.use('/api/cars', carsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/orders', ordersRouter);

// Frontend route - Trả về file index.html cho tất cả các route không phải API
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    next();
  }
});

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // Chỉ trả về JSON error cho các route API
  if (req.path.startsWith('/api')) {
    CreateErrorResponse(res, err.status || 500, err.message);
  } else {
    // Render error page cho frontend
    res.status(err.status || 500);
    res.sendFile(path.join(__dirname, 'public', 'error.html'));
  }
});

module.exports = app;