var express = require('express');
var router = express.Router();
var models = require('../models/studentsRecordsDB');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        

        var logExpress = new models.logExpresses(request.body.logExpress);
        
        logExpress.save(function (error) {
            if (error) response.send(error);
            response.json({logExpress: logExpress});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var Student = request.query;
        
        if (!Student) {
            
            models.logExpresses.find(function (error, logExpresses) {
                if (error) response.send(error);
                response.json({logExpress: logExpresses});
            });
        } else {
            
            models.logExpresses.find({"students": Student.student}, function (error, students) {
                if (error) response.send(error);
                response.json({logExpress: students});
            });
        }
    });

router.route('/:logExpresses_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        models.logExpresses.findById(request.params.logExpress_id, function (error, logExpress) {
            if (error) response.send(error);
            response.json({logExpress: logExpress});
        })
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        models.logExpresses.findById(request.params.logExpress_id, function (error, logExpress) {
            if (error) {
                response.send({error: error});
            }
            else {
                logExpress.course = request.body.logExpress.course;
                logExpress.description = request.body.logExpress.description;
                logExpress.unit = request.body.logExpress.unit;
                logExpress.grade = request.body.logExpress.grade;
                logExpress.from = request.body.logExpress.from;
                logExpress.students = request.body.logExpress.students;
                console.log(request.body.logExpress.students);
                logExpress.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({logExpress: logExpress});
                    }
                });
            }
        })
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        models.logExpresses.findByIdAndRemove(request.params.logExpress_id,
            function (error, deleted) {
                if (!error) {
                    response.json({logExpress: deleted});
                }
            }
        );
    });

module.exports = router;
