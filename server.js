var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require("path");
const multer = require("multer");
app.use(express.static('public'));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
const exphbs = require('express-handlebars');
app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.use(express.static(__dirname + '/public'));
var lgn = require('./login');
var clientSessions = require("client-sessions"); 

// Setup client-sessions
app.use(clientSessions({
    cookieName: "userSession", // this is the object name that will be added to 'req'
    secret: "madebyabhaipalsangha", // this should be a long un-guessable string.
    duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60 * 1 // the session will be extended by this many ms each request (1 minute)
  }));
  app.use(function(req, res, next) {
    res.locals.session = req.userSession;
    next();
});
function ensureLogin(req, res, next) {
    if (!req.userSession.user) {
      res.redirect("/office");
    } else {
      next();
    }
}

app.engine('.hbs', exphbs({ 
    extname: '.hbs',
    helpers: {
        navLink: function(url, options){
            return '<li' +
            ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
            '><a href=" ' + url + ' ">' + options.fn(this) + '</a></li>';
           },
           equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
            return options.inverse(this);
            } else {
            return options.fn(this);
            }
           }
    }
}));
app.set('view engine', '.hbs');


const storage = multer.diskStorage({
    destination: "./public/photos/uploaded",
    filename: function (req, file, cb) {
      // we write the filename as the current date down to the millisecond
      // in a large web service this would possibly cause a problem if two people
      // uploaded an image at the exact same time. A better way would be to use GUID's for filenames.
      // this is a simple example.
      cb(null, Date.now() + path.extname(file.originalname));
    }
});
  
  // tell multer to use the diskStorage function for naming files instead of the default.
const upload = multer({ storage: storage });
// setup a 'home' to listen on the default url path
//listening to server
function onHttpStart(){
    console.log("Express http server listening on "+ HTTP_PORT);
}
//home page
app.get("/", (req, res) => {
    res.render('home', {
        //data: someData,
    });
});
//contact page
app.get("/contact", (req, res) => {
    res.render('contact', {
        //data: someData,
    });
});
//admission page
app.get("/admission", (req, res) => {
    res.render('admission', {
        //data: someData,
    });
});
//office for admission
app.post("/admission", (req, res) => {
    
});
//Office page
app.get("/office", (req, res) => {
    res.render('office', {
        //data: someData,
    });
});

var usr;

app.post("/office",(req, res) => {
    lgn.checkUser(req.body).then(function(user){
        req.userSession.user = {
            userName: user.username,
        }
        usr=user;
        res.redirect('/workspace');
        
        //res.send(user);
    }).catch(function(err){
        res.render('office', {
            errorMessage: err, 
            userName: req.body.userName
        });
    });
//    res.send(req.body);
});

//Office page
app.get("/workspace",ensureLogin, (req, res) => {
    res.render('work', {
        data: usr,
    });
});
//page not found
app.use((req, res) => {
    res.status(404).render('pagenotfound', {
        //data: someData,
    });
});

// setup http server to listen on HTTP_PORT
/*
lgn.initialize().then(function(result){*/
    serverStart();/*
}).catch(function(rmsg){
    console.log(rmsg);
});*/

//function to start server
function serverStart(){
    app.listen(HTTP_PORT,onHttpStart);
}
//app.listen(HTTP_PORT,onHttpStart);