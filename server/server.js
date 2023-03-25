const express = require('express')
const fs = require('fs')
const crypto = require('crypto')
const ics = require('ics')
const cors = require('cors');
const mysql = require('mysql');
const app = module.exports = express()

const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = process.env.PORT || 3000;

app.use(cors());
app.use('/assets', express.static(__dirname+'/../client/dist/assets'));
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

/** Databáze */
var con = mysql.createConnection({
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    ssl: {
        ca: fs.readFileSync(__dirname + '/ca-certificate.crt'),
        rejectUnauthorized: false
    }
});

con.connect(function(err) {
    if (err) throw err;
    console.log("App is connected to database");
});

/** Middleware */

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


/** Functions */

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

function getUserDetails(token, callback) {
    con.query("SELECT * FROM users WHERE token = "+mysql.escape(token), function(err, result) {
        if (err) {
            callback(err, null);
        }else {
            callback(null, result[0]);
        }
    });
}

/** Web Routes (via Vue Router) */

app.get(['/','/login','/prehled','/uzivatele'], (req, res) => {
    res.writeHead(200, { "Content-type": "text/html" });
    res.end(fs.readFileSync(__dirname+"/../client/dist/index.html"));
});

/** Calendar */

app.get('/calendar', (req, res) => {
    con.query("SELECT * FROM schedule", function (err, result) {
        if (err) throw err;

        const groupedData = result.reduce((aggObj, child) => {
            if(aggObj.hasOwnProperty(child.day)){
                aggObj[child.day].push(child);
            }else {
                aggObj[child.day] = [child];
            }
            return aggObj
        }, {})

        let events = [];
        for(let day in groupedData) {
            let date = new Date()
            date.setDate(date.getDate() - (date.getDay() == day ? 7 : (date.getDay() + (7 - day)) % 7))

            for(let i = 0; i < groupedData[day].length; i++) {
                let hour;
                let minutes;

                switch(groupedData[day][i].hour) {
                    case 1:
                        hour = 7;
                        minutes = 30;
                        break;
                    case 2:
                        hour = 8;
                        minutes = 25;
                        break;
                    case 3:
                        hour = 9;
                        minutes = 20;
                        break;
                    case 4:
                        hour = 10;
                        minutes = 20;
                        break;
                    case 5:
                        hour = 11;
                        minutes = 15;
                        break;
                    case 6:
                        hour = 12;
                        minutes = 10;
                        break;
                    case 7:
                        hour = 13;
                        minutes = 5;
                        break;
                    case 8:
                        hour = 14;
                        minutes = 0;
                        break;
                    case 9:
                        hour = 14;
                        minutes = 55;
                        break;
                    case 10:
                        hour = 15;
                        minutes = 50;
                        break;
                    default:
                        break;
                }

                let eventTitle;
                if(groupedData[day][i].type == 'CHANGE') {
                    eventTitle = 'Suplování: ' + (groupedData[day][i].new_subject_name != null) ? groupedData[day][i].new_subject_name : groupedData[day][i].subject_name;
                }else if(groupedData[day][i].type == 'CANCELLED') {
                    eventTitle = 'Zrušeno: '+groupedData[day][i].subject_name;
                }else {
                    eventTitle = groupedData[day][i].subject_name;
                }

                let event = {
                    title: eventTitle,
                    start: [date.getFullYear(), date.getMonth()+1, date.getDate(), hour-1, minutes],
                    duration: { minutes: 45 },
                    description: (groupedData[day][i].new_teacher != null) ? 'Vyučující: '+groupedData[day][i].new_teacher : groupedData[day][i].teacher,
                    location: 'učebna č. '+ (groupedData[day][i].new_room != null) ? groupedData[day][i].new_room : groupedData[day][i].room,
                    recurrenceRule: 'FREQ=WEEKLY'
                }
                events.push(event);
            }
        }

        const { value } = ics.createEvents(events)
        
        res.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
        res.end(value);
    });
});

/** API Routes */

app.post('/api/login', function(req, res) {
    const credentials = req.body.user;
    con.query("SELECT * FROM users WHERE username = "+mysql.escape(credentials.username)+" AND password = "+mysql.escape(hashPassword(credentials.password)), function (err, result) {
        if(err) return res.status(500).end();
        if(result.length != 1) return res.status(403).end();

        res.writeHead(200, { "Content-type": "application/json" });
        res.end(JSON.stringify(regenerateToken(credentials.username)));
    });
});

