var express = require('express');
var router = express.Router();
var models = require('../models/programMark');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        

        var schoolTerm = new models.SchoolTerms(request.body.schoolTerm);
        
        schoolTerm.save(function (error) {
            if (error) response.send(error);
            response.json({schoolTerm: schoolTerm});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var Student = request.query;
        
        if (!Student) {
            
            models.SchoolTerms.find(function (error, schoolTerms) {
                if (error) response.send(error);
                response.json({schoolTerm: schoolTerms});
            });
        } else {
            
            models.SchoolTerms.find({"student": Student.student}, function (error, schoolTerm) {
                if (error) response.send(error);
                response.json({schoolTerm: schoolTerm});
            });
        }
    });

router.route('/:schoolTerm_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        models.SchoolTerms.findById(request.params.schoolTerm_id, function (error, schoolTerm) {
            if (error) response.send(error);
            response.json({schoolTerm: schoolTerm});
        })
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        models.SchoolTerms.findById(request.params.schoolTerm_id, function (error, schoolTerm) {
            if (error) {
                response.send({error: error});
            }
            else {
                
                schoolTerm.name = request.body.schoolTerm.name;
                
                schoolTerm.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({schoolTerm: schoolTerm});
                    }
                });
            }
        })
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        models.SchoolTerms.findByIdAndRemove(request.params.schoolTerm_id,
            function (error, deleted) {
                if (!error) {
                    response.json({schoolTerm: deleted});
                }
            }
        );
    });

module.exports = router;