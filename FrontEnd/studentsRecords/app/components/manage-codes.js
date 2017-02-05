import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service(),
    residencyModel: null,
    genderModel: null,
    newResChoice: null,
    newGenderChoice: null,
    

    init() {
        this._super(...arguments);
        this.newResChoice="";
        this.newGenderChoice="";
        var self = this;
        this.get('store').findAll('residency').then(function (records) {
            self.set('residencyModel', records);
        });
        this.get('store').findAll('gender').then(function (records) {
           self.set('genderModel', records);
        });
    },

    didRender() {
    Ember.$('.menu .item').tab();
  },

  actions: {
      removeStudentOption(index){
          
          //this.get('residencyModel').removeAt(index);
          this.get('store').find('residency',this.get('residencyModel').objectAt(index).get('id')).then(function(record){
                record.deleteRecord();
                if(record.get('isDeleted'))
                {
                    record.save();
                }
                
          }, function (error){
              console.log(error);
          });
          
      },

      addStudentOption(){
        if (this.get('newResChoice')!==""){
            var record = this.get('store').createRecord('residency', {
                name: this.get('newResChoice'),
                students: []
            });
            record.save();
        }
      },
      removeGenderOption(index){
       this.get('store').find('gender',this.get('genderModel').objectAt(index).get('id')).then(function(record){
                record.deleteRecord();
                if(record.get('isDeleted'))
                {
                    record.save();
                }
                
          }, function (error){
              console.log(error);
          });
          console.log(index);
      },
      addGenderOption(){
        if (this.get('newGenderChoice')!==""){
            var record = this.get('store').createRecord('gender', {
                type: this.get('newGenderChoice'),
                students: []
            });
            record.save();
        }
      },
      updateResChoice(val){
          this.set('newResChoice', val);
          
      },
      updateGenderChoice(val)
      {
        this.set('newGenderChoice',val);
      },
      changeResName(index)
      {
          var self = this;
        if((this.$('#' + index)).val()!== ""){
            this.get('store').find('residency',this.get('residencyModel').objectAt(index).get('id')).then(function(record){
            record.set('name', (self.$('#' + index)).val());
            record.save();
                
          });
        }
    
      },
      changeGenderName(index)
      {
          var self = this;
        if((this.$('.' + index)).val()!== ""){
            this.get('store').find('gender', this.get('genderModel').objectAt(index).get('id')).then(function(record){
            record.set('name', (self.$('.' + index)).val());
            record.save();
                
          });
        }
      },
      

  }
});
