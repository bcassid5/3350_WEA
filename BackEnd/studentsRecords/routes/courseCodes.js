var express = require('express');
var router = express.Router();
var models = require('../models/programMark');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        

        var courseCode = new models.CourseCodes(request.body.courseCode);
        
        courseCode.save(function (error) {
            if (error) response.send(error);
            response.json({courseCode: courseCode});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var Student = request.query;
        if (!Student) {
            
            models.CourseCodes.find(function (error, courseCodes) {
                if (error) response.send(error);
                response.json({courseCode: courseCodes});
            });
        } else {
            
            models.CourseCodes.find({"student": Student.student}, function (error, courseCode) {
                if (error) response.send(error);
                response.json({courseCode: courseCode});
            });
        }
    });

router.route('/:courseCode_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        models.CourseCodes.findById(request.params.courseCode_id, function (error, courseCode) {
            if (error) response.send(error);
            response.json({courseCode: courseCode});
        })
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        models.CourseCodes.findById(request.params.courseCode_id, function (error, courseCode) {
            if (error) {
                response.send({error: error});
            }
            else {
                courseCode.courseNumber = request.body.courseCode.courseNumber;
                courseCode.courseLetter = request.body.courseCode.courseLetter;
                courseCode.name = request.body.courseCode.name;
                courseCode.unit = request.body.courseCode.unit;
                courseCode.term=request.body.courseCode.term;
                courseCode.mark=request.body.courseCode.mark;
                courseCode.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({courseCode: courseCode});
                    }
                });
            }
        })
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        models.CourseCodes.findByIdAndRemove(request.params.courseCode_id,
            function (error, deleted) {
                if (!error) {
                    response.json({courseCode: deleted});
                }
            }
        );
    });

module.exports = router;