app.get('/api/getProfile', (req, res) => {
    con.query("SELECT * FROM users WHERE token = "+mysql.escape(req.headers.authorization), function (err, result) {
        if(err) return res.status(500).end();

        if(result.length == 1) {
            res.writeHead(200, { "Content-type": "application/json" });
            res.end(JSON.stringify({ "user": { "username": result[0].username, "first_name": result[0].first_name, "last_name": result[0].last_name, "role": result[0].role }}));
        }else {
            res.status(403).end();
        }
    });
});

app.get('/api/getSchedule', function(req, res) {
    getUserDetails(req.headers.authorization, function(err, data) {
        if(err) return res.status(500).end();

        let query = "";
        if(data.role == 2) {
            // admin
            query = "SELECT * FROM schedule WHERE day = " + mysql.escape(new Date().getDay());
        }else if(data.role == 1) {
            // teachers
            query = "SELECT * FROM schedule WHERE teacher_id = " + mysql.escape(data.id);
        }else {
            // students
            query = "SELECT * FROM schedule WHERE class_id = " + mysql.escape(data.class_id);
        }

        con.query(query, function (err, result) {
            if (err) throw err;

            const groupedData = result.reduce((aggObj, child) => {
                if(data.role == 2) {
                    if(aggObj.hasOwnProperty(child.class)){
                        aggObj[child.class].push(child);
                    }else {
                        aggObj[child.class] = [child];
                    }
                }else {
                    if(aggObj.hasOwnProperty(child.day)){
                        aggObj[child.day].push(child);
                    }else {
                        aggObj[child.day] = [child];
                    }
                }
                return aggObj
            }, {})

            res.writeHead(200, { "Content-type": "application/json" });
            res.end(JSON.stringify(groupedData));
        });
    });
});

app.get('/api/getSchedule/:date', function(req, res) {
    getUserDetails(req.headers.authorization, function(err, data) {
        if(err) return res.status(500).end();

        let date = new Date(req.params.date);
        let query = 'select "lessons"."id" AS "id","substitutions"."id" AS "substitution_id","lessons"."subject_id" AS "subject_id","lessons"."teacher_id" AS "teacher_id","lessons"."class_id" AS "class_id","substitutions"."date" AS "date","lessons"."day" AS "day","lessons"."hour" AS "hour","subjects"."name" AS "subject_name","subjects"."abbr" AS "subject_abbr","classes"."name" AS "class",concat("users"."first_name",\' \',"users"."last_name") AS "teacher_name","lessons"."room" AS "room","substitutions"."type" AS "type","substitutions"."new_subject_id" AS "new_subject_id",(select "subjects"."name" from "subjects" where ("subjects"."id" = "substitutions"."new_subject_id")) AS "new_subject_name",(select "subjects"."abbr" from "subjects" where ("subjects"."id" = "substitutions"."new_subject_id")) AS "new_subject_abbr","substitutions"."new_teacher_id" AS "new_teacher_id",(select concat("users"."first_name",\' \',"users"."last_name") from "users" where ("users"."id" = "substitutions"."new_teacher_id")) AS "new_teacher_name","substitutions"."new_room" AS "new_room","substitutions"."custom_title" AS "custom_title","substitutions"."information" AS "information" from (((("lessons" left join "substitutions" on(((("substitutions"."lesson_id" = "lessons"."id") and ("substitutions"."date" = '+mysql.escape(req.params.date)+')) or ("substitutions"."date" is null)))) join "subjects" on(("subjects"."id" = "lessons"."subject_id"))) join "classes" on(("classes"."id" = "lessons"."class_id"))) join "users" on(("users"."id" = "lessons"."teacher_id"))) where day = '+mysql.escape(date.getDay())+' order by "lessons"."day","lessons"."hour"';

        con.query(query, function (err, result) {
            if (err) throw err;

            const groupedData = result.reduce((aggObj, child) => {
                if(aggObj.hasOwnProperty(child.class)){
                    aggObj[child.class].push(child);
                }else {
                    aggObj[child.class] = [child];
                }
                return aggObj
            }, {})

            res.writeHead(200, { "Content-type": "application/json" });
            res.end(JSON.stringify(groupedData));
        });
    });
});

