var createError = require("http-errors");
var express = require("express");
var router = express.Router();
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var FileStore = require("session-file-store")(session);
var multer = require("multer");
var _storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: _storage });

var countApplicantId = 2; // count applicant num
var countEnterId = 2; // count enterprise num
const users = [{ name: "123", password: "123" }]; // Login users
const enterprises = [{ name: "456", password: "456" }]; // Login enterprises
const applicantList = [
  {
    applicantName: "sample2",
    applicantGender: "male",
    applicantBirthday: "2020-11-23",
    applicantEmail: "huhjb1020@naver.com",
    applicantPhoneNumber: "01038468250",
    applicantIntroduce: "my name is ...",
    name: "535",
    password: "325",
    image: "/img/Study.jpg",
    id: 0,
  },
  {
    applicantName: "helloworld",
    applicantGender: "female",
    applicantBirthday: "2020-11-23",
    applicantEmail: "helloworld@naver.com",
    applicantPhoneNumber: "01014458250",
    applicantIntroduce: "my name is ...",
    name: "486",
    password: "45858",
    image: "/img/Study.jpg",
    id: 1,
  },
];
const enterList = [
  {
    enterpriseName: "(주)카카오",
    enterpriseTitle: "kakao 채용공고",
    enterpriseQualificationAge: "신입",
    enterpriseQualificationGraduate: "대졸이상(졸업예정자가능)",
    enterpriseHired: "계약직",
    enterpriseMoney: "회사내규에따름",
    enterpriseLocation: "서울시 서초구",
    enterpriseTime: "주5일(월~금)",
    enterpriseDetailOption: "1. 지원동기 2. 성장과정",
    enterpriseInformation1: "앱 서비스 개발",
    enterpriseInformation2: "2010년",
    enterpriseInformation3: "10024명",
    enterpriseInformation4: "IT대기업",
    enterpriseInformation5: "1조8000억",
    name: "456",
    password: "456",
    image: "/img/Kakao.png",
    enterpriseDetailImg: "/img/capture.png",
    enterpriseApplicant: [
      {
        applicantName: "sample2",
        applicantGender: "male",
        applicantBirthday: "2020-11-23",
        applicantEmail: "huhjb1020@naver.com",
        applicantPhoneNumber: "01038468250",
        applicantIntroduce: "my name is ...",
        name: "535",
        password: "325",
        image: "/img/Study.jpg",
        id: 0,
      },
      {
        applicantName: "helloworld",
        applicantGender: "female",
        applicantBirthday: "2020-11-23",
        applicantEmail: "helloworld@naver.com",
        applicantPhoneNumber: "01014458250",
        applicantIntroduce: "my name is ...",
        name: "486",
        password: "45858",
        image: "/img/dog.jpg",
        id: 1,
      },
    ],
    id: 0,
  },
  {
    enterpriseName: "(주)한화",
    enterpriseTitle: "hanwha 채용공고",
    enterpriseQualificationAge: "신입",
    enterpriseQualificationGraduate: "대졸이상(졸업예정자가능)",
    enterpriseHired: "일용직",
    enterpriseMoney: "회사내규에 따름",
    enterpriseLocation: "서울시 양천구",
    enterpriseTime: "주5일(월~금)",
    enterpriseDetailOption: "1. 지원동기 2. 성장과정",
    enterpriseInformation1: "게임 애니메이션",
    enterpriseInformation2: "1988년",
    enterpriseInformation3: "1025명",
    enterpriseInformation4: "중견기업",
    enterpriseInformation5: "5080억",
    name: "636",
    password: "636",
    image: "/img/hanwha.png",
    enterpriseDetailImg: "/img/capture.png",
    enterpriseApplicant: [],
    id: 1,
  },
];
var mainText = "Welcome."; // main status text
var isWrong = false; // login check
var isWrongText = ""; // login check text

/*
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
app.use('/', indexRouter);
app.use('/users', usersRouter);
*/
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "asdlgkgfk",
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
  })
);

/* GET home page. */
app.get("/", function (req, res, next) {
  if (req.session.is_logined) {
    // login-on
    if (req.session.is_type) {
      res.render("main", {
        name: req.session.name,
        signLink: "/logout",
        sign: "Log-out",
        direct: "/mypage",
        enterList: enterList,
        mainText: mainText,
      });
    } else {
      res.render("main", {
        name: req.session.name,
        signLink: "/logout",
        sign: "Log-out",
        direct: "/enterprise",
        enterList: enterList,
        mainText: mainText,
      });
    }
  } else {
    // login-off
    res.render("main", {
      name: "",
      signLink: "/login",
      sign: "Log-in",
      direct: "",
      enterList: enterList,
      mainText: mainText,
    });
  }
});

/* GET login page. */
app.get("/login", function (req, res, next) {
  res.render("login", { message: isWrong, text: isWrongText });
});

