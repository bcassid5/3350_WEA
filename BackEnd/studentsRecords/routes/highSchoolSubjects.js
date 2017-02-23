var express = require('express');
var router = express.Router();
var models = require('../models/studentsRecordsDB');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var highSchoolSubject = new models.HighSchoolSubjects(request.body.highschoolSubject);
        highSchoolSubject.save(function (error) {
            if (error) response.send(error);
            response.json({highschoolSubject: highSchoolSubject});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        console.log("0");
        var Student = request.query;
        if (!Student) {
            console.log("1");
            models.HighSchoolSubjects.find(function (error, highSchoolSubjects) {
                if (error) response.send(error);
                response.json({highschoolSubject: highSchoolSubjects});
            });   
        } else {
            models.HighSchoolSubjects.find({"student": Student.student}, function (error, students) {
                if (error) response.send(error);
                response.json({highschoolSubject: students});
            });
        }
    });
router.route('/:highSchoolSubject_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        models.HighSchoolSubjects.findById(request.params.highschoolSubject_id, function (error, highSchoolSubject) {
            if (error) response.send(error);
            response.json({highschoolSubject: highSchoolSubject});
        })
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        console.log('before');
        models.HighSchoolSubjects.findById(request.params.highSchoolSubject_id, function (error, highSchoolSubject) {
            if (error) {
                console.log('error lol');
                response.send({error: error});
            }
            else {
                console.log(request.body);
                highSchoolSubject.name = request.body.highschoolSubject.name;
                highSchoolSubject.description = request.body.highschoolSubject.description;
                console.log('before save');
                highSchoolSubject.save(function (error) {
                    console.log('inside save');
                    if (error) {
                        response.send({error: error});
                        console.log('in error 2');
                    }
                    else {
                        response.json({highschoolSubject: highSchoolSubject});
                        console.log('in else 2');
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