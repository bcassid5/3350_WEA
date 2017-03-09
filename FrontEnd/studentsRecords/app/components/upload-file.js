import Ember from 'ember';
/* global XLSX */ 

export default Ember.Component.extend({
    
    store: Ember.inject.service(),
    filename: null,
    success: false,
    genders: false,
    residencies: false,
    advStanding: false,
    tableHeader: [],
    tableData: null,
    isLoading: false,
    genderModel: null,
    resModel: null,

    actions: {

        fileImported: function(file) { 

            this.set('isLoading', true);
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
            //console.log(data[1][0]);
            
            
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
                            
                            var record = myStore.createRecord('student', {
                                number: data[i][0],
                                firstName: data[i][1],
                                lastName: data[i][2],
                                gender: gen,
                                DOB: data[i][4],
                                resInfo: res,
                                photo: setGen,
                                regComments: null,
                                BOA: null,
                                admissAvg: null,
                                admissComments: null,
                            });
                            //console.log(record.get('type'));
                            record.save();    
                        }
                        
                    });
                });
                }               
        },

        done: function () {
            this.set('isLoading', false);
        },

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
        },
    }
});
