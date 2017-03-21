var express = require('express');
var router = express.Router();
var models = require('../models/studentsRecordsDB');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        
        var logExpress = new models.LogicalExpressions(request.body.logExpress);
        console.log(logExpress);
        logExpress.save(function (error) {
            if (error) response.send(error);
            response.json({logExpress: logExpress});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var Student = request.query;
        
        if (!Student) {
            
            models.LogicalExpressions.find(function (error, logExpresses) {
                if (error) response.send(error);
                response.json({logExpress: logExpresses});
            });
        } else {
            
            models.LogicalExpressions.find({"students": Student.student}, function (error, students) {
                if (error) response.send(error);
                response.json({logExpress: students});
            });
        }
    });

router.route('/:logExpresses_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        models.LogicalExpressions.findById(request.params.logExpresses_id, function (error, logExpress) {
            if (error) response.send(error);
            response.json({logExpress: logExpress});
        })
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        models.LogicalExpressions.findById(request.params.logExpresses_id, function (error, logExpress) {
            if (error) {
                response.send({error: error});
            }
            else {
                logExpress.boolExpress = request.body.logExpress.boolExpress;
                logExpress.rule = request.body.logExpress.rule;
                logExpress.parameter=request.body.logExpress.paramter;
                logExpress.operator=request.body.logExpress.operator;
                logExpress.value=request.body.logExpress.value;
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
        models.LogicalExpressions.findByIdAndRemove(request.params.logExpresses_id,
            function (error, deleted) {
                if (!error) {
                    response.json({logExpress: deleted});
                }
            }
        );
    });

module.exports = router;
