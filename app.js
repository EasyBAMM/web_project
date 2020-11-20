var createError = require('http-errors');
var express = require('express');
var router = express.Router();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

const users = []
const enterprises = [];
var isWrong = false;
var mainName = null;

/*
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
app.use('/', indexRouter);
app.use('/users', usersRouter);
*/
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'asdlgkgfk',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}));

/* GET home page. */
app.get('/', function(req, res, next) {
  if(session.is_logined) {
    // login-on
    if(session.is_type) {
      res.render('main', { name: mainName, sign: "Log-out", direct: "/mypage" });
    }
    else {
      res.render('main', { name: mainName, sign: "Log-out", direct: "/enterprise" });
    }
  }
  else {
    // login-off
    res.render('main', { name: mainName, sign: "Log-in", direct:"" });
  }
});

/* GET login page. */
app.get('/login', function(req, res, next) {
  if(session.is_logined) {
    session.is_logined = false;
    mainName = null;
    res.redirect('/');
  }
  res.render('login', { message: isWrong, text:"비밀번호가 틀렸습니다." });
});

/* GET login_process page. */
app.post('/login', function(req, res, next) {
  var name = req.body.name;
  var password = req.body.password;
  var dbType = req.body.DB_Type;

  if(dbType === "type1") {
    for(i=0;i<users.length;i++) {
      if(name === users[i].name && password === users[i].password){
        // success!
        session.is_logined = true;
        session.is_type = true;
        session.name = req.body.name;
        mainName = req.body.name;
        res.redirect('/');
      }
    }
  }
  else if(dbType === "type2") {
    for(i=0;i<enterprises.length;i++) {
      if(name === enterprises[i].name && password === enterprises[i].password){
        // success!
        session.is_logined = true;
        session.is_type = false;
        session.name = req.body.name;
        mainName = req.body.name;
        res.redirect('/');
      }
    }
  }
  
  // wrong!
  isWrong = true;
  res.redirect('/login');
});

/* GET register page. */
app.get('/register', function(req, res, next) {
  res.render('register.ejs');
});

/* GET register page. */
app.post('/register', function(req, res, next) {
  try {
    if(req.body.DB_Type === "type1") {
      users.push({
        name: req.body.name,
        password: req.body.password
      })
    }
    else if(req.body.DB_Type === "type2") {
      enterprises.push({
        name: req.body.name,
        password: req.body.password
      })
    }
    
    res.redirect('/login');
  } catch {
    res.redirect('/register');
  }
});

/* GET enterprise page. */
app.get('/enterprise', function(req, res, next) {
  res.render('enterprise', { title: 'Express' });
});

/* GET enterprise-detail page. */
app.get('/enterprise-detail', function(req, res, next) {
  res.render('enterprise-detail', { title: 'Express' });
});

/* GET mypage page. */
app.get('/mypage', function(req, res, next) {
  res.render('mypage', { title: 'Express' });
});



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

const port = 3000
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})