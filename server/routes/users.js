const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const mysql = require('mysql');
const con = require('../connection');

function isAdmin(req, res, next) {
    con.query("SELECT role FROM users WHERE token = "+mysql.escape(req.headers.authorization), function(err, result) {
        if (err) return res.status(500).end();
        
        if (result[0].role != 2) {
            return res.status(403).end();
        }else {
            next();
        }
    });
}

function hashPassword(password) {
    let pw2hash = password + "5b6t1Ou6JJDQ6A";
    return crypto.createHash("sha256").update(pw2hash).digest('hex');
}

router.get('/me', (req, res) => {
    con.query("SELECT * FROM users WHERE token = "+mysql.escape(req.headers.authorization), function (err, result) {
        if(err) return res.status(500).end();

        if(result.length == 1) {
            res.writeHead(200, { "Content-type": "application/json" });
            res.end(JSON.stringify({ "user": { "username": result[0].username, "first_name": result[0].first_name, "last_name": result[0].last_name, "role": result[0].role, "calendar_key": result[0].calendar_key }}));
        }else {
            res.status(403).end();
        }
    });
});

router.get('/get', isAdmin, (req, res) => {
    con.query("SELECT users.id,username,first_name,last_name,role,class_id,creation_date,classes.name as class_name FROM users LEFT JOIN classes ON users.class_id = classes.id", function (err, result) {
        if(err) return res.status(500).end();

        res.writeHead(200, { "Content-type": "application/json" });
        res.end(JSON.stringify(result));
    });
});

router.post('/create', isAdmin, (req, res) => {
    let username = req.body.first_name.normalize("NFD").replace(/[\u0300-\u036f]/g, "") + req.body.last_name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let calendar_key = crypto.randomBytes(12).toString('hex');

    con.query("INSERT INTO users(username, password, first_name, last_name, role, class_id, calendar_key) VALUES ("+mysql.escape(username.toLowerCase())+","+mysql.escape(hashPassword(req.body.password))+","+mysql.escape(req.body.first_name)+","+mysql.escape(req.body.last_name)+","+mysql.escape(req.body.role)+","+mysql.escape(!req.body.class_id ? null : req.body.class_id)+","+mysql.escape(calendar_key)+")", function (err) {
        if(err) res.status(500).end();
        
        res.writeHead(200, { "Content-type": "application/json" });
        res.end();
    });
});

router.delete('/delete/:id', isAdmin, (req, res) => {
    con.query("DELETE FROM users WHERE id = "+mysql.escape(req.params.id), function (err) {
        if(err) return res.status(500).end();

        res.writeHead(200, { "Content-type": "application/json" });
        res.end();
    });
});

module.exports = router