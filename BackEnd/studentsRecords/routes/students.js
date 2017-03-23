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
        var student = new models2.Students(request.body.student);
        student.save(function (error) {
            if (error) response.send(error);
            response.json({student: student});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var l = parseInt(request.query.limit) ;
        var o = parseInt(request.query.offset);
        var Student = request.query.student;
        var Department = request.query.department;
        var Program = request.query.program;
        if (!Student && !Department && !Program) {
            //models2.Students.find(function (error, students) {
            //    if (error) response.send(error);
            //    response.json({student: students});
            //});
            models2.Students.paginate({}, { offset: o, limit: l },
                function (error, students) {
                    if (error) response.send(error);
                    response.json({student: students.docs});
                });
        }
        else if(Department)
        {
            console.log('department');
            models.Programs.find({"department": Department}, function (error, programs) {
                console.log("program !!!!!!!!Length" + programs.length);
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
                    console.log('student program length: '+studentPrograms.length) 
                    for(let j =0; j<studentPrograms.length; j++)
                    {
                        termArray.push(studentPrograms[j].semester)
                        console.log(studentPrograms[j].semester)
                    }
                    models.TermCodes.find({"_id": { $in: termArray}}, function (error3, studentTerms){
                        console.log("student terms:" + studentTerms.length);
                        var studentArray =[];
                        for (let k =0;k<studentTerms.length;k++)
                        {
                            studentArray.push(studentTerms[k].student)
                        }
                        models2.Students.find({"_id": { $in: studentArray}}, function (error4, students){
                            console.log("students:" + students[0].name);
                            
                            response.json({student: students});
                        });
                        
                    });
                    
                    
                });
                //response.json({program: program});
            });
        } 
        else if(Program)
        {
            models.ProgramRecords.find({"name": Program}, function(error, programs){
                var termArray = [];
                for (let i =0; i<programs.length;i++)
                {
                    termArray.push(programs[i].semester);
                }
                    models.TermCodes.find({"_id": { $in: termArray}}, function (error3, studentTerms){
                        
                        var studentArray =[];
                        for (let k =0;k<studentTerms.length;k++)
                        {
                            studentArray.push(studentTerms[k].student)
                        }
                        models2.Students.find({"_id": { $in: studentArray}}, function (error4, students){
                            
                            
                            response.json({student: students});
                        });
                        
                    });
                
            });
        }
        else {
            //        if (Student == "residency")
            models2.Students.find({"residency": request.query.residency}, function (error, students) {
                if (error) response.send(error);
                response.json({student: students});
            });
        }
    });

router.route('/:student_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        models2.Students.findById(request.params.student_id, function (error, student) {
            if (error) {
                response.send({error: error});
            }
            else {
                response.json({student: student});
            }
        });
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        models2.Students.findById(request.params.student_id, function (error, student) {
            if (error) {
                response.send({error: error});
            }
            else {
                student.number = request.body.student.number;
                student.firstName = request.body.student.firstName;
                student.lastName = request.body.student.lastName;
                student.gender = request.body.student.gender;
                student.DOB = request.body.student.DOB;
                student.photo = request.body.student.photo;
                student.resInfo = request.body.student.resInfo;
                student.regComments = request.body.student.regComments;
                student.BOA = request.body.student.BOA;
                student.admissAvg = request.body.student.admissAvg;
                student.admissComments = request.body.student.admissComments;
                student.advStanding= request.body.student.advStanding;
                //student.adjudication=request.body.student.adjudication;
                console.log(request.body.student);
                console.log(request.body.student.advStanding);

                student.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({student: student});
                    }
                });
            }
        });
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        models2.Students.findByIdAndRemove(request.params.student_id,
            function (error, deleted) {
                if (!error) {
                    response.json({student: deleted});
                }
            }
        );
    });

module.exports = router;
