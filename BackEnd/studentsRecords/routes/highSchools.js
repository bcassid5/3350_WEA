var express = require('express');
var router = express.Router();
var models = require('../models/studentsRecordsDB');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var highSchool = new models.HighSchools(request.body.highschool);
        console.log(request.body.highschool);
        highSchool.save(function (error) {
            if (error) response.send(error);
            response.json({highschool: highSchool});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        console.log("0");
        var Student = request.query;
        if (!Student) {
            console.log("1");
            models.HighSchools.find(function (error, highSchools) {
                if (error) response.send(error);
                response.json({highSchool: highSchools});
            });   
        } else {
            models.HighSchools.find({"student": Student.student}, function (error, students) {
                if (error) response.send(error);
                response.json({highSchool: students});
            });
        }
    });
router.route('/:highSchool_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        models.HighSchools.findById(request.params.highSchool_id, function (error, highSchool) {
            if (error) response.send(error);
            response.json({highSchool: highSchool});
        })
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        models.HighSchools.findById(request.params.highSchool_id, function (error, highSchool) {
            if (error) {
                response.send({error: error});
            }
            else {
                highSchool.type = request.body.highSchool.type;

                highSchool.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({highSchool: highSchool});
                    }
                });
            }
        })
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        models.HighSchools.findByIdAndRemove(request.params.highSchool_id,
            function (error, deleted) {
                if (!error) {
                    response.json({highSchool: deleted});
                }
            }
        );
    });
module.exports=router;