app.get('/api/getClasses', function(req, res) {
    con.query("SELECT * FROM classes", function (err, result) {
        if(err) return res.status(500).end();
        
        res.writeHead(200, { "Content-type": "application/json" });
        res.end(JSON.stringify(result));
    });
});

app.get('/api/getTeachers', function(req, res) {
    con.query("SELECT users.id, users.first_name, users.last_name FROM users WHERE role = 1", function (err, result) {
        if(err) return res.status(500).end();
        
        res.writeHead(200, { "Content-type": "application/json" });
        res.end(JSON.stringify(result));
    });
});

app.get('/api/getSubjects', function(req, res) {
    con.query("SELECT * FROM subjects", function (err, result) {
        if(err) return res.status(500).end();
        
        res.writeHead(200, { "Content-type": "application/json" });
        res.end(JSON.stringify(result));
    });
});

app.get('/api/getUsers', isAdmin, (req, res, next) => {
    con.query("SELECT users.id,username,first_name,last_name,role,class_id,creation_date,classes.name as class_name FROM users LEFT JOIN classes ON users.class_id = classes.id", function (err, result) {
        if(err) return res.status(500).end();

        res.writeHead(200, { "Content-type": "application/json" });
        res.end(JSON.stringify(result));
    });
});

app.post('/api/addSubstitution', isAdmin, (req, res, next) => {
    con.query("INSERT INTO substitutions(lesson_id, type, date, new_subject_id, new_teacher_id, new_room, custom_title, information) VALUES ("+mysql.escape(req.body.id)+","+mysql.escape(req.body.type)+","+mysql.escape(req.body.date)+","+mysql.escape(req.body.new_subject_id)+","+mysql.escape(req.body.new_teacher_id)+","+mysql.escape(req.body.new_room)+","+mysql.escape(req.body.custom_title)+","+mysql.escape(req.body.information)+")", function (err, result) {
        if(err) return res.status(500).end();

        res.writeHead(200, { "Content-type": "application/json" });
        res.end();
    });
});

app.post('/api/editSubstitution', isAdmin, (req, res, next) => {
    con.query("UPDATE substitutions SET type = "+mysql.escape(req.body.type)+", new_subject_id = "+mysql.escape(req.body.new_subject_id)+", new_teacher_id = "+mysql.escape(req.body.new_teacher_id)+", new_room = "+mysql.escape(req.body.new_room)+", custom_title = "+mysql.escape(req.body.custom_title)+", information = "+mysql.escape(req.body.information)+" WHERE id = "+mysql.escape(req.body.substitution_id), function (err, result) {
        if(err) return res.status(500).end();

        res.writeHead(200, { "Content-type": "application/json" });
        res.end();
    });
});

app.post('/api/removeSubstitution', isAdmin, (req, res, next) => {
    con.query("DELETE FROM substitutions WHERE id = "+mysql.escape(req.body.id), function (err, result) {
        if(err) return res.status(500).end();

        res.writeHead(200, { "Content-type": "application/json" });
        res.end();
    });
});

app.post('/api/addUser', isAdmin, (req, res, next) => {
    let username = req.body.first_name.normalize("NFD").replace(/[\u0300-\u036f]/g, "") + req.body.last_name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    con.query("INSERT INTO users(username, password, first_name, last_name, role, class_id) VALUES ("+mysql.escape(username.toLowerCase())+","+mysql.escape(hashPassword(req.body.password))+","+mysql.escape(req.body.first_name)+","+mysql.escape(req.body.last_name)+","+mysql.escape(req.body.role)+","+mysql.escape((req.body.class_id == '' || req.body.class_id == undefined) ? null : req.body.class_id)+")", function (err, result) {
        if(err) res.status(500).end();
        
        res.writeHead(200, { "Content-type": "application/json" });
        res.end();
    });
});

app.delete('/api/deleteUser/:id', isAdmin, (req, res, next) => {
    con.query("DELETE FROM users WHERE id = "+mysql.escape(req.params.id), function (err, result) {
        if(err) return res.status(500).end();

        res.writeHead(200, { "Content-type": "application/json" });
        res.end();
    });
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});