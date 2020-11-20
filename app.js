var createError = require('http-errors');
var express = require('express');
var router = express.Router();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var multer = require('multer');
var _storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/img/')
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
});
var upload = multer({storage: _storage})

const users = []
const enterprises = [];
const enterList = [
  {
    enterpriseTitle: "kakao 채용공고",
    image: "/img/Kakao.png",
  },
  {
    enterpriseTitle: "hanwha 채용공고",
    image: "/img/hanwha.png",
  }
]
var isWrong = false;
var isWrongText = "";

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
  if(req.session.is_logined) {
    // login-on
    if(req.session.is_type) {
      res.render('main', { name: req.session.name, signLink:"/logout", sign: "Log-out", direct: "/mypage", enterList: enterList });
    }
    else {
      res.render('main', { name: req.session.name, signLink:"/logout", sign: "Log-out", direct: "/enterprise", enterList: enterList });
    }
  }
  else {
    // login-off
    res.render('main', { name: "", signLink:"/login", sign: "Log-in", direct:"", enterList: enterList });
  }
});

/* GET login page. */
app.get('/login', function(req, res, next) {
  res.render('login', { message: isWrong, text: isWrongText });
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
        req.session.is_logined = true;
        req.session.is_type = true;
        req.session.name = name;
        req.session.password = password;
        req.session.save(function(){
          res.redirect('/');
        });
        return true;
      }
    }
  }
  else if(dbType === "type2") {
    for(i=0;i<enterprises.length;i++) {
      if(name === enterprises[i].name && password === enterprises[i].password){
        // success!
        req.session.is_logined = true;
        req.session.is_type = false;
        req.session.name = name;
        req.session.password = password;
        req.session.save(function(){
          res.redirect('/');
        });
        return true;
      }
    }
  }
  
  // wrong!
  isWrong = true;
  isWrongText = "잘못된 정보가 입력되었습니다.";
  res.redirect('/login');
});

/* GET logout page. */
app.get('/logout', function(req, res, next) {
  req.session.destroy(function(err){
    res.redirect('/');
  });
});

/* GET register page. */
app.get('/register', function(req, res, next) {
  res.render('register.ejs');
});

/* POST register page. */
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
    
    isWrongText = "다시 로그인해주세요.";
    res.redirect('/login');
  } catch {
    res.redirect('/register');
  }
});

/* GET enterprise page. */
app.get('/enterprise', function(req, res, next) {
  if(req.session.is_logined && req.session.is_type === false) {
    res.render('enterprise', { title: 'Express' });
  }
  else {
    res.redirect('/');
  }
});

/* POST enterprise page. */
app.post('/enterprise', upload.fields([{name:'image'}, {name:'enterpriseDetailImg'}]), function(req, res, next) {
  const obj = JSON.parse(JSON.stringify(req.body));
  obj.name = req.session.name;
  obj.password = req.session.password;
  obj.image = "/img/" + req.files['image'][0].filename;
  obj.enterpriseDetailImg = "/img/" + req.files['enterpriseDetailImg'][0].filename;
  
  try{
    enterList.push(obj);
    console.log(enterList);
    res.redirect('/');
  } catch {
    res.redirect('/enterprise');
  }
});

/* GET enterprise-detail page. */
app.get('/enterprise-detail', function(req, res, next) {
  res.render('enterprise-detail', { title: 'Express' });
});

/* GET mypage page. */
app.get('/mypage', function(req, res, next) {
  if(req.session.is_logined && req.session.is_type) {
    res.render('mypage', { title: 'Express' });
  }
  else {
    res.redirect('/');
  }
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