var express = require('express');
var router = express.Router();
var models = require('../models/studentsRecordsDB');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        

        var assessmentCode = new models.AssessmentCodes(request.body.assessmentCode);
        
        assessmentCode.save(function (error) {
            if (error) response.send(error);
            response.json({assessmentCode: assessmentCode});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var Student = request.query;
        
        if (!Student) {
            
            models.AssessmentCodes.find(function (error, assessmentCodes) {
                if (error) response.send(error);
                response.json({assessmentCode: assessmentCodes});
            });
        } else {
            
            models.AssessmentCodes.find({"students": Student.student}, function (error, students) {
                if (error) response.send(error);
                response.json({assessmentCode: students});
            });
        }
    });

router.route('/:assessmentCodes_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        models.AssessmentCodes.findById(request.params.assessmentCode_id, function (error, assessmentCode) {
            if (error) response.send(error);
            response.json({assessmentCode: assessmentCode});
        })
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        models.AssessmentCodes.findById(request.params.assessmentCode_id, function (error, assessmentCode) {
            if (error) {
                response.send({error: error});
            }
            else {
                assessmentCode.code = request.body.assessmentCode.code;
                assessmentCode.description = request.body.assessmentCode.description;
                assessmentCode.adjudication = request.body.assessmentCode.adjudication;
                assessmentCode.rule = request.body.rule;
             //   console.log(request.body.assessmentCode.students);
                assessmentCode.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({assessmentCode: assessmentCode});
                    }
                });
            }
        })
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        models.AssessmentCodes.findByIdAndRemove(request.params.assessmentCode_id,
            function (error, deleted) {
                if (!error) {
                    response.json({assessmentCode: deleted});
                }
            }
        );
    });

module.exports = router;
