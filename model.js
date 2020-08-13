let mysql = require("mysql");

let database = require("./config/database.js");

let connection = mysql.createConnection(database);

//连接数据库
connection.connect((err) =>{
    if(err){throw err}
});

module.exports = function query(sql){
    return new Promise((resolve,reject)=>{
        connection.query(sql,(err,rows,field)=>{
            if(err){ reject(err)}
            resolve(rows);
        });
    })
}