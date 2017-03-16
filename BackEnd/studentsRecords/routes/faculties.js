var express = require('express');
var router = express.Router();
var models = require('../models/studentsRecordsDB');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();
console.log("WHAT THE FUCK?!");
router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        

        var faculty = new models.Faculties(request.body.faculty);
        
        faculty.save(function (error) {
            if (error) response.send(error);
            response.json({faculty: faculty});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var Student = request.query.filter;
        console.log("12");
        if (!Student) {
            
            models.Faculties.find(function (error, faculties) {
                if (error) response.send(error);
                response.json({faculty: faculties});
            });
        } else {
            
            models.Faculties.find({"students": Student.student}, function (error, students) {
                if (error) response.send(error);
                response.json({faculty: students});
            });
        }
    });

router.route('/:faculty_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        models.Faculties.findById(request.params.faculty_id, function (error, faculty) {
            if (error) response.send(error);
            response.json({faculty: faculty});
        })
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        models.Faculties.findById(request.params.faculty_id, function (error, faculty) {
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
        models.Faculties.findByIdAndRemove(request.params.faculty_id,
            function (error, deleted) {
                if (!error) {
                    response.json({faculty: deleted});
                }
            }
        );
    });

module.exports = router;
