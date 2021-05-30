const Sequelize = require('sequelize');
/*
Host
    ec2-54-166-167-192.compute-1.amazonaws.com
Database
    ddg3ugukfc8c9b
User
    vvibxqicykceps
Port
    5432
Password
    f5e9c8a0fd6aeb9d08fa8e97bc8ea14cb41c36ca946301bbfb191523bfa56eb7

*/
// set up sequelize to point to our postgres database
var sequelize = new Sequelize('ddg3ugukfc8c9b', 'vvibxqicykceps', 'f5e9c8a0fd6aeb9d08fa8e97bc8ea14cb41c36ca946301bbfb191523bfa56eb7', {
    host: 'ec2-54-166-167-192.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

var login = sequelize.define('login', {
    userName: {
        type: Sequelize.STRING,
    primaryKey: true},  // User Name
    fullName: Sequelize.STRING,
    email: Sequelize.STRING,
    passcode: Sequelize.STRING, // Passcode
},{
    createdAt: false, // disable createdAt
    updatedAt: false // disable updatedAt
});

module.exports.initialize = function(){
    return new Promise(function(resolve,reject){
        
        sequelize.authenticate().then(function() {
            console.log('Connection has been established successfully.');
            resolve();
        }).catch(function(err) {
            reject('Unable to connect to the database:', err);
        });
    })
}

module.exports.checkUser = function(user){
    return new Promise(function(resolve,reject){
        sequelize.sync().then(function () {
        
            login.findAll({ 
                attributes: ['userName'],
                where: {
                    userName: user.userName,
                    passcode: user.password
                }
            }).then(function(data){
                
                if(data=="undefined"||data==null||data==""){
                    reject("Username or password does not match");
                }else{
                    var usr=data;
                    resolve(usr[0].userName);
                }
            }).catch(function(err) {
                reject(err);
            });

        });
    })
}

module.exports.register = function(user){

    return new Promise(function(resolve,reject){
        if(user.password===user.password1){
            sequelize.sync().then(function () {
               try{login.create({
                    userName: user.userName,
                    fullName: user.fullName,
                    email: user.email,
                    passcode: user.password
                }).then(function (user) {
                    resolve();
                }).catch(function (error) {
                    reject(error);
                });}catch(err){reject(err)}
            });
        }else{
            reject("Password does not match");
        }
    })
}

module.exports.delete = function(user){
    return new Promise(function(resolve,reject){
        sequelize.sync().then(function () {
            
            login.findAll({ 
                attributes: ['userName'],
                where: {
                    userName: user.userName,
                    passcode: user.password
                }
            }).then(function(data){
                
                if(data=="undefined"||data==null||data==""){
                    reject("Username or password does not match");
                }else{
                    login.destroy({
                        where: { 
                            userName: user.userName,
                            passcode: user.password 
                        }
                    }).then(function () { 
                        resolve("User "+user.userName+" deleted");
                    }).catch(function(err) {
                        reject(err);
                    });
                }
            }).catch(function(err) {
                reject(err);
            });
        });
    })
}