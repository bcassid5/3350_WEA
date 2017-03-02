var express = require('express');
var router = express.Router();
var models = require('../models/studentsRecordsDB');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var highSchoolCourse = new models.HighSchoolCourses(request.body.highSchoolCourse);
        highSchoolCourse.save(function (error) {
            if (error) response.send(error);
            response.json({highSchoolCourse: highSchoolCourse});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        console.log("0");
        var Student = request.query.filter;
        if (!Student) {
            console.log("1");
            models.HighSchoolCourses.find(function (error, highSchoolCourses) {
                if (error) response.send(error);
                response.json({highSchoolCourse: highSchoolCourses});
            });   
        } else {
            models.HighSchoolCourses.find({"student": Student.student}, function (error, students) {
                if (error) response.send(error);
                response.json({highSchoolCourse: students});
            });
        }
    });
router.route('/:highSchoolCourse_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        models.HighSchoolCourses.findById(request.params.highSchoolCourse_id, function (error, highSchoolCourse) {
            if (error) response.send(error);
            response.json({highSchoolCourse: highSchoolCourse});
        })
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        models.HighSchoolCourses.findById(request.params.highSchoolCourse_id, function (error, highSchoolCourse) {
            if (error) {
                response.send({error: error});
            }
            else {
                console.log(request.body);
                highSchoolCourse.level = request.body.highSchoolCourse.level;
                highSchoolCourse.source = request.body.highSchoolCourse.source;
                highSchoolCourse.unit = request.body.highSchoolCourse.unit;
                highSchoolCourse.subject = request.body.highSchoolCourse.subject;
                highSchoolCourse.highschool = request.body.highschool;
                highSchoolCourse.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({highSchoolCourse: highSchoolCourse});
                    }
                });
            }
        })
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        models.HighSchoolCourses.findByIdAndRemove(request.params.highSchoolCourse_id,
            function (error, deleted) {
                if (!error) {
                    response.json({highSchoolCourse: deleted});
                }
            }
        );
    });
module.exports=router;