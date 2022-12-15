const express = require('express')
const fs = require('fs')
const crypto = require('crypto')
const cors = require('cors');
const mysql = require('mysql');
const app = module.exports = express()
const port = 8080

const allowedOrigins = ['http://127.0.0.1:5173','http://localhost:5173','http://localhost'];
app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }

}));

app.use('/assets', express.static('../client/dist/assets'));
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

/** Databáze */
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "jecnasuplovani"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

app.get('/', (req, res) => {
    res.writeHead(200, { "Content-type": "text/html" });
    res.end(fs.readFileSync("../client/dist/index.html"));
})



function hashPassword(password) {
    let pw2hash = password + "5b6t1Ou6JJDQ6A";
    return crypto.createHash("sha256").update(pw2hash).digest('hex');
}

function regenerateToken(username) {
    let token = crypto.randomBytes(40).toString('hex');

    con.query("UPDATE users SET token = "+mysql.escape(token)+" WHERE username = "+mysql.escape(username), function (err) {
        if (err) throw err;
    });

    return token;
}

app.get('/api/getProfile/:token', function(req, res) {
    res.writeHead(200, { "Content-type": "application/json" });

    con.query("SELECT * FROM users WHERE token = "+mysql.escape(req.params.token), function (err, result) {
        if (err) throw err;

        if(result.length == 1) {
            console.log(result[0]);
            res.end(JSON.stringify({ "user": { "username": result[0].username, "first_name": result[0].first_name, "last_name": result[0].last_name, "role": result[0].role }}));
        }
    });
});

app.get('/api/getUsers/:token', function(req, res) {
    res.writeHead(200, { "Content-type": "application/json" });

    // check for permissions

    con.query("SELECT id,username,first_name,last_name,role,creation_date FROM users", function (err, result) {
        if (err) throw err;

        console.log(result);
        res.end(JSON.stringify(result));
    });
});

/*app.get('/api/deleteUser/:id', function(req, res) {
    con.query("SELECT id,username,first_name,last_name,role,creation_date FROM users", function (err, result) {
        if (err) throw err;

        console.log(result);
        res.end(JSON.stringify(result));
    });
});*/



app.post('/login', function(req, res) {
    const credentials = req.body.user;
    
    con.query("SELECT * FROM users WHERE username = "+mysql.escape(credentials.username)+" AND password = "+mysql.escape(hashPassword(credentials.password)), function (err, result) {
        if (err) throw err;

        if(result.length == 1) {
            res.writeHead(200, { "Content-type": "application/json" });
            res.end(JSON.stringify(regenerateToken(credentials.username)));
        }else {
            res.status(403).end();
        }
    });
    
});




















app.get('/hashPassword/:pass', function(req, res) {
    res.writeHead(200);
    res.end(hashPassword(req.params.pass));
});





app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})