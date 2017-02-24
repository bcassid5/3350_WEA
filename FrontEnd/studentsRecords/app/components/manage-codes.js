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
    newHighSchoolName: null,

    highSchoolCourseModel: null,
    newCourseLevel: null,
    newCourseSource: null,
    newCourseUnit: null,
    newCourseSubject: null,
    newCourseHighSchool: null,
    

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

        this.get('store').findAll('highSchool').then(function(records){
            self.set('highSchoolModel', records);
        });

        this.get('store').findAll('high-school-course').then(function(records){
            self.set('highSchoolCourseModel', records);
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
          console.log("changeSubjectName called");
          var self = this;
        if((this.$('.' + index)).val()!== ""){
            console.log(index);
            console.log('hello   '+(this.$('.'+index)).val());
            console.log('hellox2   '+(self.$('.'+index)).val());
            this.get('store').findRecord('highschool-subject', index).then(function(record){
            //this.get('store').find('highschool-subject', index).then(function(record){
                record.set('name', (self.$('.' + index)).val());
                record.data.name = self.$('.' + index).val();
                record.save();
          });
        }
      },

      changeSubjectDescription(index)
      {
          console.log("changeSubjectDescription called");
          var self = this;
        if((this.$('#' + index)).val()!== ""){
            this.get('store').findRecord('highschool-subject', index).then(function(record){
                record.set('description', (self.$('#' + index)).val());
                record.data.description =  self.$('#' + index).val();
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

       changeHighSchoolName(index)
      {
         console.log('Change HS Name called');
          var self = this;
          console.log(index);
        if((this.$('#' + index)).val()!== ""){
            this.get('store').findRecord('highSchool', index).then(function(record){
                console.log(record);
                record.set('name', (self.$('.' + index)).val());
                record.data.name= (self.$('.' + index)).val();
                console.log(self.$('.'+ index).val());
                console.log(record.get('name'));
                record.save();

          });
        }
      },

      removeHighSchoolOption(index){
        this.get('store').find('highSchool',this.get('highSchoolModel').objectAt(index).get('id')).then(function(record){
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

      updateHighSchoolName(val)
      {
        this.set('newHighSchoolName',val);
      },

      addHighSchoolOption(){
        if (this.get('newHighSchoolName')!==""){
            var record = this.get('store').createRecord('highSchool', {
                name: this.get('newHighSchoolName'),
                course: []
            });
            record.save();
        }
      },

      changeCourseLevel(index)
      {
          var self = this;
        if((this.$('.' + index)).val()!== ""){
            this.get('store').find('high-school-course', this.get('highSchoolCourseModel').objectAt(index).get('id')).then(function(record){
            record.set('level', (self.$('.' + index)).val());
            record.save();
                
          });
        }
      },

      changeCourseSource(index)
      {
          var self = this;
        if((this.$('.' + index)).val()!== ""){
            this.get('store').find('high-school-course', this.get('highSchoolCourseModel').objectAt(index).get('id')).then(function(record){
            record.set('source', (self.$('.' + index)).val());
            record.save();
                
          });
        }
      },

      changeCourseUnit(index)
      {
          var self = this;
        if((this.$('.' + index)).val()!== ""){
            this.get('store').find('high-school-course', this.get('highSchoolCourseModel').objectAt(index).get('id')).then(function(record){
            record.set('unit', (self.$('.' + index)).val());
            record.save();
                
          });
        }
      },

      removeCourseOption(index){
       this.get('store').find('high-school-course',this.get('highSchoolCourseModel').objectAt(index).get('id')).then(function(record){
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

      updateCourseLevel(val)
      {
        this.set('newCourseLevel',val);
      },

      updateCourseSource(val)
      {
        this.set('newCourseSource',val);
      },

      updateCourseUnit(val)
      {
        this.set('newCourseUnit',val);
      },

      updateCourseSubject(val)
      {
        var sub = this.get('store').peekRecord('highschool-subject', val);
        this.set('newCourseSubject', sub);
        console.log("Subject" + val);
        console.log("CourseSubject" +  this.get('newCourseSubject'));
      },

      updateCourseHighSchool(val)
      {
        var hs = this.get('store').peekRecord('high-school', val);
        this.set('newCourseHighSchool', hs);
        console.log("HS" + val);
        console.log("CourseHS" +  this.get('newCourseHighSchool'));
      },

      addCourseOption(){
        if (this.get('newHighSchoolName')!==""){
            var record = this.get('store').createRecord('high-school-course', {
                level: this.get('newCourseLevel'),
                source: this.get('newCourseSource'),
                unit: this.get('newCourseUnit'),
                subject: this.get('newCourseSubject'),
                highschool: this.get('newCourseHighSchool'),
                grade: []
            });
            record.save();
        }
      }

  }
});
