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
                    username: user.userName
                }
            }).then(function(data){
                if(!data){
                    if(data.passcode==user.password){
                        resolve();
                    }else{
                        reject("Username or Password is incorredt");
                    }
                }else{
                    reject("User not found");
                }
            });
        });
    })
}

module.exports.register = function(user){
    return new Promise(function(resolve,reject){
        if(user.password===user.password1){
            sequelize.sync().then(function () {
                login.create({
                    userName: user.userName,
                    fullName: user.fullName,
                    email: user.email,
                    passcode: user.password
                }).then(function (user) {
                    resolve();
                }).catch(function (error) {
                    reject(error);
                });
            });
        }else{
            reject("Password does not match");
        }
    })
}