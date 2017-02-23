import Ember from 'ember';

export default Ember.Component.extend({

    store: Ember.inject.service(),
    notDONE: true,
    currentStudent: null,
    highSchoolModel: null,
    highSchoolCourseModel: null,
    highSchoolSubjectModel: null,

    showSubject: false,
    showDescription: false,
    showLevel: false,
    showUnits: false,
    DONE: false,

    currentHighSchool: null,
    currentSource: null,
    currentLevel: null,
    currentCourse: null,

    init() {
        this._super(...arguments);
        var self = this;
        this.get('store').findAll('highSchool').then(function (records) {
            self.set('highSchoolModel', records);
            //console.log(records.content);
            self.set('currentHighSchool', records.content[0].id);
            console.log("hello");
            console.log(records.content[0].id);
            console.log("this is the current high school id: "+self.get('currentHighSchool'));
            //console.log(self.get('highSchoolModel'));
        });

        this.get('store').findAll('high-school-course').then(function(records){
            self.set('highSchoolCourseModel', records);
            //console.log(records);
            console.log('here');
        console.log((self.get('highSchoolCourseModel').objectAt(0).get('highschool')).get('id'));
        });

        this.get('store').findAll('highschool-subject').then(function(records){
            self.set('highSchoolSubjectModel', records);
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
    add: function(){
        

    },

    updateHighSchoolSelection: function(val){
        this.set('currentHighSchool', val);
        this.set('showLevel', false);
        this.set('showUnits', false);
        this.set('showSubject', false);
        Ember.$('.ui.modal').modal('hide');
        Ember.$('.ui.modal').modal('show');
    },

    updateSourceSelection: function(val){
        this.set('currentSource', val);
        this.set('showLevel', true);
        this.set('showUnits', false);
        this.set('showSubject', false);
        Ember.$('.ui.modal').modal('hide');
        Ember.$('.ui.modal').modal('show');
    },

    updateLevelSelection: function(val){
        this.set('currentLevel', val);
        this.set('showUnits', true);
        this.set('showSubject', false);
        Ember.$('.ui.modal').modal('hide');
        Ember.$('.ui.modal').modal('show');
    },

    updateUnitSelection: function(val){
        this.set('currentCourse', val);
        this.set('showSubject', true);
        Ember.$('.ui.modal').modal('hide');
        Ember.$('.ui.modal').modal('show');
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
