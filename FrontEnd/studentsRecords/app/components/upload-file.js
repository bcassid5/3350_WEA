import Ember from 'ember';

export default Ember.Component.extend({
    
    filename: null,

    actions: {

        upload() { 
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
            }
        },

        


    }
});
