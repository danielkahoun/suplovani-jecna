const express = require('express')
const fs = require('fs')
const crypto = require('crypto')
const cors = require('cors');
const mysql = require('mysql');
const app = module.exports = express()
const port = 8080

const allowedOrigins = ['http://127.0.0.1:5173','http://localhost:5173','http://localhost:8080','http://127.0.0.1:8080','http://localhost'];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
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
    res.end(fs.readFileSync("../client/dist/index.html"));
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
            //query = "SELECT lessons.*, subjects.name AS subject, subjects.abbr AS subject_abbr, classes.name AS class, users.first_name, users.last_name FROM lessons INNER JOIN subjects ON subjects.id = lessons.subject_id INNER JOIN classes ON classes.id = lessons.class_id INNER JOIN users ON users.id = lessons.teacher_id WHERE day = " + mysql.escape(new Date().getDay()) + " ORDER BY day, hour ASC";
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
    con.query("INSERT INTO substitutions(type, date, hour, new_teacher, new_classroom, new_subject, custom_title, information) VALUES ("+mysql.escape(req.body.type)+","+mysql.escape(new Date().toJSON().slice(0, 10))+","+mysql.escape(req.body.hour)+","+mysql.escape(req.body.new_teacher)+","+mysql.escape(req.body.new_classroom)+","+mysql.escape(req.body.new_subject)+","+mysql.escape(req.body.custom_title)+","+mysql.escape(req.body.information)+")", function (err, result) {
        if(err) {
            console.log(err);
            return res.status(500).end();
        }

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

app.listen(port, () => {
    console.log(`App is ready at http://127.0.0.1:${port}`)
})