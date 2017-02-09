import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  showAllStudents: false,
  residencyModel: null,
  genderModel: null,
  advStandingModel: null,
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
  undoBOA: null,
  undoRC: null,
  undoAA: null,
  undoAC: null, 
  found: null,
  total: null,
  course: null,
  description: null,
  grade: null,
  unit: null,
  from: null,
    
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
      } else if(self.get('found')){
          self.showStudentData(self.get('currentIndex'));
          self.set('found', false);
      }else {
        self.set('currentIndex', records.indexOf(records.get("firstObject")));
      }
    });
  }),
 
  checkDOBStudent: Ember.observer('selectedDate', function(){
    this.get('undoRecords').push("dob");
    this.get('undoDOB').push(this.get('selectedDate'));
  }),
   checkGenStudent: Ember.observer('selectedGender', function(){
    this.get('undoRecords').push("gen");
    this.get('undoGender').push(this.get('selectedGender'));
    this.get('undoGender').push(this.get('selectedGender'));
  }),
   checkResStudent: Ember.observer('selectedResidency', function(){
     this.get('undoRecords').push("res");
     this.get('undoRes').push(this.get('selectedResidency'));
     this.get('undoRecords').push("res");
     this.get('undoRes').push(this.get('selectedResidency'));
   }),
   checkAAStudent: Ember.observer('currentStudent.admissAvg', function(){
    this.get('undoRecords').push('aa');
    this.get('undoAA').push(this.get('currentStudent').get('admissAvg'));
   }),
   checkBOAStudent: Ember.observer('currentStudent.BOA', function(){
     this.get('undoRecords').push('boa');
     this.get('undoBOA').push(this.get('currentStudent').get('BOA'));
   }),
   checkACStudent: Ember.observer('currentStudent.admissComments', function(){
     this.get('undoRecords').push('ac');
     this.get('undoAC').push(this.get('currentStudent').get('admissComments'));
   }),
   checkRCStudent: Ember.observer('currentStudent.regComments', function(){
     this.get('undoRecords').push('rc');
     this.get('undoRC').push(this.get('currentStudent').get('regComments'));
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
    this.get('store').findAll('gender').then(function(records) {
      self.set('genderModel', records);
    });
    // load first page of the students records
    this.set('limit', 10);
    this.set('offset', 0);
    this.set('pageSize', 10);
    this.resetUndo();
    
    var self = this;
    var self = this;
    this.get('store').query('student', {
      limit: 1000000,
      offset: 0
    }).then(function (records) {
      self.set('total', records.get('length')-1);
    });

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
    this.get('currentStudent').set('advStanding', []);
    this.set('advStandingModel',this.get('currentStudent').get('advStanding'));
    this.set('selectedGender', this.get('currentStudent').get('gender'));
    this.set('selectedResidency', this.get('currentStudent').get('resInfo'));
    this.set('studentPhoto', this.get('currentStudent').get('photo'));
    var date = this.get('currentStudent').get('DOB');
    var datestring = date.toISOString().substring(0, 10);
    this.set('selectedDate', datestring);
    this.get('undoRecords').push("reset");
    this.get('undoFirst').push(this.get('currentStudent').get('firstName'));
    this.get('undoLast').push(this.get('currentStudent').get('lastName'));
    this.get('undoGender').push(this.get('currentStudent').get('gender'));
    this.get('undoNumber').push(this.get('currentStudent').get('number'));
    this.get('undoRes').push(this.get('currentStudent').get('resInfo'));
    this.get('undoDOB').push(this.get("selectedDate"));
    this.get('undoAA').push(this.get('currentStudent').get('admissAvg'));
    this.get('undoAC').push(this.get('currentStudent').get('admissComments'));
    this.get('undoRC').push(this.get('currentStudent').get('regComments'));
    this.get('undoBOA').push(this.get('currentStudent').get('BOA'));
    
  },

  didRender() {
    Ember.$('.menu .item').tab();
    console.log(this.get('undoRecords').length);
  },
  resetUndo(){
    this.set('undoRecords', []);
      this.set('undoFirst', []);
      this.set('undoLast', []);
      this.set('undoGender', []);
      this.set('undoNumber', []);
      this.set('undoRes', []);
      this.set('undoDOB', []);
      this.set('undoAA',[]);
      this.set('undoAC', []);
      this.set('undoRC', []);
      this.set('undoBOA', []);
  },

  actions: {
    saveStudent () {
      console.log(this.get('selectedResidency'));
      var updatedStudent = this.get('currentStudent');
      
      updatedStudent.set('gender', this.get('selectedGender'));
      updatedStudent.set('DOB', new Date(this.get('selectedDate')));
      updatedStudent.set('resInfo', this.get('selectedResidency'));
      if(this.get('currentStudent').get('gender').get('type')=="Male"){
        updatedStudent.set('photo', "/assets/studentsPhotos/male.png");
        this.set('studentPhoto', "/assets/studentsPhotos/male.png");
      }
      else if(this.get('currentStudent').get('gender').get('type')=="Female"){
        updatedStudent.set('photo', "/assets/studentsPhotos/female.png");
        this.set('studentPhoto', "/assets/studentsPhotos/female.png");
      }
      else {
        updatedStudent.set('photo', "/assets/studentsPhotos/other.png");
        this.set('studentPhoto', "/assets/studentsPhotos/other.png");
      }
      updatedStudent.save().then(() => {
        
      });
      
    },

    firstStudent() {
      this.resetUndo();
      this.set('currentIndex', this.get('firstIndex'));
      
    },

    nextStudent() {
      this.resetUndo();
      this.set('movingBackword' , false);
       if (this.get('currentIndex') < this.get('lastIndex')) {
         this.set('currentIndex', this.get('currentIndex') + 1);
          //     console.log(JSON.stringify(this.get('currentStudent')));
       }
        else {
          if(this.get('offset') <= (this.get('total')- this.get('total')%10)-10) {
            this.set('offset', this.get('offset') + this.get('pageSize'));
          }
        }

        
    },

    previousStudent() {
      this.resetUndo();
      this.set('movingBackword' , true);
      if (this.get('currentIndex') > 0) {
        this.set('currentIndex', this.get('currentIndex') - 1);
      }
      else if (this.get('offset') > 0) {
        this.set('offset', this.get('offset') - this.get('pageSize'));
      }
    },

    lastStudent() {
      this.resetUndo();
      this.set('currentIndex', this.get('lastIndex'));
    },

    allStudents() {
      this.set('showAllStudents', true);
    },

    selectGender (gender){
      //console.log(gender);
      
      var gen = this.get('store').peekRecord('gender', gender);
      this.set('selectedGender', gen);
      this.get('currentStudent').set('gender', gen);
    },

    selectResidency (residency){
      var res = this.get('store').peekRecord('residency', residency);
      this.set('selectedResidency', res);
      this.get('currentStudent').set('resInfo', res);
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

    editNumber(num){
        this.get('undoRecords').push("num");
        this.get('undoNumber').push(this.get('currentStudent').get('number'));
        
        //this.get('undoNumber').push(this.get('currentStudent').get('number'));
        console.log("Pushed: " + this.get('currentStudent').get('number'));
        this.get('currentStudent').set('number', num);
      },
      editFirst(first){
       
        this.get('undoRecords').push('first');
        this.get('undoFirst').push(this.get('currentStudent').get('firstName'));
        this.get('currentStudent').set('firstName', first); 
      },
       editLast(last){
        this.get('undoRecords').push('last');
        this.get('undoLast').push(this.get('currentStudent').get('lastName'));
        this.get('currentStudent').set('lastName', last); 
      },
      editRC(rc){
        this.get('undoRecords').push('rc');
        this.get('undoRC').push(this.get('currentStudent').get('regComments'));
        this.get('currentStudent').set('regComments', rc);
      },

    addcredit(){
      let student=this.get('currentStudent');
      let standing =this.get('store').createRecord('advStanding', {
        course: this.get('course'),
        description: this.get('description'),
        unit: this.get('unit'),
        grade: this.get('grade'),
        from: this.get('from'),
        student: student
      });
      //console.log(student.get('advStanding'));
      
      //standing.save();
      
      //student.get('advStanding').pushObject(standing);
      console.log()
      
      student.get('advStanding').pushObject(standing);
      this.set('advStandingModel',this.get('currentStudent').get('advStanding'));
      //standing.save();
      //student.save();
      console.log(student.get('advStanding'));
      //student.save();
    },

    updateCourse(courseName){
      this.set('course',courseName);
      console.log(this.get('course'));
    },
    updateDescription(descText){
      this.set('description',descText);
      console.log(this.get('description'));
    },
    updateGrade(gradeValue){
      this.set('grade',gradeValue);
      console.log(this.get('grade'));
    },
    updateUnit(unitValue){
      this.set('unit',unitValue);
      console.log(this.get('unit'));
    },
    updateFrom(fromText){
      this.set('from',fromText);
      console.log(this.get('from'));
    },



    undo(){
      if(this.get('undoRecords').length > 1){
        switch(this.get('undoRecords').pop()){
          case 'reset': if(this.get('undoFirst').length > 0){
                          this.get('currentStudent').set('firstName', this.get('undoFirst').pop());
                          //this.get('currentStudent').set('firstName', this.get('undoFirst').pop());
                        }
                        if(this.get('undoLast').length > 0){
                          this.get('currentStudent').set('lastName', this.get('undoLast').pop());
                         // this.get('currentStudent').set('lastName', this.get('undoLast').pop());
                        }
                        if(this.get('undoNumber').length > 0){
                          this.get('currentStudent').set('number', this.get('undoNumber').pop());
                          //console.log(this.get('undoNumber').pop());
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
                          //this.get('currentStudent').set('firstName', this.get('undoFirst').pop());
                        }
                        break;
          case 'last':  if(this.get('undoLast').length > 0){
                          this.get('currentStudent').set('lastName', this.get('undoLast').pop());
                          //this.get('currentStudent').set('lastName', this.get('undoLast').pop());
                        }
                        break;
          case 'num':   if(this.get('undoNumber').length > 0){
                          this.get('currentStudent').set('number', this.get('undoNumber').pop());
                         // this.get('currentStudent').set('number', this.get('undoNumber').pop());
                        }
                        break;
          case 'dob':   if(this.get('undoDOB').length > 0){
                          this.set('selectedDate',this.get('undoDOB').pop());
                          this.set('selectedDate',this.get('undoDOB').pop());
                           if(this.get('undoRecords').length >= 2){
                              this.get('undoRecords').pop();
                          }
                        }
                        break;
          case 'gen':   if(this.get('undoGender').length > 0){
                          this.set('selectedGender', this.get('undoGender').pop());
                          this.get('currentStudent').set('gender', this.get('undoGender').pop());
                          this.set('selectedGender', this.get('undoGender').pop());
                          this.get('currentStudent').set('gender', this.get('undoGender').pop());
                           if(this.get('undoRecords').length >= 2){
                                this.get('undoRecords').pop();
                            }
                        }
                        break;
          case 'res':   if(this.get('undoRes').length > 0){
                          this.set('selectedResidency', this.get('undoRes').pop());
                          this.get('currentStudent').set('resInfo', this.get('undoRes').pop());
                          this.set('selectedResidency', this.get('undoRes').pop());
                          this.get('currentStudent').set('resInfo', this.get('undoRes').pop());
                           if(this.get('undoRecords').length >= 2){
                              this.get('undoRecords').pop();
                          }
                        }
                        break;
          case 'aa':    if(this.get('undoAA').length > 0){
                          this.get('currentStudent').set('admissAvg', this.get('undoAA').pop());
                          this.get('currentStudent').set('admissAvg', this.get('undoAA').pop());
                           if(this.get('undoRecords').length >= 2){
                              this.get('undoRecords').pop();
                          }
                        }
                        break;
          case 'rc':   if(this.get('undoRC').length > 0){
                          this.get('currentStudent').set('regComments', this.get('undoRC').pop());
                          this.get('currentStudent').set('regComments', this.get('undoRC').pop());
                           if(this.get('undoRecords').length >= 2){
                              this.get('undoRecords').pop();
                          }
                       }
                       break;
          case 'boa':  if(this.get('undoBOA').length > 0){
                          this.get('currentStudent').set('BOA', this.get('undoBOA').pop()); 
                          this.get('currentStudent').set('BOA', this.get('undoBOA').pop());
                           if(this.get('undoRecords').length >= 2){
                              this.get('undoRecords').pop();
                          }
                        }
                        break;
          case 'ac':   if(this.get('undoAC').length > 0){
                          this.get('currentStudent').set('admissComments', this.get('undoAC').pop());
                          this.get('currentStudent').set('admissComments', this.get('undoAC').pop());
                          if(this.get('undoRecords').length >= 2){
                               this.get('undoRecords').pop();
                        }
                       }
                       break;
          default:     break;
          
          }
        }
        this.rerender();
      },
      
      delete(id) {
        var nextIndex = 0;
        this.set('total', this.get('total')-1);
        if (this.get('currentIndex') < this.get('lastIndex')) {
          nextIndex = this.get('currentIndex') + 1;
        }
        else {
          nextIndex = this.get('currentIndex') - 1;
        }

        if (confirm("Press OK to Confirm Delete") === true) {
          var myStore = this.get('store');
          var self = this;
          myStore.findRecord('student', id).then(function (student) {
            student.destroyRecord();
          if(self.get('currentIndex')==0){
            self.set('offset', self.get('offset')-10);
            nextIndex = 9;
          }
          else if(self.get('currentIndex')> 0){
            nextIndex = (self.get('currentIndex')-1);
          }
          self.set('currentIndex', nextIndex);
        });
       
        }

      },
    }
});
