var express = require('express');
var router = express.Router();
var models = require('../models/programMark');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();
var mongoose = require("mongoose");

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        

        var grade = new models.Grades(request.body.grade);
        
        grade.save(function (error) {
            if (error) response.send(error);
            response.json({grade: grade});
        });
    })
.get(parseUrlencoded, parseJSON, function (request, response) {
        var Student = request.query;
        console.log('studen: '+ Student.student + " - " + Student.term);
        if (!Student.schoolterm && !Student.term) {
            
            models.Grades.find(function (error, grades) {
                if (error) response.send(error);
                response.json({grade: grades});
            });
        }
        else if (Student.schoolterm)
        {
            models.TermCodes.find({"name": Student.schoolterm}, function(error, terms){
                var termArray = [];
                for(let i =0; i<terms.length;i++)
                {
                    termArray.push(new mongoose.Types.ObjectId(terms[i].id));
                }
                models.Grades.find({"term":{
                        $in: termArray
                    }
                }, function (error2, grades){
                    
                    if (error) response.send(error2);
                    
                    
                    response.json({grade: grades});
                    
                });
                
            });
        } 
        else {
            
            models.Grades.find({"term": Student.term}, function (error, grade) {
                
                if (error) response.send(error);
                response.json({grade: grade});
            });
        }
});

router.route('/:grade_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        models.Grades.findById(request.params.grade_id, function (error, grade) {
            if (error) response.send(error);
            response.json({grade: grade});
        })
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        models.Grades.findById(request.params.grade_id, function (error, grade) {
            if (error) {
                response.send({error: error});
            }
            else {
                grade.mark = request.body.grade.mark;
                grade.note = request.body.grade.note;
                
                
                grade.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({grade: grade});
                    }
                });
            }
        })
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        models.Grades.findByIdAndRemove(request.params.grade_id,
            function (error, deleted) {
                if (!error) {
                    response.json({grade: deleted});
                }
            }
        );
    });

module.exports = router;
