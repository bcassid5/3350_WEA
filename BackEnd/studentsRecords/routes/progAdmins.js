var express = require('express');
var router = express.Router();
var models = require('../models/studentsRecordsDB');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        

        var progAdmin = new models.ProgramAdministrations(request.body.progAdmin);
        
        progAdmin.save(function (error) {
            if (error) response.send(error);
            response.json({progAdmin: progAdmin});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var Student = request.query;
        
        if (!Student) {
            
            models.ProgramAdministrations.find(function (error, programAdministrations) {
                if (error) response.send(error);
                response.json({progAdmin: programAdministrations});
            });
        } else {
            
            models.ProgramAdministrations.find({"students": Student.student}, function (error, students) {
                if (error) response.send(error);
                response.json({progAdmin: students});
            });
        }
    });

router.route('/:progAdmins_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        models.ProgAdmins.findById(request.params.progAdmin_id, function (error, progAdmin) {
            if (error) response.send(error);
            response.json({progAdmin: progAdmin});
        })
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        models.ProgramAdministrations.findById(request.params.progAdmin_id, function (error, progAdmin) {
            if (error) {
                response.send({error: error});
            }
            else {
                progAdmin.code = request.body.progAdmin.code;
                progAdmin.name = request.body.progAdmin.name;
                progAdmin.faculty = request.body.progAdmin.faculty;
                progAdmin.adjudication = request.body.progAdmin.adjudication;
              //  console.log(request.body.progAdmin.students);
                progAdmin.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({progAdmin: progAdmin});
                    }
                });
            }
        })
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        models.ProgramAdministrations.findByIdAndRemove(request.params.progAdmin_id,
            function (error, deleted) {
                if (!error) {
                    response.json({progAdmin: deleted});
                }
            }
        );
    });

module.exports = router;
