import Ember from 'ember';

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
    
    didRender() {
        Ember.$('.menu .item').tab();
    },

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
                for (var i=1; i<286; i++){
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
            } else if (file.name == "UndergraduateRecordPlans.xlsx"){
                var plans = [];
                var add = true;
                var self = this;
                for(var i=1; i<data.length; i++){
                    if (data[i][2]==null){
                        //skip
                    } else {
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
            } else if (file.name == "averages.xlsx"){
                var self = this;
                var _break = true;
                var saveNum;
                var save = true;
                this.get('store').query('student', {limit: 1000000, offset: 0}).then(function (student) {
                    var input = "";
                    var ch = 0;
                    for(var i=1; i<102;i++){
                        for(var j=0; j<student.content.length; j++){
                            if (data[i][0] == student.content[j]._data.number){
                                var updatedStudent = self.get('store').peekRecord('student', student.content[j].id);
                                updatedStudent.set('admissAvg', data[i][1]);
                                updatedStudent.save();
                                console.log(updatedStudent);
                            }
                        }
                        /*if (save){
                            saveNum = data[i][0];
                        }

                        ch = i+1;
                        console.log(data[ch][0]);
                        console.log(data[ch][1]);
                        if (data[ch][0] == ""){
                            input += data[i][1];
                            console.log(saveNum);
                            console.log("END");
                            for(var j=0; j<student.content.length; j++){
                                if (saveNum == student.content[j]._data.number){
                                    var updatedStudent = self.get('store').peekRecord('student', student.content[j].id);
                                    updatedStudent.set('regComments', input);
                                    updatedStudent.save();
                                    console.log(updatedStudent);
                                }
                            }
                            input = "";
                            save = true;
                        } else {
                            input += data[i][1];
                            //console.log(input);
                            //console.log(saveNum);
                            //console.log("LOOP");
                            save = false;
                        }*/
                    }    
                });
            } else if (file.name == "AdmissionComments.xlsx"){
                var self = this;
                var _break = true;
                var saveNum;
                var save = true;
                this.get('store').query('student', {limit: 1000000, offset: 0}).then(function (student) {
                    var input = "";
                    var ch = 0;
                    for(var i=1; i<117;i++){
                        if (save){
                            saveNum = data[i][0];
                        }         

                        if(data[i][1] == "NONE FOUND"){
                            for(var j=0; j<student.content.length; j++){
                                if (data[i][0] == student.content[j]._data.number){
                                    var updatedStudent = self.get('store').peekRecord('student', student.content[j].id);
                                    updatedStudent.set('admissComments', "NONE FOUND");
                                    updatedStudent.save();
                                }
                            }
                        } else {
                            ch = i+1;
                            
                            if (data[ch][1] == "NONE FOUND"){
                                input += data[i][1];
                                console.log(input);
                                console.log("END");
                                for(var j=0; j<student.content.length; j++){
                                    if (saveNum == student.content[j]._data.number){
                                        var updatedStudent = self.get('store').peekRecord('student', student.content[j].id);
                                        updatedStudent.set('admissComments', input);
                                        updatedStudent.save();
                                        console.log(updatedStudent);
                                    }
                                }
                                input = "";
                                save = true;
                            } else {
                                input += data[i][1];
                                console.log(input);
                                console.log(saveNum);
                                console.log("LOOP");
                                save = false;
                            }
                            
                        }
                    }    
                });
                
            } else if (file.name == "Faculties.xlsx"){
                var record = this.get('store').createRecord('faculty', {
                    name: data[1][0],
                    department: [],
                });
                record.save();
            } else if (file.name == "Departments.xlsx"){
                var self = this;
                this.get('store').findAll('faculty').then(function (faculty) {
                    var fac = self.get('store').peekRecord('faculty', faculty.content[0].id);
                    for (var i=1; i<5; i++){
                        var record = self.get('store').createRecord('department', {
                            name: data[i][0],
                            faculty: fac,
                            progAdmin: []
                        });
                        record.save();
                    }
                });
                
            } else if (file.name == "BasisOfAdmission.xlsx"){
                var self = this;
                var _break = true;
                var saveNum;
                var save = true;
                this.get('store').query('student', {limit: 1000000, offset: 0}).then(function (student) {
                    var input = "";
                    var ch = 0;
                    for(var i=1; i<107;i++){
                        if (save){
                            saveNum = data[i][0];
                        }         

                        if(data[i][1] == "NONE FOUND"){
                            for(var j=0; j<student.content.length; j++){
                                if (data[i][0] == student.content[j]._data.number){
                                    var updatedStudent = self.get('store').peekRecord('student', student.content[j].id);
                                    updatedStudent.set('BOA', "NONE FOUND");
                                    updatedStudent.save();
                                }
                            }
                        } else {
                            ch = i+1;
                            console.log(data[ch][0]);
                            if (data[ch][0] != null){
                                input += data[i][1];
                                //console.log(input);
                                //console.log("END");
                                for(var j=0; j<student.content.length; j++){
                                    if (saveNum == student.content[j]._data.number){
                                        var updatedStudent = self.get('store').peekRecord('student', student.content[j].id);
                                        updatedStudent.set('BOA', input);
                                        updatedStudent.save();
                                        console.log(updatedStudent);
                                    }
                                }
                                input = "";
                                save = true;
                            } else {
                                input += data[i][1];
                                //console.log(input);
                                //console.log(saveNum);
                                //console.log("LOOP");
                                save = false;
                            }
                            
                        }
                    }    
                });
            } else if (file.name == "RegistrationComments.xlsx"){
                var self = this;
                var _break = true;
                var saveNum;
                var save = true;
                this.get('store').query('student', {limit: 1000000, offset: 0}).then(function (student) {
                    var input = "";
                    var ch = 0;
                    for(var i=1; i<107;i++){
                        if (save){
                            saveNum = data[i][0];
                        }         

                        if(data[i][1] == "NONE FOUND"){
                            for(var j=0; j<student.content.length; j++){
                                if (data[i][0] == student.content[j]._data.number){
                                    var updatedStudent = self.get('store').peekRecord('student', student.content[j].id);
                                    updatedStudent.set('regComments', "NONE FOUND");
                                    updatedStudent.save();
                                }
                            }
                        } else {
                            ch = i+1;
                            console.log(data[ch][0]);
                            if (data[ch][0] != null){
                                input += data[i][1];
                                for(var j=0; j<student.content.length; j++){
                                    if (saveNum == student.content[j]._data.number){
                                        var updatedStudent = self.get('store').peekRecord('student', student.content[j].id);
                                        updatedStudent.set('regComments', input);
                                        updatedStudent.save();
                                        console.log(updatedStudent);
                                    }
                                }
                                input = "";
                                save = true;
                            } else {
                                input += data[i][1];
                                save = false;
                            }
                            
                        }
                    }    
                });
            } else if (file.name == "scholarshipsAndAwards.xlsx"){
                var self = this;
                var myStore = this.get('store');
                var _break = true;
                var end = false;

                this.get('store').query('student', {limit: 1000000, offset: 0}).then(function (student) {
                    self.set('studentsModel', student);
                    //console.log(student);

                    for (var i=0;i<108;i++){
                        if (data[i][1] == "NONE FOUND"){
                            //console.log("NF");
                        } else if (data[i][0] == ""){
                            console.log("empty");
                        } else {
                            for(var j=0; j<student.content.length; j++){
                                if (student.content[j]._data.number == data[i][0]){
                                    var ch = i;
                                    do {
                                        ch++; 
                                        console.log(ch);
                                        console.log(data[ch][1]);
                                        if (data[ch][1]=="NONE FOUND"){
                                            _break = false;
                                        } else if (data[ch][0]!=null){
                                            _break = false;
                                        } else if (data[ch][1]==null){
                                            _break = false;
                                            end = true;
                                        }
                                        
                                        var im = self.get('store').peekRecord('student', student.content[j].id);
                                        console.log(im);
                                        var record = myStore.createRecord('award', {
                                            note: data[i][1],
                                            student: im,
                                        });
                                        
                                        record.save()

                                    } while (_break);
                                    _break = true;
                                    if (end){
                                        break;
                                    }
                                }                                
                            }
                        }
                    }
                });
            } else if (file.name == "ProgramAdministrations.xlsx"){
                
                var self = this;
                var thisDept;

                self.get('store').findAll('department').then(function(dept){
                    for (var i=1; i<10; i++){
                        for(var j=0; j<4; j++){
                            
                            if (data[i][2]==dept.content[j]._data.name){
                                thisDept = self.get('store').peekRecord('department', dept.content[j].id);
                            }
                        }
                        var record = self.get('store').createRecord('progAdmin', {
                            name: data[i][0],
                            position: data[i][1],
                            department: thisDept
                        });
                        record.save();
                    }
                });    
            } else if (file.name == "AssessmentCodes.xlsx"){

            } else if (file.name == "HighSchoolCourseInformation.xlsx"){
                var codes = [];
                var add = true;
                var self = this;
                for(var i=1; i<635; i++){
                    
                    if(data[i][4] == null){

                    } else {
                        for(var j=0; j<codes.length; j++){
                            if(data[i][4] == codes[j]){
                                add = false;
                            }
                        }
                        if(add){
                            codes.push(data[i][4]);
                            //console.log(data[i][4]);
                            var record = this.get('store').createRecord('highschool-subject', {
                                name: data[i][3],
                                description: data[i][4],    
                                course: []
                            });
                            record.save();

                        }
                        add = true;
                    }
                }
            } else if (file.name == "UndergraduateRecordAdjudications.xlsx"){
                
            } else if (file.name == "UndergraduateRecordCourses.xlsx"){
                
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
        updateOut: function () {
            
        },
        createPDF: function () {
            /*var doc = new jsPDF('p','pt','letter');          
        
            var table = document.createElement("table");

            var thead = document.createElement("thead");

            var row = document.createElement("tr");
            // To create a new column follow steps outlined in comments

            var header_name = document.createElement("th");
            var header_number = document.createElement("th");
            //var header_NAME=document.createElement("th");

            var text_name = document.createTextNode("Name"); // COLUMN NAME 
            var text_number = document.createTextNode("Student Number"); // COLUMN NAME
            //var text_COLUMNNAME = document.createTextNode("<NAME>")

            header_name.appendChild(text_name);
            header_number.appendChild(text_number);
            //header_NAME.appendChild(text_COLUMNNAME);

            row.appendChild(header_name);
            row.appendChild(header_number);
            //row.appendChild(header_NAME);
            thead.appendChild(row);

            table.appendChild(thead)
    
            var body=document.createElement("tbody");
            // To create a new row follow steps in commend

            var row1 = document.createElement("tr");
            //var row_i=document.createElement("tr");

            var data1_name = document.createElement("td");
            var data1_number = document.createElement("td");
            //var col1_cell=document.createElement("td");
            // var col2_cell=document.createElement("td")


            var text1_name = document.createTextNode("Ayman"); 
            var text1_number = document.createTextNode("250 786 608");
            //var col1_data=document.createElement("DATA");
            // repeat above step for col2_data

            data1_name.appendChild(text1_name);
            data1_number.appendChild(text1_number);
            //col1_cell.appendChild(col1_data);
            // repeat above step for col2_cell

            row1.appendChild(data1_name);
            row1.appendChild(data1_number);
            // row_i.appendChild(col1_cell)
            // repeat above step for col2_cell

            body.appendChild(row1)
            //body.appendChild(row_i);

            var margins = {
                top: 80,
                bottom: 60,
                left: 40,
                width: 522
            };

            doc.fromHTML(
                    div, // HTML string or DOM elem ref.
                    margins.left, // x coord
                    margins.top, {// y coord
                        'width': margins.width // max width of content on PDF
                    },
            function(dispose) {
                // dispose: object with X, Y of the last line add to the PDF 
                //          this allow the insertion of new lines after html
            }, margins);*/

            /*var columns = ["ID", "Name", "Country"];
            var rows = [
                [1, "Shaw", "Tanzania"],
                [2, "Nelson", "Kazakhstan"],
                [3, "Garcia", "Madagascar"],
            ];*/
            var doc = new jsPDF();
            
            this.get('store').query('student', {limit: 1000000, offset: 0}).then(function (student) {
                var columns = ["Student Number", "First Name", "Last Name"];
                var rows = [];

                //console.log(student);
                
                for (var i=0; i<student.content.length; i++){
                    rows.push([student.content[i]._data.number, student.content[i]._data.firstName, 
                    student.content[i]._data.lastName,]);
                }

                //console.log(rows);

                doc.autoTable(columns, rows);
                doc.output("dataurlnewwindow");
            });
            
            
            
        },
    }
});
