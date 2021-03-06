var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require("path");
const multer = require("multer");
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
const exphbs = require('express-handlebars');
app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.use(express.static('public'));
app.use(express.static(__dirname + '/public'));
var lgn = require('./login');
var clientSessions = require("client-sessions"); 
var adm = require('./admission');
const fs = require('fs');
let alert = require('alert');

// Setup client-sessions
app.use(clientSessions({
    cookieName: "userSession", // this is the object name that will be added to 'req'
    secret: "madebyabhaipalsangha", // this should be a long un-guessable string.
    duration: 5 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60 * 5 // the session will be extended by this many ms each request (1 minute)
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

// Setup client-sessions
app.use(clientSessions({
    cookieName: "candidateSession", // this is the object name that will be added to 'req'
    secret: "madebyabhaipalsangha", // this should be a long un-guessable string.
    duration: 60 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60 * 60 // the session will be extended by this many ms each request (1 minute)
  }));
  app.use(function(req, res, next) {
    res.locals.session = req.candidateSession;
    next();
});

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
      cb(null, req.candidateSession.student +"_"+req.file.fieldname+ path.extname(file.originalname));
    }
});
  
  // tell multer to use the diskStorage function for naming files instead of the default.
const upload = multer({ storage: storage }).array('candidate_documents',8);
// setup a 'home' to listen on the default url path
//listening to server
function onHttpStart(){
    console.log("Express http server listening on "+ HTTP_PORT);
}
//home page
app.get("/", (req, res) => {
    res.render('home1', {
                                    
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
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        res.send(req.files);
        res.send(req.body);
    });
    
    /*
    adm.register(req.body).then(function(student){
        req.candidateSession.student = {
            student: student,
        }
        res.redirect('/');
    }).catch(function(err){
        res.render('admission', {
            errorMessage: err
        });
    });*/
    res.json(req.body);
});

//contact page
app.get("/facilities", (req, res) => {
    fs.readdir("./public/photos/facilities", function(err, items) {
        res.render('facility', {
            data: items
        });
    });
});

app.get("/premises", (req, res) => {
    fs.readdir("./public/photos/premises", function(err, items) {
        res.render('premises', {
            data: items,
        });
    });
});

app.get("/staff", (req, res) => {
    fs.readdir("./public/photos/staff", function(err, items) {
        res.render('staff', {
            data: items,
        });
    });
});

app.get("/contact", (req, res) => {
    res.render('contact', {
        //data: someData,
    });
});

app.get("/images", (req, res) => {
    fs.readdir("./public/photos/facilities", function(err, items) {
        if(err){
            res.render('images', {
                error: err 
            });
        }else{
            fs.readdir("./public/photos/premises", function(err1, items1) {
                if(err1){
                    res.render('images', {
                        error: err1 
                    });
                }else{
                    fs.readdir("./public/photos/staff", function(err2, items2) {
                        if(err2){
                            res.render('images', {
                                error: err2 
                            });
                        }else{
                            res.render('images', {
                                data: items,
                                data1: items1,
                                data2: items2
                            });
                        }
                    });
                }
            });
        }
    });
});


//Office page
app.get("/office", (req, res) => {
    res.render('office', {
        //data: someData,
    });
});

app.post("/office",(req, res) => {
    lgn.checkUser(req.body).then(function(user){
        
        req.userSession.user = {
            userName: user,
        }
        res.redirect('/workspace');
        
        //res.send(usr);
    }).catch(function(err){
        res.render('office', {
            errorMessage: err, 
            userName: req.body.userName
        });
        //console.log(err);
    });
//    res.send(req.body);
});

app.get("/logout", function(req, res) {
    req.userSession.reset();
    res.redirect("/office");
  });

app.post("/register",(req, res) => {
    
    lgn.register(req.body).then(function(user){
        res.redirect('/office');
    }).catch(function(err){
        res.render('work', {
            errorMessage: err
        });
    });
});

app.post("/delete",(req, res) => {
    
    lgn.delete(req.body).then(function(user){
        alert(user);
        res.redirect('/workspace');
    }).catch(function(err){
        alert(err);
        res.redirect('/workspace');
    });
});

//Office page
app.get("/workspace",ensureLogin, (req, res) => {
    fs.readdir("./public/images/uploaded", function(err, items) {
        if(err){
            res.render('work', {
                data: req.userSession.user,
                err: "Cannot Open Files"
            });
        }else{
            adm.getstudents().then(function(name){
                res.render('work', {
                    data: req.userSession.user,
                    img: items,
                    name: name
                });    
            }).catch(function(err){
                res.render('work', {
                    data: req.userSession.user,
                    img: items,
                    err: err
                });
            });
        }
    });
    
});
//page not found
app.use((req, res) => {
    res.status(404).render('pagenotfound', {
        //data: someData,
    });
});

// setup http server to listen on HTTP_PORT

lgn.initialize().then(function(result){
    serverStart();
}).catch(function(rmsg){
    console.log(rmsg);
});

//function to start server
function serverStart(){
    app.listen(HTTP_PORT,onHttpStart);
}
//app.listen(HTTP_PORT,onHttpStart);