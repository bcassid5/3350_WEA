
var express = require('express');
var logger = require('./logger');
var app = express();
var xlsx = require("node-xlsx");
var students = require('./routes/students');
var residencies = require('./routes/residencies');
var genders= require('./routes/genders');
var advStandings = require('./routes/advStandings');



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



app.listen(3700, function () {
    console.log('Listening on port 3700');
});



app.post('/studentInputFile', function(request, response){
    console.log("hi");
    var name = request.body.studentInputFile.name;
    console.log(name);
    var json = request.body.studentInputFile.jsonTxt;
    json2 = json["MOCK_DATA (1)"];
    if(json2 == null){
        json = json["SAS Data"];
    }
    else{
        json = json2;
    }
    console.log(json);
    var MongoClient = require('mongodb').MongoClient;
    var assert = require('assert');
    var ObjectId = require('mongodb').ObjectID;
    var url = 'mongodb://localhost/studentsRecords';

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
});
