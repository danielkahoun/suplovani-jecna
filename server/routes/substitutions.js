const express = require('express')
const router = express.Router()
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

router.post('/create', isAdmin, (req, res) => { 
    req.body.new_subject_id = (!req.body.new_subject_id) ? null : req.body.new_subject_id;
    req.body.new_teacher_id = (!req.body.new_teacher_id) ? null : req.body.new_teacher_id;
    req.body.new_room = (!req.body.new_room) ? null : req.body.new_room;
    req.body.custom_title = (!req.body.custom_title) ? null : req.body.custom_title;
    req.body.information = (!req.body.information) ? null : req.body.information;

    con.query("INSERT INTO substitutions(lesson_id, type, date, new_subject_id, new_teacher_id, new_room, custom_title, information) VALUES ("+mysql.escape(req.body.id)+","+mysql.escape(req.body.type)+","+mysql.escape(req.body.date)+","+mysql.escape(req.body.new_subject_id)+","+mysql.escape(req.body.new_teacher_id)+","+mysql.escape(req.body.new_room)+","+mysql.escape(req.body.custom_title)+","+mysql.escape(req.body.information)+")", function (err) {
        if(err) return res.status(500).end();

        res.writeHead(200, { "Content-type": "application/json" });
        res.end();
    });
});

router.post('/update', isAdmin, (req, res) => {
    req.body.new_subject_id = (!req.body.new_subject_id) ? null : req.body.new_subject_id;
    req.body.new_teacher_id = (!req.body.new_teacher_id) ? null : req.body.new_teacher_id;
    req.body.new_room = (!req.body.new_room) ? null : req.body.new_room;
    req.body.custom_title = (!req.body.custom_title) ? null : req.body.custom_title;
    req.body.information = (!req.body.information) ? null : req.body.information;
    
    con.query("UPDATE substitutions SET type = "+mysql.escape(req.body.type)+", new_subject_id = "+mysql.escape(req.body.new_subject_id)+", new_teacher_id = "+mysql.escape(req.body.new_teacher_id)+", new_room = "+mysql.escape(req.body.new_room)+", custom_title = "+mysql.escape(req.body.custom_title)+", information = "+mysql.escape(req.body.information)+" WHERE id = "+mysql.escape(req.body.substitution_id), function (err) {
        if(err) return res.status(500).end();

        res.writeHead(200, { "Content-type": "application/json" });
        res.end();
    });
});

router.post('/delete', isAdmin, (req, res) => {
    con.query("DELETE FROM substitutions WHERE id = "+mysql.escape(req.body.id), function (err) {
        if(err) return res.status(500).end();

        res.writeHead(200, { "Content-type": "application/json" });
        res.end();
    });
});

module.exports = router