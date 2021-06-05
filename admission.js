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

var sequelize = new Sequelize('ddg3ugukfc8c9b', 'vvibxqicykceps', 'f5e9c8a0fd6aeb9d08fa8e97bc8ea14cb41c36ca946301bbfb191523bfa56eb7', {
    host: 'ec2-54-166-167-192.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

var student = sequelize.define('student', {
    name: Sequelize.STRING,
    Father_name: Sequelize.STRING,
    Mother_name: Sequelize.STRING,
    DOB: Sequelize.DATE,
    Height: Sequelize.STRING,
    Weight: Sequelize.STRING,
    gender: Sequelize.STRING,
    Nationality: Sequelize.STRING,
    Religion: Sequelize.STRING,
    Caste: Sequelize.STRING,
    Adhaar: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    Address: Sequelize.STRING,
    Mobile: Sequelize.STRING,
    Email: Sequelize.STRING,
    Previous_Class: Sequelize.STRING,
    Previous_School: Sequelize.STRING,
    Previous_Board: Sequelize.STRING,
    Medium_of_study: Sequelize.STRING,
    Admission: Sequelize.STRING,
    Stream: Sequelize.STRING,
    Sibling_name: Sequelize.STRING,
    Sibling_class: Sequelize.STRING,
    account_number: Sequelize.STRING,
    account_name: Sequelize.STRING,
    Bank_name: Sequelize.STRING,
    Branch_name: Sequelize.STRING,
    IFSC_code: Sequelize.STRING,
},{
    createdAt: false, // disable createdAt
    updatedAt: false // disable updatedAt
});

module.exports.register=function(candidate){
    return new Promise(function(resolve,reject){
        sequelize.sync().then(function () {
            try{student.create({
                name: candidate.name,
                Father_name: candidate.Father_name,
                Mother_name: candidate.Mother_name,
                DOB: candidate.DOB,
                Height: candidate.Height,
                Weight: candidate.Weight,
                gender: candidate.gender,
                Nationality: candidate.Nationality,
                Religion: candidate.Religion,
                Caste: candidate.Caste,
                Adhaar: candidate.Adhaar,
                Address: candidate.Address,
                Mobile: candidate.Mobile,
                Email: candidate.Email,
                Previous_Class: candidate.Previous_Class,
                Previous_School: candidate.Previous_School,
                Previous_Board: candidate.Previous_Board,
                Medium_of_study: candidate.Medium_of_study,
                Admission: candidate.Admission,
                Stream: candidate.Stream,
                Sibling_name: candidate.Sibling_name,
                Sibling_class: candidate.Sibling_class,
                account_number: candidate.account_number,
                account_name: candidate.account_name,
                Bank_name: candidate.Bank_name,
                Branch_name: candidate.Branch_name,
                IFSC_code: candidate.IFSC_code,
             }).then(function (cnd) {
                resolve(candidate.Adhaar);
             }).catch(function (error) {
                 reject(error);
             });}catch(err){reject(err)}
         });
    });
}

module.exports.getstudents = function(){
    return new Promise(function(resolve,reject){
        sequelize.sync().then(function () {
        
            student.findAll({ 
                attributes: ['name']
            }).then(function(data){
                
                if(data=="undefined"||data==null||data==""){
                    reject("No Record Found");
                }else{
                    var name=data;
                    resolve(name[0].name);
                }
            }).catch(function(err) {
                reject(err);
            });

        });
    })
}