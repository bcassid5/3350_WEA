var express = require('express');
var router = express.Router();
var models = require('../models/programMark');
var models2 = require('../models/studentsRecordsDB');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        

        var program = new models.Programs(request.body.program);
        console.log(program);
        program.save(function (error) {
            if (error) response.send(error);
            response.json({program: program});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var Student = request.query;
        
        if (!Student.department) {
            console.log('no student');
            models.Programs.find(function (error, programs) {
                if (error) response.send(error);
                console.log(programs);
                response.json({program: programs});
            });
        } else {
            console.log('whyyy');
            models.Programs.find({"department": Student.department}, function (error, programs) {
                console.log(programs.length);
                if (error) response.send(error);
                var programArray = [];
                for(let i =0; i<programs.length;i++)
                {
                    programArray.push(new mongoose.Types.ObjectId(programs[i].id));
                }
                models.ProgramRecords.find({"name":{
                        $in: programArray
                    }
                }, function (error2, studentPrograms){
                    
                    if (error) response.send(error2);
                    
                        console.log('2');
                    response.json({program: programRecords});
                    
                });
                //response.json({program: program});
            });
        }
    });

router.route('/:program_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        models.Programs.findById(request.params.program_id, function (error, program) {
            if (error) response.send(error);
            response.json({program: program});
        })
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        models.Programs.findById(request.params.program_id, function (error, program) {
            if (error) {
                response.send({error: error});
            }
            else {
                program.name = request.body.program.name;
                
                program.availablePlans = request.body.program.availablePlans;
                
                program.department = request.body.program.department;
                console.log(program);
                program.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({program: program});
                    }
                });
            }
        })
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        models.Programs.findByIdAndRemove(request.params.program_id,
            function (error, deleted) {
                if (!error) {
                    response.json({program: deleted});
                }
            }
        );
    });

module.exports = router;
