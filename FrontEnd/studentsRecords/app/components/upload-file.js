import Ember from 'ember';

export default Ember.Component.extend({
    
    filename: null,
    success: false,

    actions: {

        upload() { 
            //document.getElementById('file-field');
            
            var self = this;
            var file = document.getElementById('file-field');
            //console.log(file.files.length);
            //console.log(file.files[0]);
            //console.log(file.files[0].name);

            if(file.files.length >0)
            {
                //self.set('filename', file.files[0].name);
                var formData = new FormData();

                    
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

        


    }
});
