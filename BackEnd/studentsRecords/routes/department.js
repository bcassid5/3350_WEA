var express = require('express');
var router = express.Router();
var models = require('../models/studentsRecordsDB');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        

        var department = new models.departments(request.body.department);
        
        department.save(function (error) {
            if (error) response.send(error);
            response.json({department: department});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var Student = request.query;
        
        if (!Student) {
            
            models.departments.find(function (error, departments) {
                if (error) response.send(error);
                response.json({department: departments});
            });
        } else {
            
            models.departments.find({"students": Student.student}, function (error, students) {
                if (error) response.send(error);
                response.json({department: students});
            });
        }
    });

router.route('/:departments_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        models.departments.findById(request.params.department_id, function (error, department) {
            if (error) response.send(error);
            response.json({department: department});
        })
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        models.departments.findById(request.params.department_id, function (error, department) {
            if (error) {
                response.send({error: error});
            }
            else {
                department.name = request.body.department.name;
                department.progAdmin = request.body.department.progAdmin;
                department.faculty = request.body.department.faculty;
                //console.log(request.body.department.students);
                department.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({department: department});
                    }
                });
            }
        })
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        models.departments.findByIdAndRemove(request.params.department_id,
            function (error, deleted) {
                if (!error) {
                    response.json({department: deleted});
                }
            }
        );
    });

module.exports = router;
