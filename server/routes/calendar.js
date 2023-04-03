const express = require('express')
const router = express.Router()
const mysql = require('mysql');
const ics = require('ics');
const con = require('../connection');

function getUserDetails(token, callback) {
    con.query("SELECT * FROM users WHERE calendar_key = "+mysql.escape(token), function(err, result) {
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

router.get('/:token', (req, res) => {
    getUserDetails(req.params.token, function(err, data) {
        if(err) return res.status(500).end();

        let query;
        if(data.role == 1) {
            query = "SELECT * FROM schedule WHERE teacher_id = " + mysql.escape(data.id);
        }else if(data.role == 0) {
            query = "SELECT * FROM schedule WHERE class_id = " + mysql.escape(data.class_id);
        }
        
        con.query(query, function (err, result) {
            if (err) throw err;
    
            const groupedData = groupByDays(result);
    
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
    
                    let eventLocation;
                    if(groupedData[day][i].new_room != null) {
                        eventLocation = 'učebna č. '+groupedData[day][i].new_room;
                    }else {
                        eventLocation = 'učebna č. '+groupedData[day][i].room;
                    }
    
                    let eventDescription;
                    if(groupedData[day][i].new_teacher_name != null) {
                        eventDescription = 'Náhradní vyučující: '+groupedData[day][i].new_teacher_name;
                    }else {
                        eventDescription = 'Vyučující: '+groupedData[day][i].teacher_name;
                    }
    
                    let event = {
                        title: eventTitle,
                        start: [date.getFullYear(), date.getMonth()+1, date.getDate(), hour-1, minutes],
                        duration: { minutes: 45 },
                        description: eventDescription,
                        location: eventLocation,
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
});

module.exports = router