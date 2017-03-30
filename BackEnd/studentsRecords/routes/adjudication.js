var express = require('express');
var router = express.Router();
var models = require('../models/studentsRecordsDB');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        

        var adjudication = new models.Adjudications(request.body.adjudication);
        
        adjudication.save(function (error) {
            if (error) response.send(error);
            response.json({adjudication: adjudication});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var Student = request.query;
        
        if (!Student) {
            
            models.Adjudications.find(function (error, adjudications) {
                if (error) response.send(error);
                response.json({adjudication: adjudications});
            });
        } else {
            
            models.Adjudications.find({"students": Student.student}, function (error, students) {
                if (error) response.send(error);
                response.json({adjudication: students});
            });
        }
    });

router.route('/:adjudications_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        models.Adjudications.findById(request.params.adjudication_id, function (error, adjudication) {
            if (error) response.send(error);
            response.json({adjudication: adjudication});
        })
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        models.Adjudications.findById(request.params.adjudication_id, function (error, adjudication) {
            if (error) {
                response.send({error: error});
            }
            else {
                adjudication.date = request.body.adjudication.date;
                adjudication.termAVG = request.body.adjudication.termAVG;
                adjudication.termUnitPassed = request.body.adjudication.termUnitPassed;
                adjudication.termUnitTotal = request.body.adjudication.termUnitTotal;
                adjudication.note = request.body.adjudication.note;
                adjudication.assessmentCode = request.body.adjudication.assessmentCode;
                adjudication.student = request.body.adjudication.student;
               // console.log(request.body.adjudication.students);
                adjudication.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({adjudication: adjudication});
                    }
                });
            }
        })
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        models.Adjudications.findByIdAndRemove(request.params.adjudications_id,
            function (error, deleted) {
                if (!error) {
                    response.json({adjudication: deleted});
                }
            }
        );
    });

module.exports = router;
