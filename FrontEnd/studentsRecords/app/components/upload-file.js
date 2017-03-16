import Ember from 'ember';
/* global XLSX */ 

export default Ember.Component.extend({
    
    store: Ember.inject.service(),
    fileName: null,
    success: false,
    genders: false,
    residencies: false,
    advStanding: false,
    tableHeader: [],
    tableData: null,
    isLoading: false,
    showTable: false,
    genderModel: null,
    resModel: null,
    studentsModel: null,
    showTitle: "Show Data Table",
    

    actions: {

        fileImported: function(file) { 

            
            this.set('isLoading', true);
            this.set('fileName', file.name);
            //var workbook = XLSX
            var workbook = XLSX.read(file.data, {type: 'binary'});

            var row = 0;
            var col = null;
            var data = [];
            var header = [];
            var first_sheet_name = workbook.SheetNames[0];
            //console.log(file.name);

            /* Get worksheet */
            var worksheet = workbook.Sheets[first_sheet_name];
            var size = 0;
            for (var cellName in worksheet) {
                //all keys that do not begin with "!" correspond to cell addresses
                if (cellName[0] === '!') {
                    continue;
                }
            
                row = cellName.slice(1) - 1;
                col = cellName.charCodeAt(0) - 65;
                data[size++] = [];

                if (row === 0) {
                    header[col] = worksheet[cellName].v;
                } else {
                    
                    data[row][col] = worksheet[cellName].v;
                    
                }
            }
            this.set('tableHeader', header);
            this.set('tableData', data);
            //console.log(data);
            
            //console.log(data.length);
            
            
            if(file.name == "genders.xlsx"){
                for (var i=1; i<3; i++){
                    var record = this.get('store').createRecord('gender', {
                        type: data[i][0],
                        students: []
                    });
                    //console.log(record.get('type'));
                    record.save();
                }
            } else if (file.name == "residencies.xlsx"){
                for (var i=1; i<4; i++){
                    var record = this.get('store').createRecord('residency', {
                        name: data[i][0],
                        students: []
                    });
                    //console.log(record.get('type'));
                    record.save();
                }
            } else if (file.name == "students.xlsx"){
                
                var self = this;
                var myStore = this.get('store');

                this.get('store').findAll('gender').then(function (genders) {
                    self.set('genderModel', genders);
                    //console.log(genders);
                    self.get('store').findAll('residency').then(function (residencies) {
                        self.set('resModel', residencies);
                        //console.log(residencies);
                        //console.log(self.get('genderModel'));
                        //console.log(self.get('resModel'));
                        var setPhoto;
                        var setGen = self.get('genderModel');
                        var setRes = self.get('resModel');
                        var setGenID;
                        var setResID;

                        for (var i=1; i<101; i++){
                            //6 columns: studentNumber, firstName, lastName, gender, DOB, residency

                            for (var j=0; j<2; j++){
                                if (data[i][3] == setGen.content[j]._data.type){
                                    
                                    setGenID = setGen.content[j].id;
                                    //console.log(setGenID);
                                }    
                            }

                            for (var j=0; j<3; j++){
                                if (data[i][5] == setRes.content[j]._data.name){
                                    
                                    setResID = setRes.content[j].id;
                                    console.log(setResID);
                                }    
                            }

                            var res = self.get('store').peekRecord('residency', setResID);
                            var gen = self.get('store').peekRecord('gender', setGenID);
                            //console.log(res);
                            //console.log(gen);

                            if (data[i][3] == 'Male') {
                                setPhoto = "assets/studentsPhotos/male.png";
                            } else if (data[i][3] == 'Female') {
                                setPhoto = "assets/studentsPhotos/female.png";
                            } else {
                                setPhoto = "assets/studentsPhotos/other.png";
                            }
                            
                            var setDate = new Date(data[i][4]);

                            var record = myStore.createRecord('student', {
                                number: data[i][0],
                                firstName: data[i][1],
                                lastName: data[i][2],
                                gender: gen,
                                DOB: setDate,
                                resInfo: res,
                                photo: setPhoto,
                                regComments: null,
                                BOA: null,
                                admissAvg: null,
                                admissComments: null,
                            });
                            //console.log(record);
                            //console.log(record.get('type'));
                            record.save();    
                        }
                        
                    });
                });
            } else if (file.name == "AdvancedStanding.xlsx"){
                
                var self = this;
                var myStore = this.get('store');
                var addNumList = [];
                var addIDList = [];
                var _break = true;

                this.get('store').query('student', {limit: 1000000, offset: 0}).then(function (student) {
                    self.set('studentsModel', student);
                    //console.log(student);

                    for (var i=0;i<118;i++){
                        if (data[i][1] == "NONE FOUND"){
                            //console.log("NF");
                        } else if (data[i][0] == ""){
                            console.log("empty");
                        } else {
                            //console.log(studentList);
                            //console.log(student);
                            //console.log(student.content.length);
                            //console.log(student.content[0]._data.number);
                            for(var j=0; j<student.content.length; j++){
                                if (student.content[j]._data.number == data[i][0]){
                                    //console.log(student.content[j]._data.number);
                                    //addNumList.push(student.content[j]._data.number);
                                    //addIDList.push(student.content[j].id);
                                    //console.log(addNumList);
                                    //console.log(addIDList);
                                    var ch = i;
                                    //console.log(student.content[j]);
                                    do {
                                        ch++; 
                                        //console.log(data[i][0]);
                                        //console.log(ch);
                                        if (data[ch][1]=="NONE FOUND"){
                                            //console.log("next is NONE FOUND");
                                            _break = false;
                                            
                                        } else if (data[ch][0]!=null){
                                            //console.log("next is DIFFERENT STUDENT");
                                            _break = false;
                                            
                                        }
                                        //else continue
                                        //console.log("next is SAME STUDENT");

                                        var im = self.get('store').peekRecord('student', student.content[j].id);

                                        var record = myStore.createRecord('adv-standing', {
                                            course: data[i][1],
                                            description: data[i][2],
                                            unit: data[i][3],
                                            grade: data[i][4],
                                            from: data[i][5],
                                            students: im,
                                        });
                                        
                                        record.save()

                                    } while (_break);
                                    _break = true;
                                    
                                }                                
                            }
                        }
                    }
                });
            } else if (file.name == "termcodes.xlsx") {
                for (var i=1; i<data.length; i++){
                    var record = this.get('store').createRecord('schoolTerm', {
                        name: data[i][0],
                        terms: []
                    });
                    record.save();
                }
            } else if (file.name == "UndergraduateCourses.xlsx"){
                for (var i=1; i<data.length; i++){
                    var record = this.get('store').createRecord('courseCode', {
                        courseLetter: data[i][0],
                        courseNumber: data[i][1],
                        name: data[i][2],
                        unit: data[i][3],
                        marks: [],
                    });
                    record.save();
                }
            } else if (file.name == "HighSchools.xlsx"){
                //console.log(data[1][0]);
                for (var i=1; i<data.length; i++){
                    var record = this.get('store').createRecord('highSchool', {
                        name: data[i][0],
                        course: []
                    });
                    record.save();
                }
            } else if (file.name == "HighSchoolCourseInformation.xlsx"){
                
            } else if (file.name == "UndergraduateRecordPlans.xlsx"){
                var plans = [];
                var add = true;
                var self = this;
                for(var i=1; i<data.length; i++){
                    for(var j=0; j<plans.length; j++){
                        if(data[i][2] == plans[j]){
                            add = false;
                        }
                    }
                    if(add){
                        plans.push(data[i][2]);
                        var record = this.get('store').createRecord('planCode', {
                            name: data[i][2],
                            programRecords: []
                        });
                        record.save();
                    }
                    add = true;
                }
            }

        },

        done: function () {
            this.set('showTable', false);
            this.set('isLoading', false);
            this.set('showTitle', "Show Data Table");
        },
        show: function () {
            if (this.get('showTable')==true){
                this.set('showTable', false);
                this.set('showTitle', "Show Data Table");
            } else {
                this.set('showTable', true);
                this.set('showTitle', "Hide Data Table");
            }
            
        },
/*
        send2Back(file){
            //self.set('filename', file.files[0].name);
            var formData = new FormData();
            var self = this;            
            //console.log(file.files[0]);
            //console.log(file.files[0].name);
                
            formData.append('uploads[]', file.files[0], file.files[0].name);
            console.log(formData);

            $.ajax({
                url: 'http://localhost:3700/upload',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(data){
                    
                    self.set('filename', file.files[0].name);
                    self.set('success', true);
                    
                    console.log('upload successful!\n' + data);
                }
            });
        },*/
    }
});
