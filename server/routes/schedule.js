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

function getUserDetails(token, callback) {
    con.query("SELECT * FROM users WHERE token = "+mysql.escape(token), function(err, result) {
        if (err) {
            callback(err, null);
        }else {
            callback(null, result[0]);
        }
    });
}

function groupByDays(data) {
    return data.reduce((aggObj, child) => {
        if(aggObj.hasOwnProperty(child.day)){
            aggObj[child.day].push(child);
        }else {
            aggObj[child.day] = [child];
        }
        return aggObj
    }, {})
}

function groupByClass(data) {
    return data.reduce((aggObj, child) => {
        if(aggObj.hasOwnProperty(child.class)){
            aggObj[child.class].push(child);
        }else {
            aggObj[child.class] = [child];
        }
        return aggObj
    }, {})
}

router.get('/get', function(req, res) {
    getUserDetails(req.headers.authorization, function(err, data) {
        if(err) return res.status(500).end();

        let query;
        if(data.role == 1) {
            query = "SELECT * FROM schedule WHERE teacher_id = " + mysql.escape(data.id);
        }else if(data.role == 0) {
            query = "SELECT * FROM schedule WHERE class_id = " + mysql.escape(data.class_id);
        }else {
            return res.status(403).end();
        }

        con.query(query, function (err, result) {
            if (err) throw err;

            const groupedData = groupByDays(result);

            res.writeHead(200, { "Content-type": "application/json" });
            res.end(JSON.stringify(groupedData));
        });
    });
});

router.get('/get/:date', isAdmin, (req, res) => {
    getUserDetails(req.headers.authorization, function(err) {
        if(err) return res.status(500).end();

        let date = new Date(req.params.date);
        let query = 'select "lessons"."id" AS "id","substitutions"."id" AS "substitution_id","lessons"."subject_id" AS "subject_id","lessons"."teacher_id" AS "teacher_id","lessons"."class_id" AS "class_id","substitutions"."date" AS "date","lessons"."day" AS "day","lessons"."hour" AS "hour","subjects"."name" AS "subject_name","subjects"."abbr" AS "subject_abbr","classes"."name" AS "class",concat("users"."first_name",\' \',"users"."last_name") AS "teacher_name","lessons"."room" AS "room","substitutions"."type" AS "type","substitutions"."new_subject_id" AS "new_subject_id",(select "subjects"."name" from "subjects" where ("subjects"."id" = "substitutions"."new_subject_id")) AS "new_subject_name",(select "subjects"."abbr" from "subjects" where ("subjects"."id" = "substitutions"."new_subject_id")) AS "new_subject_abbr","substitutions"."new_teacher_id" AS "new_teacher_id",(select concat("users"."first_name",\' \',"users"."last_name") from "users" where ("users"."id" = "substitutions"."new_teacher_id")) AS "new_teacher_name","substitutions"."new_room" AS "new_room","substitutions"."custom_title" AS "custom_title","substitutions"."information" AS "information" from (((("lessons" left join "substitutions" on(((("substitutions"."lesson_id" = "lessons"."id") and ("substitutions"."date" = '+mysql.escape(req.params.date)+')) or ("substitutions"."date" is null)))) join "subjects" on(("subjects"."id" = "lessons"."subject_id"))) join "classes" on(("classes"."id" = "lessons"."class_id"))) join "users" on(("users"."id" = "lessons"."teacher_id"))) where day = '+mysql.escape(date.getDay())+' order by "lessons"."day","lessons"."hour"';

        con.query(query, function (err, result) {
            if (err) throw err;

            const groupedData = groupByClass(result);

            res.writeHead(200, { "Content-type": "application/json" });
            res.end(JSON.stringify(groupedData));
        });
    });
});

router.get('/getClasses', function(req, res) {
    con.query("SELECT * FROM classes", function (err, result) {
        if(err) return res.status(500).end();
        
        res.writeHead(200, { "Content-type": "application/json" });
        res.end(JSON.stringify(result));
    });
});

router.get('/getTeachers', function(req, res) {
    con.query("SELECT users.id, users.first_name, users.last_name FROM users WHERE role = 1", function (err, result) {
        if(err) return res.status(500).end();
        
        res.writeHead(200, { "Content-type": "application/json" });
        res.end(JSON.stringify(result));
    });
});

router.get('/getSubjects', function(req, res) {
    con.query("SELECT * FROM subjects", function (err, result) {
        if(err) return res.status(500).end();
        
        res.writeHead(200, { "Content-type": "application/json" });
        res.end(JSON.stringify(result));
    });
});

module.exports = router