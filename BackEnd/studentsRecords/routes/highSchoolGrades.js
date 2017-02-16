var express = require('express');
var router = express.Router();
var models = require('../models/studentsRecordsDB');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var highSchoolGrade = new models.HighSchoolGrades(request.body.highSchoolGrade);
        highSchoolGrade.save(function (error) {
            if (error) response.send(error);
            response.json({highSchoolGrade: highSchoolGrade});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        console.log("0");
        var Student = request.query.filter;
        if (!Student) {
            console.log("1");
            models.HighSchoolGrades.find(function (error, highSchoolGrades) {
                if (error) response.send(error);
                response.json({highSchoolGrade: highSchoolGrades});
            });   
        } else {
            models.HighSchoolGrades.find({"student": Student.student}, function (error, students) {
                if (error) response.send(error);
                response.json({highSchoolGrade: students});
            });
        }
    });
router.route('/:highSchoolGrade_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        models.HighSchoolGrades.findById(request.params.highSchoolGrade_id, function (error, highSchoolGrade) {
            if (error) response.send(error);
            response.json({highSchoolGrade: highSchoolGrade});
        })
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        models.HighSchoolGrades.findById(request.params.highSchoolGrade_id, function (error, highSchoolGrade) {
            if (error) {
                response.send({error: error});
            }
            else {
                highSchoolGrade.type = request.body.highSchoolGrade.type;

                highSchoolGrade.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({highSchoolGrade: highSchoolGrade});
                    }
                });
            }
        })
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        models.HighSchoolGrades.findByIdAndRemove(request.params.highSchoolGrade_id,
            function (error, deleted) {
                if (!error) {
                    response.json({highSchoolGrade: deleted});
                }
            }
        );
    });
module.exports=router;