/* GET login_process page. */
app.post("/login", function (req, res, next) {
  var name = req.body.name;
  var password = req.body.password;
  var dbType = req.body.DB_Type;

  if (dbType === "type1") {
    for (i = 0; i < users.length; i++) {
      if (name === users[i].name && password === users[i].password) {
        // success!
        req.session.is_logined = true;
        req.session.is_type = true;
        req.session.name = name;
        req.session.password = password;
        req.session.save(function () {
          mainText = "Welcome " + req.session.name + ".";
          res.redirect("/");
        });
        return true;
      }
    }
  } else if (dbType === "type2") {
    for (i = 0; i < enterprises.length; i++) {
      if (
        name === enterprises[i].name &&
        password === enterprises[i].password
      ) {
        // success!
        req.session.is_logined = true;
        req.session.is_type = false;
        req.session.name = name;
        req.session.password = password;
        req.session.save(function () {
          mainText = "Welcome " + req.session.name + ".";
          res.redirect("/");
        });
        return true;
      }
    }
  }

  // wrong!
  isWrong = true;
  isWrongText = "잘못된 정보가 입력되었습니다.";
  res.redirect("/login");
});

/* GET logout page. */
app.get("/logout", function (req, res, next) {
  req.session.destroy(function (err) {
    mainText = "Welcome.";
    res.redirect("/");
  });
});

/* GET register page. */
app.get("/register", function (req, res, next) {
  res.render("register.ejs");
});

/* POST register page. */
app.post("/register", function (req, res, next) {
  try {
    if (req.body.DB_Type === "type1") {
      for (var i = 0; i < users.length; i++) {
        if (users[i].name == req.body.name) {
          // same name
          throw new Error("동일한 ID가 이미 등록되어있습니다.");
        }
      }
      users.push({
        name: req.body.name,
        password: req.body.password,
      });
      console.log(users);
    } else if (req.body.DB_Type === "type2") {
      for (var i = 0; i < enterprises.length; i++) {
        if (enterprises[i].name == req.body.name) {
          // same name
          throw new Error("동일한 ID가 이미 등록되어있습니다.");
        }
      }
      enterprises.push({
        name: req.body.name,
        password: req.body.password,
      });
      console.log(enterprises);
    }

    // wrong!
    isWrong = true;
    isWrongText = "다시 로그인해주세요.";
    res.redirect("/login");
  } catch (err) {
    // wrong!
    isWrong = true;
    isWrongText = err.name + " : " + err.message;
    res.redirect("/login");
  }
});

/* GET enterprise page. */
app.get("/enterprise", function (req, res, next) {
  if (req.session.is_logined && req.session.is_type === false) {
    res.render("enterprise");
  } else {
    mainText = "Access denied";
    res.redirect("/");
  }
});

/* POST enterprise page. */
app.post(
  "/enterprise",
  upload.fields([{ name: "image" }, { name: "enterpriseDetailImg" }]),
  function (req, res, next) {
    const obj = JSON.parse(JSON.stringify(req.body));
    obj.name = req.session.name;
    obj.password = req.session.password;
    obj.image = "/img/" + req.files["image"][0].filename;
    obj.enterpriseDetailImg =
      "/img/" + req.files["enterpriseDetailImg"][0].filename;
    obj.enterpriseApplicant = [];
    obj.id = countEnterId;
    countEnterId += 1;
    try {
      enterList.push(obj);
      console.log(enterList);
      mainText = "Registration success";
      res.redirect("/");
    } catch {
      res.redirect("/enterprise");
    }
  }
);

/* GET enterprise-detail page. */
app.get("/enterprise-detail/:id", function (req, res, next) {
  for (var i = 0; i < enterList.length; i++) {
    if (enterList[i].id == req.params.id) {
      req.session.current_url = "/enterprise-detail/" + req.params.id;
      return res.render("enterprise-detail", { enterList: enterList[i] });
    }
  }

  mainText = "Access denied";
  res.redirect("/");
});

/* POST enterprise-update page. */
app.post("/enterprise-update/:id", function (req, res, next) {
  if (req.session.is_logined === true && req.session.is_type === false) {
    for (var i = 0; i < enterList.length; i++) {
      if (
        enterList[i].id == req.body.id &&
        enterList[i].name == req.session.name &&
        enterList[i].password == req.session.password
      ) {
        return res.render("enterprise-update", { enterList: enterList[i] });
      }
    }
  }
  mainText = "Access denied";
  res.redirect("/");
});

