var express = require('express');
var router = express.Router();
var models = require('../models/studentsRecordsDB');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var advStanding = new models.AdvancedStandings(request.body.advStanding);
        advStanding.save(function (error) {
            if (error) response.send(error);
            response.json({advStanding: advStanding});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var Student = request.query.filter;
        if (!Student) {
            console.log("5");
            models.AdvancedStandings.find(function (error, advancedStandings) {
                if (error) response.send(error);
                response.json({advStanding: advancedStandings});
            });
        } else {
            models.AdvancedStandings.find({"student": Student.student}, function (error, students) {
                if (error) response.send(error);
                response.json({advStanding: students});
            });
        }
    });

router.route('/:advStanding_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        models.AdvancedStandings.findById(request.params.advStanding_id, function (error, advStanding) {
            if (error) response.send(error);
            response.json({advStanding: advStanding});
        })
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        models.AdvancedStandings.findById(request.params.advStanding_id, function (error, advStanding) {
            if (error) {
                response.send({error: error});
            }
            else {
                advStanding.course = request.body.advStanding.course;
                advStanding.description = request.body.advStanding.description;
                advStanding.unit = request.body.advStanding.unit;
                advStanding.grade = request.body.advStanding.grade;
                advStanding.from = request.body.advStanding.from;
                advStanding.students = request.body.advStanding.students;

                advStanding.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({advStanding: advStanding});
                    }
                });
            }
        })
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        models.AdvancedStandings.findByIdAndRemove(request.params.advStanding_id,
            function (error, deleted) {
                if (!error) {
                    response.json({advStanding: deleted});
                }
            }
        );
    });

module.exports = router;
