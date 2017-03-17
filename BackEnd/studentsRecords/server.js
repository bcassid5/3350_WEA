
var express = require('express');
var mongoose = require('mongoose');
var logger = require('./logger');
var app = express();
var xlsx = require("node-xlsx").default;
var mongoXlsx = require("mongo-xlsx");
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var students = require('./routes/students');
var residencies = require('./routes/residencies');
var genders= require('./routes/genders');
var advStandings = require('./routes/advStandings');
var highSchoolSubjects = require('./routes/highSchoolSubjects');
var highSchools = require('./routes/highSchools');
var highSchoolGrades = require('./routes/highSchoolGrades');
var highSchoolCourses = require('./routes/highSchoolCourses');
var awards = require('./routes/awards');
var courseCodes = require('./routes/courseCodes');
var planCodes = require('./routes/planCodes');
var termCodes = require('./routes/termCodes');
var grades = require('./routes/grades');
var programRecords = require('./routes/programRecords');
var schoolTerms = require('./routes/schoolTerms');
var users = require('./routes/users');
var passwords = require('./routes/passwords');
var roleCodes = require('./routes/roleCodes');
var userRoles = require('./routes/usersRoles');
var rolePermissions = require('./routes/rolePermissions');
var logins = require('./routes/logins');
var roots = require('./routes/roots');
var programs = require('./routes/programs');
var faculties = require('./routes/faculties');
var departments = require('./routes/departments');
var progAdmins = require('./routes/progAdmins');
var assessmentCodes = require('./routes/assessmentCodes');
var adjudications = require('./routes/adjudications');
var logExpresses = require('./routes/logExpress');
var rules = require('./routes/rules')


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
app.use('/awards', awards);
app.use('/courseCodes',courseCodes);
app.use('/planCodes',planCodes);
app.use('/termCodes',termCodes);
app.use('/grades',grades);
app.use('/programRecords', programRecords);
app.use('/schoolTerms', schoolTerms );
app.use('/programs', programs);
app.use('/faculties', faculties);
app.use('/departments', departments);
app.use('/progAdmins', progAdmins);
app.use('/roots', roots);
app.use('/users', users);
app.use('/passwords', passwords);
app.use('/roleCodes', roleCodes);
app.use('/userRoles', userRoles);
app.use('/rolePermissions', rolePermissions);
app.use('/logins', logins);
app.use('/assessmentCodes', assessmentCodes);
app.use('/rules', rules);
app.use('/logExpresses', logExpresses);
app.use('/adjudications', adjudications);

app.post('/upload', function(request, response){
    //console.log('entering upload route');
    //var name = request.body.upload.name;
    // create an incoming form object
  var form = new formidable.IncomingForm();
  var fileNameSave = null;
  var collTitle = '';
  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;
  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/uploads');
  
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
    
    fileNameSave = file.name;
    
    for(var i=0; i<fileNameSave.length;i++){
        if(fileNameSave[i] == '.'){
            break;
        } else {
            collTitle += fileNameSave[i];
        }
    }
  });
  
  form.on('error', function(err) {
    
    console.log('An error has occured: \n' + err);
  });
  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    
    
    
    var model = null;
    var xlsx  = './uploads/'+fileNameSave;
 
    mongoXlsx.xlsx2MongoData(xlsx, model, function(err, data) {
        console.log(data);
        
        var db = mongoose.connection;

        db.collection(collTitle).insert(data, function(err, records) {
            if (err) throw err;
        });
        
    });
    response.end('Successfully uploaded file: '+fileNameSave);
  });
  form.parse(request);
});

/*
app.post('/upload', function(request, response){
    console.log("hi");
    var name = request.body.upload.name;
    console.log(name);
    var json = request.body.upload.jsonTxt;
    json2 = json["MOCK_DATA (1)"];
    if(json2 == null){
        json = json["MOCK_DATA (1)"];
    }
    else{
        json = json2;
    }
    console.log(json);
    var MongoClient = require('mongodb').MongoClient;
    var assert = require('assert');
    var ObjectId = require('mongodb').ObjectID;
    var url = 'mongodb://localhost/studentsRecords'

    var insertDocument = function(db, callback) {
       db.collection(name).insert(json, function(err, result) {
        assert.equal(err, null);
        console.log("Inserted a document into the " + name + " collection.");
        callback();
      });
    };

    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      insertDocument(db, function() {
          db.close();
      });
    });
});*/

app.listen(3700, function () {
    console.log('Listening on port 3700');
});





