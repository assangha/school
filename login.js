var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var loginSchema = new Schema({
  "username":  String,
  "password": String  
});

//mongodb+srv://assangha2:37636494.Sn@School.a43e4.mongodb.net/school?retryWrites=true&w=majority
var uri="mongodb+srv://assangha2:37636494.Sn@School.a43e4.mongodb.net/school?retryWrites=true&w=majority";
let User;
var lgn;
//connecting to database on server start
module.exports.initialize = function(){
    return new Promise(function(resolve,reject){
        lgn = mongoose.createConnection(uri,{useNewUrlParser: true, useUnifiedTopology: true}, function(error){
            if(error){
                reject(error);
            }
            else{
                mongoose.set('useCreateIndex', true);
                User = lgn.model("login", loginSchema);
                
                resolve();
            }
        });
    });
}

//to authenticate login
module.exports.checkUser = function(userData){
    return new Promise(function(resolve,reject){
        //resolve(hashValue);
         
        //User.find({ username : "gulbarg" }).exec().then((foundUser)=>{//userData.userName }).exec().then((foundUser)=>{
        User.findOne({"username" : userData.userName}).exec().then((foundUser)=>{
            resolve(foundUser);
            /*
           if(!foundUser){
                reject("Unable to find user : "+ userData.userName);
            }else{
                if(userData.password!=foundUser.password){
                    reject("Incorrect Password for user: "+userName);
                }else{
                    resolve(foundUser);
                }
            }
            */
        }).catch((err)=>{
            reject("Error: "+err);
        });
    });
}