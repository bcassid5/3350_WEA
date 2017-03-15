var express = require('express');
var router = express.Router();
var models = require('../models/studentsRecordsDB');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        

        var faculty = new models.faculties(request.body.faculty);
        
        faculty.save(function (error) {
            if (error) response.send(error);
            response.json({faculty: faculty});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var Student = request.query;
        
        if (!Student) {
            
            models.faculties.find(function (error, faculties) {
                if (error) response.send(error);
                response.json({faculty: faculties});
            });
        } else {
            
            models.faculties.find({"students": Student.student}, function (error, students) {
                if (error) response.send(error);
                response.json({faculty: students});
            });
        }
    });

router.route('/:advStandings_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        models.faculties.findById(request.params.advStanding_id, function (error, faculty) {
            if (error) response.send(error);
            response.json({faculty: faculty});
        })
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        models.faculties.findById(request.params.advStanding_id, function (error, faculty) {
            if (error) {
                response.send({error: error});
            }
            else {
                faculty.name = request.body.faculty.name;
                faculty.department = request.body.faculty.department;
                faculty.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({faculty: faculty});
                    }
                });
            }
        })
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        models.faculties.findByIdAndRemove(request.params.advStanding_id,
            function (error, deleted) {
                if (!error) {
                    response.json({faculty: deleted});
                }
            }
        );
    });

module.exports = router;
