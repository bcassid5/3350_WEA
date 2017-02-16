var express = require('express');
var router = express.Router();
var models = require('../models/studentsRecordsDB');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var highSchoolSubject = new models.HighSchoolSubjects(request.body.highSchoolSubject);
        highSchoolSubject.save(function (error) {
            if (error) response.send(error);
            response.json({highSchoolSubject: highSchoolSubject});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        console.log("0");
        var Student = request.query.filter;
        if (!Student) {
            console.log("1");
            models.HighSchoolSubjects.find(function (error, highSchoolSubjects) {
                if (error) response.send(error);
                response.json({highSchoolSubject: highSchoolSubjects});
            });   
        } else {
            models.HighSchoolSubjects.find({"student": Student.student}, function (error, students) {
                if (error) response.send(error);
                response.json({highSchoolSubject: students});
            });
        }
    });
router.route('/:highSchoolSubject_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        models.HighSchoolSubjects.findById(request.params.highSchoolSubject_id, function (error, highSchoolSubject) {
            if (error) response.send(error);
            response.json({highSchoolSubject: highSchoolSubject});
        })
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        models.HighSchoolSubjects.findById(request.params.highSchoolSubject_id, function (error, highSchoolSubject) {
            if (error) {
                response.send({error: error});
            }
            else {
                highSchoolSubject.type = request.body.highSchoolSubject.type;

                highSchoolSubject.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({highSchoolSubject: highSchoolSubject});
                    }
                });
            }
        })
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        models.HighSchoolSubjects.findByIdAndRemove(request.params.highSchoolSubject_id,
            function (error, deleted) {
                if (!error) {
                    response.json({highSchoolSubject: deleted});
                }
            }
        );
    });
module.exports=router;