const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const mysql = require('mysql');
const con = require('../connection');

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

router.post('/', function(req, res) {
    const credentials = req.body.user;
    con.query("SELECT * FROM users WHERE username = "+mysql.escape(credentials.username)+" AND password = "+mysql.escape(hashPassword(credentials.password)), function (err, result) {
        if(err) return res.status(500).end();
        if(result.length != 1) return res.status(403).end();

        res.writeHead(200, { "Content-type": "application/json" });
        res.end(JSON.stringify(regenerateToken(credentials.username)));
    });
});

module.exports = router