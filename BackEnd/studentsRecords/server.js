
var express = require('express');
var logger = require('./logger');
var app = express();

var students = require('./routes/students');
var residencies = require('./routes/residencies');
var genders= require('./routes/genders');
var advStandings = require('./routes/advStandings');
var highSchoolSubjects = require('./routes/highSchoolSubjects');
var highSchools = require('./routes/highSchools');
var highSchoolGrades = require('./routes/highSchoolGrades');
var highSchoolCourses = require('./routes/highSchoolCourses');


app.use(function (request, response, next) {
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.header('Access-Control-Allow-Methods', 'POST, PATCH, GET, PUT, DELETE, OPTIONS');
    next();
});
app.use(logger);
//app.use(express.static('public'));

app.use('/students', students);
app.use('/residencies', residencies);
app.use('/genders', genders);
app.use('/advStandings', advStandings);
app.use('/highSchools', highSchools);
app.use('/highSchoolSubjects', highSchoolSubjects);
app.use('/highSchoolGrades', highSchoolGrades);
app.use('/highSchoolCourses', highSchoolCourses);



app.listen(3700, function () {
    console.log('Listening on port 3700');
});
