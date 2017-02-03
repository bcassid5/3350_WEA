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
  studentPhoto: null,
  limit: null,
  offset: null,
  pageSize: null,
  movingBackword: false,
  showHelpPage: false,
  showFindRecordPage: false,
  undoRecords: null,
  undoFirst: null,
  undoLast: null,
  undoNumber: null,
  undoGender: null,
  undoRes: null,
  undoDOB: null,
    
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
  checkFirstStudent: Ember.observer('currentStudent.firstName', function(){
    this.get('undoRecords').push("first");
    this.get('undoFirst').push(this.get('currentStudent').get('firstName'));
  }),
  checkLastStudent: Ember.observer('currentStudent.lastName', function(){
    this.get('undoRecords').push("last");
    this.get('undoLast').push(this.get('currentStudent').get('lastName'));
  }),
   checkNumStudent: Ember.observer('currentStudent.number', function(){
    this.get('undoRecords').push("num");
    this.get('undoNumber').push(this.get('currentStudent').get('number'));
  }),
  checkDOBStudent: Ember.observer('selectedDate', function(){
    this.get('undoRecords').push("dob");
    this.get('undoDOB').push(this.get('selectedDate'));
  }),
   checkGenStudent: Ember.observer('selectedGender', function(){
    this.get('undoRecords').push("gen");
    this.get('undoGender').push(this.get('selectedGender'));
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
    this.set('undoRecords', []);
    this.set('undoFirst', []);
    this.set('undoLast', []);
    this.set('undoGender', []);
    this.set('undoNumber', []);
    this.set('undoRes', []);
    this.set('undoDOB', []);
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
    this.get('undoRecords').push("reset");
    this.get('undoFirst').push(this.get('currentStudent').get('firstName'));
    this.get('undoLast').push(this.get('currentStudent').get('lastName'));
    this.get('undoGender').push(this.get('currentStudent').get('gender'));
    this.get('undoNumber').push(this.get('currentStudent').get('number'));
    this.get('undoRes').push(this.get('currentStudent').get('resInfo'));
    this.get('undoDOB').push(this.get('currentStudent').get('DOB'));
    this.set('studentPhoto', this.get('currentStudent').get('photo'));
    // if(this.get('currentStudent').get('gender')==1){
    //   this.set('studentPhoto', "/assets/studentsPhotos/male.png");
    // }
    // else{
    //   this.set('studentPhoto', "/assets/studentsPhotos/female.png");
    // }
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
      console.log(this.get('currentStudent').get('gender'));
      if(this.get('currentStudent').get('gender')==1){
        updatedStudent.set('photo', "/assets/studentsPhotos/male.png");
        this.set('studentPhoto', "/assets/studentsPhotos/male.png");
      }
      else if(this.get('currentStudent').get('gender')==2){
        updatedStudent.set('photo', "/assets/studentsPhotos/female.png");
        this.set('studentPhoto', "/assets/studentsPhotos/female.png");
      }
      updatedStudent.save().then(() => {
        //     this.set('isStudentFormEditing', false);
      });
      
    },

    firstStudent() {
      this.set('currentIndex', this.get('firstIndex'));
      //this.set('currentIndex', this.get('indexFirstDb'));
    },

    nextStudent() {
      this.set('movingBackword' , false);
       if (this.get('currentIndex') < this.get('lastIndex')) {
         this.set('currentIndex', this.get('currentIndex') + 1);
          //     console.log(JSON.stringify(this.get('currentStudent')));
       }
        else {
          if(this.get('offset') <= 80){
            this.set('offset', this.get('offset') + this.get('pageSize'));
          }
        }
        this.set('undoRecords', []);
        
    },

    previousStudent() {
      this.set('movingBackword' , true);
      if (this.get('currentIndex') > 0) {
        this.set('currentIndex', this.get('currentIndex') - 1);
      }
      else if (this.get('offset') > 0) {
        this.set('offset', this.get('offset') - this.get('pageSize'));
      }
      this.set('undoRecords', []);
    },

    lastStudent() {
      this.set('currentIndex', this.get('lastIndex'));
      //this.set('currentIndex', this.get('indexLastDb'));
    },

    allStudents() {
      this.set('showAllStudents', true);
    },

    selectGender (gender){
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
      console.log(this.get('undoRecords').length);
      this.rerender();
      if(this.get('undoRecords').length > 0){
        switch(this.get('undoRecords').pop()){
          case 'reset': this.get('currentStudent').set('firstName', "test");
                        break;
          case 'first': this.get('currentStudent').set('firstName', this.get('undoFirst').pop());
                        this.get('currentStudent').set('firstName', this.get('undoFirst').pop());
                        break;
          case 'last':  this.get('currentStudent').set('lastName', this.get('undoLast').pop());
                        this.get('currentStudent').set('lastName', this.get('undoLast').pop());
                        break;
          case 'num':   this.get('currentStudent').set('number', this.get('undoNumber').pop());
                        this.get('currentStudent').set('number', this.get('undoNumber').pop());
                        break;
          case 'dob':   this.set('selectedDate',this.get('undoDOB').pop());
                        this.set('selectedDate',this.get('undoDOB').pop());
                        break;
          case 'gen':   this.set('selectedGender', this.get('undoGender').pop());
                        this.set('selectedGender', this.get('undoGender').pop());
                        break;
        }
        this.get('undoRecords').pop();
      }
      //this.get('currentStudent').set('firstName', "Test");
  }
  }
});
