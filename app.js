const env = require('dotenv').config().parsed;
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const initializePassport = require('./passport-config');

/* const compression = require('compression');
const helmet = require('helmet'); */

const indexRouter = require('./routes/index');
const clubhouseRouter = require('./routes/clubhouse');

const app = express();

const mongoose = require('mongoose');
const dev_db_url = `${env.database_url}`;
/* const mongoDB = process.env.MONGODB_URI || dev_db_url; */
const mongoDB = `${env.DATABASE_URL}`;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* app.use(helmet()); */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/* app.use(compression()); */

initializePassport(passport);

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use(
  session({
    secret: `${env.SECRET}`,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(flash());

app.use('/', indexRouter);
app.use('/clubhouse', clubhouseRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
