import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service(),
    residencyModel: null,
    genderModel: null,
    newResChoice: null,
    newGenderChoice: null,

    highSchoolSubjectModel: null,
    newSujectName: null,
    newSubjectDescription: null,
    
    highSchoolModel: null,
    

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

        this.get('store').findAll('highschool-subject').then(function(records){
            self.set('highSchoolSubjectModel', records);
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
            console.log(record.get('type'));
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
            record.set('type', (self.$('.' + index)).val());
            record.save();
                
          });
        }
      },
      

      removeSubjectOption(index){
       this.get('store').find('highschool-subject',this.get('highSchoolSubjectModel').objectAt(index).get('id')).then(function(record){
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

      changeSubjectName(index)
      {
          var self = this;
        if((this.$('.' + index)).val()!== ""){
            this.get('store').find('highschool-subject', this.get('highSchoolSubjectModel').objectAt(index).get('id')).then(function(record){
            record.set('name', (self.$('.' + index)).val());
            record.save();
                
          });
        }
      },

      changeSubjectDescription(index)
      {
          var self = this;
        if((this.$('.' + index)).val()!== ""){
            this.get('store').find('highschool-subject', this.get('highSchoolSubjectModel').objectAt(index).get('id')).then(function(record){
            record.set('description', (self.$('.' + index)).val());
            record.save();
                
          });
        }
      },

      updateSubjectName(val)
      {
        this.set('newSubjectName',val);
      },

       updateSubjectDescription(val)
      {
        this.set('newSubjectDescription',val);
      },

      addSubjectOption(){
        if ((this.get('newSubjectName')!=="")&&(this.get('newSubjectDescription')!=="")){
            var record = this.get('store').createRecord('highschool-subject', {
                name: this.get('newSubjectName'),
                description: this.get('newSubjectDescription'),
                course: []
            });
            console.log(record);
            record.save();
        }
      },

  }
});
