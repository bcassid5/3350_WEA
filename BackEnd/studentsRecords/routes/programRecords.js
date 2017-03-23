var express = require('express');
var router = express.Router();
var models = require('../models/programMark');
var models2 = require('../models/studentsRecordsDB');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();
var mongoose = require('mongoose');

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        
        
        var programRecord = new models.ProgramRecords(request.body.programRecord);
        
        programRecord.save(function (error) {
            if (error) response.send(error);
            response.json({programRecord: programRecord});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var Student = request.query;
        console.log(Student.department);
        if (!Student) {
            console.log("!student");
            models.ProgramRecords.find(function (error, programRecords) {
                if (error) response.send(error);
                response.json({programRecord: programRecords});
            });
        }  else if(Student.department) 
        {
            console.log("student.department");
            models.Programs.find({"department": Student.department}, function (error, programs) {
                
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
                    var termArray = [];
                   
                    for(let j =0; j<studentPrograms.length; j++)
                    {
                        termArray.push(studentPrograms[j].semester);
                        
                    }
                    models.TermCodes.find({"_id": { $in: termArray}}, function (error3, studentTerms){
                        
                        var studentArray =[];
                        for (let k =0;k<studentTerms.length;k++)
                        {
                            studentArray.push(studentTerms[k].student);
                        }
                        models2.Students.find({"_id": { $in: studentArray}}, function (error4, students){
                            
                            
                            response.json({programRecord: studentPrograms});
                        });
                        
                    });
                    
                    
                });
                //response.json({program: program});
            });
        }
        else {
            
            models.ProgramRecords.find({"semester": Student.term}, function (error, programRecord) {
               
                if (error) response.send(error);
                response.json({programRecord: programRecord});
            });
            
        }
    });

router.route('/:programRecord_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        models.ProgramRecords.findById(request.params.programRecord_id, function (error, programRecord) {
            if (error) response.send(error);
            response.json({programRecord: programRecord});
        })
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        models.ProgramRecords.findById(request.params.programRecord_id, function (error, programRecord) {
            if (error) {
                response.send({error: error});
            }
            else {
                programRecord.name = request.body.programRecord.name;
                programRecord.level = request.body.programRecord.level;
                programRecord.load = request.body.programRecord.load;
                programRecord.status = request.body.programRecord.status;
                
                
                programRecord.plan = request.body.programRecord.plan;

                programRecord.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({programRecord: programRecord});
                    }
                });
            }
        })
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        models.ProgramRecords.findByIdAndRemove(request.params.programRecord_id,
            function (error, deleted) {
                if (!error) {
                    response.json({programRecord: deleted});
                }
            }
        );
    });

module.exports = router;
