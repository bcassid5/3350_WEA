var express = require('express');
var router = express.Router();
var models = require('../models/studentsRecordsDB');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var highSchoolGrade = new models.HighSchoolGrades(request.body.highschoolGrade);
        highSchoolGrade.save(function (error) {
            if (error) response.send(error);
            response.json({highschoolGrade: highSchoolGrade});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        console.log("0");
        var Student = request.query.filter;
        if (!Student) {
            console.log("1");
            models.HighSchoolGrades.find(function (error, highSchoolGrades) {
                if (error) response.send(error);
                response.json({highschoolGrade: highSchoolGrades});
            });   
        } else {
            models.HighSchoolGrades.find({"student": Student.student}, function (error, students) {
                if (error) response.send(error);
                response.json({highschoolGrade: students});
            });
        }
    });
router.route('/:highSchoolGrade_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        models.HighSchoolGrades.findById(request.params.highSchoolGrade_id, function (error, highSchoolGrade) {
            if (error) response.send(error);
            response.json({highschoolGrade: highSchoolGrade});
        })
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        models.HighSchoolGrades.findById(request.params.highSchoolGrade_id, function (error, highSchoolGrade) {
            if (error) {
                response.send({error: error});
            }
            else {
                highSchoolGrade.grade = request.body.highschoolGrade.grade;
                highSchoolGrade.course =  request.body.highschoolGrade.course;
                highSchoolGrade.student = request.body.highschoolGrade.student;

                highSchoolGrade.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({highschoolGrade: highSchoolGrade});
                    }
                });
            }
        })
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        models.HighSchoolGrades.findByIdAndRemove(request.params.highSchoolGrade_id,
            function (error, deleted) {
                if (!error) {
                    response.json({highschoolGrade: deleted});
                }
            }
        );
    });
module.exports=router;