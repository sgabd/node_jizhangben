var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { DBHost, DBPort } = require('./config/config')
const indexRouter = require('./routes/web/index');
const accountRouter = require('./routes/api/account');
const regRouter = require('./routes/web/reg')
const authApiRouter = require('./routes/api/auth')
const session = require('express-session')
const MongoStor = require('connect-mongo')
const app = express();
app.use(session({
  name: 'sid', // cookie中存储sessionid的字段名  //默认值为sid
  secret: 'keyboard', //加密的字符串（签名）
  resave: true, // 是否每次都重新保存session
  saveUninitialized: false, // 是否自动保存未初始化的session
  store: MongoStor.create({
    mongoUrl:`mongodb://${DBHost}:${DBPort}/27017:bilibili`, // 连接mongodb的url
  }),
  cookie: {
    httpOnly: true, // 防止客户端脚本访问cookie
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7天 
  }
}))
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', regRouter)
app.use('/api', accountRouter)
app.use('/api', authApiRouter)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // next(createError(404));
  res.render('404')
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
