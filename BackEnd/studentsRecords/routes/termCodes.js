var express = require('express');
var router = express.Router();
var models = require('../models/programMark');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        

        var termCode = new models.TermCodes(request.body.termCode);
        
        termCode.save(function (error) {
            if (error) response.send(error);
            response.json({termCode: termCode});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var Student = request.query;
        if (!Student.student) {
            console.log("ugh");
            models.TermCodes.find(function (error, termCodes) {
                if (error) response.send(error);
                response.json({termCode: termCodes});
            });
        } else {
            console.log("why!?");
            models.TermCodes.find({"student": Student.student}, function (error, termCode) {
                
                if (error) response.send(error);
                response.json({termCode: termCode});
            });
        }
    });

router.route('/:termCode_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        models.TermCodes.findById(request.params.termCode_id, function (error, termCode) {
            if (error) response.send(error);
            response.json({termCode: termCode});
        })
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        models.TermCodes.findById(request.params.termCode_id, function (error, termCode) {
            if (error) {
                response.send({error: error});
            }
            else {
                
                termCode.name = request.body.termCode.name;
                termCode.program = request.body.termCode.program;
                termCode.student=request.body.termCode.student;
                termCode.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({termCode: termCode});
                    }
                });
            }
        })
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        models.TermCodes.findByIdAndRemove(request.params.termCode_id,
            function (error, deleted) {
                if (!error) {
                    response.json({termCode: deleted});
                }
            }
        );
    });

module.exports = router;
