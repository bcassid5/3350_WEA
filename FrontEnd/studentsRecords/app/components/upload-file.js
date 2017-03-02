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
            console.log(file.name);

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
            console.log(data[1][0]);
            
            
            if(file.name == "genders.xlsx"){
                for (var i=1; i<3; i++){
                    var record = this.get('store').createRecord('gender', {
                        type: data[i][0],
                        students: []
                    });
                    console.log(record.get('type'));
                    record.save();
                }
            } else if (file.name == "residencies.xlsx"){
                for (var i=1; i<4; i++){
                    var record = this.get('store').createRecord('residency', {
                        name: data[i][0],
                        students: []
                    });
                    console.log(record.get('type'));
                    record.save();
                }
            } else if (file.name == "students.xlsx"){
                var setGen = null;
                var setDate = new Date(this.get('selectedDate'));
                var setRes = this.get('store').peekRecord('residency', this.get('res'));
                var gend = this.get('store').peekRecord('gender', this.get('gen'));


            }
            
            /*var self = this;
            var file = document.getElementById('file-field');
            var fileNameSave = file.files[0].name;
            var n = '';

            for(var i=0; i<fileNameSave.length;i++){
                if(fileNameSave[i] == '.'){
                    break;
                } else {
                    n += fileNameSave[i];
                }
            }
            //console.log(fileNameSave);
            //console.log(n);

            if(file.files.length >0)
            {   
                switch(file.files[0].name){
                    case 'students.xlsx':
                        if(self.get('genders')&&self.get('residencies')&&self.get('advStanding')){
                            self.send('send2Back', file);
                        } else {
                            alert('Error: Must upload dependent documents first!');
                        }
                        break;
                    default:
                        self.set(n, true);
                        self.send('send2Back', file);
                        break;
                }
                
            }
            
            
            
            /*
            //document.getElementById('file-field');
            console.log('pressed');
            
            var file = document.getElementById('file-field');
            var buffer;

            if(file.files.length) {
                var reader = new FileReader();

                reader.onload = function(e)
                {
                    var data = e.target.result;
                    var workbook = XLSX.read(data, {type: 'binary'});
                    //document.getElementById('outputDiv').innerHTML = e.target.result;
                    //console.log(dataView.getInt32(0).toString(16));
                    //console.log(e.target.result);
                };

                reader.readAsArrayBuffer(file.files[0]);
                
                this.set('filename', file.files[0].name);
                console.log(file.files[0]);
                
                
                //reader.readAsText(file.files[0]);
            }*/
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
