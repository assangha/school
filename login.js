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
    username: {
        type: Sequelize.STRING,
    primaryKey: true},  // User Name
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

module.exports.checkUser = function(){
    return new Promise(function(resolve,reject){
        sequelize.sync().then(function () {
        
            login.findAll({ 
                attributes: ['username'],
                where: {
                    username: "gulbarg"
                }
            }).then(function(data){
                console.log("All first names where id == 2");
                for(var i =0; i < data.length; i++){
                    console.log(data[i].username);
                }
                if(!data){
                    resolve(data[0]);
                }else{
                    reject("User not found");
                }
                
            });
        
        });
        
    })
}

module.exports.register = function(){
    return new Promise(function(resolve,reject){
        
    })
}