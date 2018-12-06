var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var flash = require('connect-flash');

var indexRouter = require('./routes/index');
var productsRouter = require('./routes/products');
var categoriesRouter = require('./routes/categories');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Need sessions to use connect-flash
app.use(session({
  secret: 'foobar',
  resave: false,
  saveUninitialized: true,
  cookie: { cookie: { maxAge: 60000 }}
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

// Setup our Router Mountpoints
app.use('/', indexRouter);
app.use('/admin/products', productsRouter);
app.use('/admin/categories', categoriesRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
