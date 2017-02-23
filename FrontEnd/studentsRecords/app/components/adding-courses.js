import Ember from 'ember';

export default Ember.Component.extend({

    store: Ember.inject.service(),
    notDONE: true,
    currentStudent: null,
    highSchoolModel: null,
    highSchoolCourseModel: null,
    highSchoolSubjectModel: null,
    higSchoolGradeModel: null,

    showSubject: false,
    showDescription: false,
    showLevel: false,
    showUnits: false,
    DONE: false,
    showList: false,

    currentHighSchool: null,
    currentSource: null,
    currentLevel: null,
    currentUnit: null,
    currentCourse: null,

    newGrade: "",
    newCourse: null,

    init() {
        this._super(...arguments);
        var self = this;
        this.get('store').findAll('highSchool').then(function (records) {
            self.set('highSchoolModel', records);
            //console.log(records.content);
            self.set('currentHighSchool', records.content[0].id);
            //console.log("hello");
            //console.log(records.content[0].id);
            //console.log("this is the current high school id: "+self.get('currentHighSchool'));
            //console.log(self.get('highSchoolModel'));
        });

        this.get('store').findAll('highschool-subject').then(function(records){
            self.set('highSchoolSubjectModel', records);
            //console.log(records);
            //console.log('yo');
            //console.log(self.get('highSchoolSubjectModel').objectAt(0).get('name'));
            //console.log(self.get('highSchoolSubjectModel').objectAt(0).get('id'));
        });

        this.get('store').findAll('high-school-course').then(function(records){
            self.set('highSchoolCourseModel', records);
            //console.log(records);
            //console.log('here');
            //console.log(self.get('highSchoolCourseModel').objectAt(0).get('subject'));
            //console.log(self.get('highSchoolCourseModel').objectAt(0).get('subject').get('id'));
        });

        this.get('store').findAll('highschool-grade').then(function(records){
            self.set('highSchoolGradeModel', records);
            console.log('getting grade records from store');
            console.log(records);
        });
        


        //this.set('currentHighSchool', self.get('highSchoolModel').objectAt(0).get('id'));
        //console.log(this.get('currentHighSchool'));

        // var record = this.get('store').createRecord('highschool', {
        //     name: "St Clair Secondary School",
        //     course: [],
        // });
        // console.log(record.get('name'));
        // record.save();
        
    
    },

actions:{
    exit: function () {
        this.set('notDONE', false);
        Ember.$('.ui.modal').modal('hide');
        Ember.$('.ui.modal').remove();
    },

    updateHighSchoolSelection: function(val){
        this.set('currentHighSchool', val);
        this.set('optionNumber', 1);
        this.set('showList', true);
        this.set('showLevel', false);
        this.set('showUnits', false);
        this.set('showSubject', false);
        Ember.$('.ui.modal').modal('hide');
        Ember.$('.ui.modal').modal('show');
    },
    updateGrade: function(val){
        this.set('newGrade', val);
    },

    addCourseToRecord: function(index){
        var self = this;
        this.get('store').find('high-school-course', this.get('highSchoolCourseModel').objectAt(index).get('id')).then(function(record){
            //console.log('course to be added found')
            //console.log('record if: '+record.id);
            //console.log('record.... '+record);
            self.set('newCourse', record.id);
            console.log('newCourse: '+self.get('newCourse'));
                
            console.log(self.get('newGrade'));
            console.log(self.get('newCourse'));
            console.log(self.get('currentStudent').get('id'));

            if (self.get('newGrade')!==""){
                var record = self.get('store').createRecord('highschool-grade', {
                    grade: self.get('newGrade'),
                    course: self.get('newCourse'),
                    student: self.get('currentStudent').get('id')
                });
                console.log(record);
                console.log('grade: ');
                console.log(record.grade);
                console.log('course ');
                console.log(record.course);
                console.log('student ');
                console.log(record.student);
                record.save();
            }
          });
       

        this.set('notDONE', false);
        Ember.$('.ui.modal').modal('hide');
        Ember.$('.ui.modal').remove();
    }


},
    

    didRender() {
      Ember.$('.ui.modal')
        .modal({
         closable: false
        })
        .modal('show');
    }
});
