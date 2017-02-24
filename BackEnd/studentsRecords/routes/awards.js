var express = require('express');
var router = express.Router();
var models = require('../models/studentsRecordsDB');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        

        var award = new models.Awards(request.body.award);
        
        award.save(function (error) {
            if (error) response.send(error);
            response.json({award: award});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var Student = request.query;
        if (!Student) {
            
            models.Awards.find(function (error, awards) {
                if (error) response.send(error);
                response.json({award: awards});
            });
        } else {
            
            models.Awards.find({"student": Student.student}, function (error, award) {
                if (error) response.send(error);
                response.json({award: award});
            });
        }
    });

router.route('/:award_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        models.Awards.findById(request.params.award_id, function (error, award) {
            if (error) response.send(error);
            response.json({award: award});
        })
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        models.Awards.findById(request.params.award_id, function (error, award) {
            if (error) {
                response.send({error: error});
            }
            else {
                award.note = request.body.award.note;
                
                award.student = request.body.award.student;
                
                award.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({award: award});
                    }
                });
            }
        })
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        models.Awards.findByIdAndRemove(request.params.award_id,
            function (error, deleted) {
                if (!error) {
                    response.json({award: deleted});
                }
            }
        );
    });

module.exports = router;
