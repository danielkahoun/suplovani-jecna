var mysql = require('mysql');

var con = mysql.createConnection({
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    ssl: process.env.DB_SSL_CA && {
        ca: Buffer.from(process.env.DB_SSL_CA, "base64").toString("ascii"),
        rejectUnauthorized: false
    }
});

con.connect(function(err) {
    if (err) throw err;
    console.log("App is connected to database");
});

module.exports = con;