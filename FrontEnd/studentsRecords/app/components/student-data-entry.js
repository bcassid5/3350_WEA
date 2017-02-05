import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  showAllStudents: false,
  residencyModel: null,
  selectedResidency: null,
  selectedGender: null,
  selectedDate: null,
  studentsRecords: null,
  currentStudent: null,
  currentIndex: null,
  firstIndex: 0,
  lastIndex: 0,
  finalIndex: 99,
  studentPhoto: null,
  limit: null,
  offset: null,
  pageSize: null,
  movingBackword: false,
  showHelpPage: false,
  showFindRecordPage: false,

  studentModel: Ember.observer('offset', function () {
    var self = this;
    this.get('store').query('student', {
      limit: self.get('limit'),
      offset: self.get('offset')
    }).then(function (records) {
      self.set('studentsRecords', records);
      self.set('firstIndex', records.indexOf(records.get("firstObject")));
      self.set('lastIndex', records.indexOf(records.get("lastObject")));
      if (self.get('movingBackword')) {
        self.set('currentIndex', records.indexOf(records.get("lastObject")));
      } else {
        self.set('currentIndex', records.indexOf(records.get("firstObject")));
      }
    });
  }),

  fetchStudent: Ember.observer('currentIndex', function () {
    this.showStudentData(this.get('currentIndex'));
  }),

  init() {
    this._super(...arguments);
    // load Residency data model
    this.get('store').findAll('residency').then(function (records) {
      self.set('residencyModel', records);
    });

    // load first page of the students records
    this.set('limit', 10);
    this.set('offset', 0);
    this.set('pageSize', 10);
    this.set('finalIndex', 99);
    var self = this;
    this.get('store').query('student', {
      limit: self.get('limit'),
      offset: self.get('offset')
    }).then(function (records) {
      self.set('studentsRecords', records);
      self.set('firstIndex', records.indexOf(records.get("firstObject")));
      self.set('lastIndex', records.indexOf(records.get("lastObject")));

      // Show first student data
      self.set('currentIndex', self.get('firstIndex'));
    });
  },

  showStudentData: function (index) {
    this.set('currentStudent', this.get('studentsRecords').objectAt(index));
    //this.set('studentPhoto', this.get('currentStudent').get('photo'));
    if(this.get('currentStudent').get('gender')==1){
      this.set('studentPhoto', "/assets/studentsPhotos/male.png");
    }
    else{
      this.set('studentPhoto', "/assets/studentsPhotos/female.png");
    }
    var date = this.get('currentStudent').get('DOB');
    var datestring = date.toISOString().substring(0, 10);
    this.set('selectedDate', datestring);
  },

  didRender() {
    Ember.$('.menu .item').tab();
  },


  actions: {
    saveStudent () {
      var updatedStudent = this.get('currentStudent');
      var res = this.get('store').peekRecord('residency', this.get('selectedResidency'));
      updatedStudent.set('gender', this.get('selectedGender'));
      updatedStudent.set('DOB', new Date(this.get('selectedDate')));
      updatedStudent.set('resInfo', res);
      updatedStudent.save().then(() => {
        //     this.set('isStudentFormEditing', false);
      });

      if(this.get('currentStudent').get('gender')==1){
        this.set('studentPhoto', "/assets/studentsPhotos/male.png");
      }
      else{
        this.set('studentPhoto', "/assets/studentsPhotos/female.png");
      }
    },

    firstStudent() {
      this.set('currentIndex', this.get('firstIndex'));
      //this.set('currentIndex', this.get('indexFirstDb'));
    },

    nextStudent() {
      this.set('movingBackword' , false);
      console.log(this.get('finalIndex') + " " + this.get('currentIndex'));
       if (this.get('currentIndex') < this.get('lastIndex')) {
         this.set('currentIndex', this.get('currentIndex') + 1);
          //     console.log(JSON.stringify(this.get('currentStudent')));
       }
        else {
          if(this.get('offset') <= 80){
            this.set('offset', this.get('offset') + this.get('pageSize'));
          }
        }
    },

    previousStudent() {
      this.set('movingBackword' , true);
      if (this.get('currentIndex') > 0) {
        this.set('currentIndex', this.get('currentIndex') - 1);
      }
      else if (this.get('offset') > 0) {
        this.set('offset', this.get('offset') - this.get('pageSize'));
      }
    },

    lastStudent() {
      this.set('currentIndex', this.get('lastIndex'));
      //this.set('currentIndex', this.get('indexLastDb'));
    },

    allStudents() {
      this.set('showAllStudents', true);
    },

    selectGender (gender){
      console.log(gender);
      this.set('selectedGender', gender);

    },

    selectResidency (residency){
      this.set('selectedResidency', residency);
    },

    assignDate (date){
      this.set('selectedDate', date);
    },

    help(){
      this.set('showHelpPage', true);
    },

    findStudent(){
      this.set('showFindRecordPage', true);
    },

    undo(){
      if(this.get('undoRecords').length > 4){
        switch(this.get('undoRecords').pop()){
          case 'reset': if(this.get('undoFirst').length > 0){
                          this.get('currentStudent').set('firstName', this.get('undoFirst').pop());
                          this.get('currentStudent').set('firstName', this.get('undoFirst').pop());
                        }
                        if(this.get('undoLast').length > 0){
                          this.get('currentStudent').set('lastName', this.get('undoLast').pop());
                          this.get('currentStudent').set('lastName', this.get('undoLast').pop());
                        }
                        if(this.get('undoNumber').length > 0){
                          this.get('currentStudent').set('number', this.get('undoNumber').pop());
                          this.get('currentStudent').set('number', this.get('undoNumber').pop());
                        }
                        if(this.get('undoDOB').length > 0 ){
                          this.set('selectedDate',this.get('undoDOB').pop());
                          this.set('selectedDate',this.get('undoDOB').pop());
                        }
                        if(this.get('undoGender').length > 0){
                          this.set('selectedGender', this.get('undoGender').pop());
                          this.get('currentStudent').set('gender', this.get('undoGender').pop());
                          this.set('selectedGender', this.get('undoGender').pop());
                          this.get('currentStudent').set('gender', this.get('undoGender').pop());
                        }
                        if(this.get('undoRes').length > 0){
                          this.set('selectedResidency', this.get('undoRes').pop());
                          this.get('currentStudent').set('resInfo', this.get('undoRes').pop());
                          this.set('selectedResidency', this.get('undoRes').pop());
                          this.get('currentStudent').set('resInfo', this.get('undoRes').pop());
                        }
                        break;
          case 'first': if(this.get('undoFirst').length > 0){
                          this.get('currentStudent').set('firstName', this.get('undoFirst').pop());
                          this.get('currentStudent').set('firstName', this.get('undoFirst').pop());
                        }
                        break;
          case 'last':  if(this.get('undoLast').length > 0){
                          this.get('currentStudent').set('lastName', this.get('undoLast').pop());
                          this.get('currentStudent').set('lastName', this.get('undoLast').pop());
                        }
                        break;
          case 'num':   if(this.get('undoNumber').length > 0){
                          this.get('currentStudent').set('number', this.get('undoNumber').pop());
                          this.get('currentStudent').set('number', this.get('undoNumber').pop());
                        }
                        break;
          case 'dob':   if(this.get('undoDOB').length > 0){
                          this.set('selectedDate',this.get('undoDOB').pop());
                          this.set('selectedDate',this.get('undoDOB').pop());
                        }
                        break;
          case 'gen':   if(this.get('undoGender').length > 0){
                          this.set('selectedGender', this.get('undoGender').pop());
                          this.get('currentStudent').set('gender', this.get('undoGender').pop());
                          this.set('selectedGender', this.get('undoGender').pop());
                          this.get('currentStudent').set('gender', this.get('undoGender').pop());
                        }
                        break;
          case 'res':   if(this.get('undoRes').length > 0){
                          this.set('selectedResidency', this.get('undoRes').pop());
                          this.get('currentStudent').set('resInfo', this.get('undoRes').pop());
                          this.set('selectedResidency', this.get('undoRes').pop());
                          this.get('currentStudent').set('resInfo', this.get('undoRes').pop());
                        }
                        break;
          case 'aa':    if(this.get('undoAA').length > 0){
                          this.get('currentStudent').set('admissAvg', this.get('undoAA').pop());
                          this.get('currentStudent').set('admissAvg', this.get('undoAA').pop());
                        }
                        break;
          case 'rc':   if(this.get('undoRC').length > 0){
                          this.get('currentStudent').set('regComments', this.get('undoRC').pop());
                          this.get('currentStudent').set('regComments', this.get('undoRC').pop());
                       }
                       break;
          case 'boa':  if(this.get('undoBOA').length > 0){
                          this.get('currentStudent').set('BOA', this.get('undoBOA').pop()); 
                          this.get('currentStudent').set('BOA', this.get('undoBOA').pop());
                        }
                        break;
          case 'ac':   if(this.get('undoAC').length > 0){
                          this.get('currentStudent').set('admissComments', this.get('undoAC').pop());
                          this.get('currentStudent').set('admissComments', this.get('undoAC').pop());
                       }
                       break;
          default:     break;
          
          }
             if(this.get('undoRecords').length >= 4){
                  this.get('undoRecords').pop();
              }
        }
        this.rerender();
      },


      delete(id) {
        var nextIndex = 0;
        if (this.get('currentIndex') < this.get('lastIndex')) {
          nextIndex = this.get('currentIndex') + 1;
        }
        else {
          nextIndex = this.get('currentIndex') - 1;
        }

        if (confirm("Press OK to Confirm Delete") === true) {
          var myStore = this.get('store');
          myStore.findRecord('student', id).then(function (student) {
            student.destroyRecord();
          });
          this.set('currentIndex', nextIndex);
        }

      },
    }
});
