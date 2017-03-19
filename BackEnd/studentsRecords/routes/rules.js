var express = require('express');
var router = express.Router();
var models = require('../models/studentsRecordsDB');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        

        var rule = new models.Rules(request.body.rule);
        
        rule.save(function (error) {
            if (error) response.send(error);
            response.json({rule: rule});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var Student = request.query;
        
        if (!Student) {
            
            models.Rules.find(function (error, rules) {
                if (error) response.send(error);
                response.json({rule: rules});
            });
        } else {
            
            models.Rules.find({"students": Student.student}, function (error, students) {
                if (error) response.send(error);
                response.json({rule: students});
            });
        }
    });

router.route('/:rules_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        models.Rules.findById(request.params.rules_id, function (error, rule) {
            if (error) response.send(error);
            response.json({rule: rule});
        })
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        models.Rules.findById(request.params.rules_id, function (error, rule) {
            if (error) {
                response.send({error: error});
            }
            else {
                rule.description = request.body.rule.description;
                rule.logExpressions = request.body.rule.logExpressions;
                rule.assessmentCode = request.body.assessmentCode;
                rule.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({rule: rule});
                    }
                });
            }
        })
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        models.Rules.findByIdAndRemove(request.params.rules_id,
            function (error, deleted) {
                if (!error) {
                    response.json({rule: deleted});
                }
            }
        );
    });

module.exports = router;