/* POST enterprise-update page. */
app.post(
  "/enterprise-updating",
  upload.fields([{ name: "image" }, { name: "enterpriseDetailImg" }]),
  function (req, res, next) {
    if (req.session.is_logined === true && req.session.is_type === false) {
      for (var i = 0; i < enterList.length; i++) {
        if (
          enterList[i].id == req.body.id &&
          enterList[i].name == req.session.name &&
          enterList[i].password == req.session.password
        ) {
          const obj = JSON.parse(JSON.stringify(req.body));
          obj.name = req.session.name;
          obj.password = req.session.password;
          obj.image = "/img/" + req.files["image"][0].filename;
          obj.enterpriseDetailImg =
            "/img/" + req.files["enterpriseDetailImg"][0].filename;
          obj.enterpriseApplicant = enterList[i].enterpriseApplicant;
          obj.id = enterList[i].id;
          try {
            enterList[i] = obj;
            console.log(enterList);
            mainText = "Registration Update success";
            return res.redirect(req.session.current_url);
          } catch {
            console.log("err");
            mainText = "Registration Update fail";
            return res.redirect(req.session.current_url);
          }
        }
      }
    }
    console.log("else");
    res.redirect(req.session.current_url);
  }
);

/* POST enterprise-delete page. */
app.post("/enterprise-delete", function (req, res, next) {
  if (req.session.is_logined === true && req.session.is_type === false) {
    for (var i = 0; i < enterList.length; i++) {
      if (
        enterList[i].id == req.body.id &&
        enterList[i].name == req.session.name &&
        enterList[i].password == req.session.password
      ) {
        try {
          enterList.pop(i);
          console.log(enterList);
          mainText = "Delete success";
          return res.redirect("/");
        } catch {
          console.log("err");
          return res.redirect(req.session.current_url);
        }
      }
    }
  }
  console.log("else");
  mainText = "Access denied";
  res.redirect("/");
});

/* POST enterprise-apply page. */
app.post("/enterprise-apply", function (req, res, next) {
  if (req.session.is_logined && req.session.is_type) {
    for (var i = 0; i < applicantList.length; i++) {
      console.log(applicantList[i].name + " : " + req.session.name);
      if (
        applicantList[i].name == req.session.name &&
        applicantList[i].password == req.session.password
      ) {
        // already applicant save
        for (var j = 0; j < enterList.length; j++) {
          if (enterList[j].id == req.body.id) {
            try {
              console.log(enterList[j]);
              enterList[j].enterpriseApplicant.push(applicantList[i]);
              console.log(enterList[j]);
              mainText = "Apply success";
              return res.redirect("/");
            } catch {
              mainText = "Apply fail";
              return res.redirect("/");
            }
          }
        }
      }
    }
    mainText = "Apply fail, Before writing mypage";
    return res.redirect("/");
  }
  console.log("else");
  mainText = "Access denied";
  res.redirect("/");
});

/* POST enterprise-applicant page. */
app.post("/enterprise-applicant", function (req, res, next) {
  if (req.session.is_logined === true && req.session.is_type === false) {
    for (var i = 0; i < enterList.length; i++) {
      if (
        enterList[i].name == req.session.name &&
        enterList[i].password == req.session.password
      ) {
        try {
          return res.render("enterprise-applicant", {
            enterList: enterList[i],
          });
        } catch {
          console.log("err");
          mainText = "Applicant Access denied";
          return res.redirect("/");
        }
      }
    }
  }
  console.log("else");
  mainText = "Access denied";
  res.redirect("/");
});

/* GET mypage page. */
app.get("/mypage", function (req, res, next) {
  if (req.session.is_logined && req.session.is_type) {
    // check login & type
    for (var i = 0; i < applicantList.length; i++) {
      if (
        applicantList[i].name == req.session.name &&
        applicantList[i].password == req.session.password
      ) {
        // already save profile
        return res.render("mypage-update", { applicantList: applicantList[i] });
      }
    }
    return res.render("mypage");
  }
  mainText = "Access denied";
  res.redirect("/");
});

/* POST mypage page. */
app.post(
  "/mypage",
  upload.fields([{ name: "image" }]),
  function (req, res, next) {
    for (var i = 0; i < applicantList.length; i++) {
      if (
        applicantList[i].name == req.session.name &&
        applicantList[i].password == req.session.password
      ) {
        // already save profile
        const obj = JSON.parse(JSON.stringify(req.body));
        obj.name = req.session.name;
        obj.password = req.session.password;
        obj.image = "/img/" + req.files["image"][0].filename;
        obj.id = applicantList[i].id;
        try {
          applicantList[i] = obj;
          console.log(applicantList);
          mainText = "Profile Update success";
          return res.redirect("/");
        } catch {
          console.log("err");
          mainText = "Profile Update fail";
          return res.redirect("/");
        }
      }
    }
    // initial save profile
    const obj = JSON.parse(JSON.stringify(req.body));
    obj.name = req.session.name;
    obj.password = req.session.password;
    obj.image = "/img/" + req.files["image"][0].filename;
    obj.id = countApplicantId;
    countApplicantId += 1;
    try {
      applicantList.push(obj);
      console.log(applicantList);
      mainText = "Profile save success";
      res.redirect("/");
    } catch {
      res.redirect("/mypage");
    }
  }
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
