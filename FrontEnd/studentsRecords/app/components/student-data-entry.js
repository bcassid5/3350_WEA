import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  showAllStudents: false,
  residencyModel: null,
  genderModel: null,
  advStandingModel: null,
  planCodeModel: null,
  courseCodeModel: null,
  termCodeModel: null,
  termModel: null,
  programModel: null,
  programRecordModel: null,
  gradeModel: null,
  awards: null,
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
  showAddCoursePage: false,
  isEditingGrade: false,
  highSchoolModel: null,
  highSchoolSubjectModel: null,
  highSchoolCourseModel: null,
  highSchoolGradeModel: null,
  newAdv: null,
  newAwd: null,
  newStudentTerm: null,
  newProg: false,
  newGrade: false,
  note: null,
  err: null,
  enableAdvEdit: null,
  enableAwdEdit: null,
  enableGradeEdit: null,
  allowprograms: false,
  showSubject: false,
  showDescription: false,
  showLevel: false,
  showUnits: false,
  showList: false,
  currentHighSchool: null,
  currentSource: null,
  currentLevel: null,
  currentUnit: null,
  currentCourse: null,
  newHSCourseGrade: "",
  newCourse: null,
  enableHSCourseEdit: false,
  newGradeMark: null,
  newGradeNote: null,
  newGradeCourse: null,
  newGradeIndex: null,
  newProgramLevel: null,
  newProgramLoad: null,
  newProgramStatus: null,
  newProgramPlans: [],
  newProgramName: null,
  newProgramIndex: null,

  logExpModel:null,
  ruleModel:null,
  codeModel:null,
  adjudicationModel:null,
  newAdjTerm:false,
  errAdjTerm:null,
  newCodeList:null,
  newAdjTermName:null,
  chosenCourse:null,


  USP01IsPermitted: Ember.computed(function(){ //Manage system roles
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("USP01") >= 0);
    }
  }),
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
    
    this.chosenCourse=null;
    this.get('store').findAll('highSchool').then(function (records) {
            self.set('highSchoolModel', records);
        });

        this.get('store').findAll('highschool-subject').then(function(records){
            self.set('highSchoolSubjectModel', records);
            
        });

        this.get('store').findAll('high-school-course').then(function(records){
            self.set('highSchoolCourseModel', records);
        });
/********************************************************************************************************** */
        this.get('store').findAll('highschool-grade').then(function(records){
            self.set('highSchoolGradeModel', records);
            //console.log('getting grade records from store');
            //console.log(records);
        });
/************************************************************************************************************* */

    // load Residency data model
    this.get('store').findAll('residency').then(function (records) {
      self.set('residencyModel', records);
    });
    this.get('store').findAll('gender').then(function(records) {
      self.set('genderModel', records);
    });
    
    this.get('store').findAll('program').then(function(records){
      self.set('programModel', records);
    });

    this.get('store').findAll('courseCode').then(function(records) {
      self.set('courseCodeModel', records);
    });
    this.get('store').findAll('planCode').then(function(records) {
      self.set('planCodeModel', records);
    });
    this.get('store').findAll('schoolTerm').then(function(records) {
      self.set('termModel', records);
    });

    /*****************************************/
    //adjudication models
    this.get('store').findAll('logExpress').then(function(records){
        self.set('logExpModel', records);
    });

    this.get('store').findAll('rule').then(function(records){
        self.set('ruleModel', records);
    });

    this.get('store').findAll('assessmentCode').then(function(records){
        self.set('codeModel', records);
    });

    this.get('store').findAll('adjudication').then(function(records){
        self.set('adjudicationModel', records);
    });
    
    // load first page of the students records
    this.set('limit', 10);
    this.set('offset', 0);
    this.set('pageSize', 10);
    this.set('course', "");
    this.set('description', "");
    this.set('unit', "");
    this.set('grade', "");
    this.set('from', "");
    this.set('note', "");
    this.set('enableAdvEdit', false);
    this.set('enableAwdEdit', false);
    this.set('enableGradeEdit', false);
    this.resetUndo();
    this.set('err', false);
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

    
    //this.get('currentStudent').set('advStanding', []);
    //console.log(this.get('currentStudent').get('advStanding'));
    var self = this;
    self.get('store').query('termCode',{student: self.get('currentStudent').get('id')}).then(function(terms){
          self.set('termCodeModel', terms);
          
          
          self.set('programRecordModel', []);
          for(var i =0; i <self.get('termCodeModel').get('length'); i++){
           self.get('store').query('program-record',{term: self.get('termCodeModel').objectAt(i).get('id')}).then(function(programs){
            self.get('programRecordModel').addObjects(programs);
            console.log(self.get('programRecordModel').get('length'));
            });
          
          }
          self.set('gradeModel', []);
          self.get('store').query('grade',{schoolterm: self.get('termCodeModel').objectAt(0).get('name').get('id')}).then(function(grades){
            
            console.log("grade length: " + grades.get('length'));
            });
          for(var i =0; i <self.get('termCodeModel').get('length'); i++){
           self.get('store').query('grade',{term: self.get('termCodeModel').objectAt(i).get('id')}).then(function(grades){
            self.get('gradeModel').addObjects(grades);
            });
          
          }
          
        });
   
    this.get('store').query('advStanding',{student: this.get('currentStudent').get('id')}).then(function(adv){
      self.set('advStandingModel', adv);
      self.get('store').query('award',{student: self.get('currentStudent').get('id')}).then(function(awd){
        self.set('awards', awd);
        
      });
    });
    
    //console.log(this.get('advStandingModel'));
    this.set('newAdv', false);
    this.set('newAwd', false);
    
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
    var self = this;
    
    Ember.$('.menu .item').tab({'onVisible':function(){
      self.set('studentProgramModel', self.get('store').peekAll('program-record'));
      //console.log('load');
      //console.log(self.get('studentProgramModel').objectAt(0).get('load'));
//      console.log(self.get('programRecordModel').get('length'));

      self.set('allowprograms', true);
      
    }});
  },
  loadRecord: function ()
  {
    //console.log('yo');
    
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
    chooseCourse(val)
    {
      console.log(val);
      this.set('chosenCourse', val);
    },
    /*********************************/
      selectTerm(val){
          this.set('newAdjTermName', val);
      },

      addAdjOption()
      {
          var note =this.get('newAdjTermName');
          var avg =this.$("#newAdjTerm").find('.avg').val();
          var ttu =this.$("#newAdjTerm").find('.ttu').val();
          var tup =this.$("#newAdjTerm").find('.tup').val();

          this.set("errAdjTerm", false);
            if(note=="")
            {
                this.$("#newAdjTerm").form('add prompt', 'term', 'error text');
                this.set("errAdjTerm", true);
            }
            else 
            {
                this.$("#newAdjTerm").form('remove prompt', 'term');
            }
            if(avg=="")
            {
                this.$("#newAdjTerm").form('add prompt', 'avg', 'error text');
                this.set("errAdjTerm", true);
            }
            else 
            {
                this.$("#newAdjTerm").form('remove prompt', 'avg');
            }
            if(ttu=="")
            {
                this.$("#newAdjTerm").form('add prompt', 'ttu', 'error text');
                this.set("errAdjTerm", true);
            }
            else 
            {
                this.$("#newAdjTerm").form('remove prompt', 'ttu');
            }

            if(tup=="")
            {
                this.$("#newAdjTerm").form('add prompt', 'tup', 'error text');
                this.set("errAdjTerm", true);
            }
            else 
            {
                this.$("#newAdjTerm").form('remove prompt', 'tup');
            }
            if(this.get('newCodeList').get('length')==0)
            {   
                this.$("#newAdjTerm").form('add prompt', 'listname', 'error text');
                this.set("errAdjTerm", true);
            }
            else 
            {
                this.$("#newProgram").form('remove prompt', 'listname');
            }
            if(!this.get('errAdjTerm'))
            {
                var date = new Date().toString();
                this.set('newAdjTerm', false);
                this.set("errAdjTerm", false);
                var record = this.get('store').createRecord('adjudication', {
                  date: date,
                  termAVG: avg,
                  termUnitPassed: tup,
                  termUnitTotal: ttu,
                  note: note,
                  student: this.get('currentStudent'),
                  assessmentCode: this.get('newCodeList'),
                });
                record.save();
            }

      },
      
      removeNewCode(index)
      {
          
          this.get('newCodeList').splice(index, 1);
          this.$("#newAdjTerm").find('.'+index).remove();
          
      },

      selectCode(index)
      {
          var repeat = false;
          for(var i =0;i<this.get('newCodeList').get('length');i++)
          {
              if(this.get('codeModel').objectAt(index).get('code') == this.get('newCodeList').objectAt(i).get('code'))
              {
                  repeat = true;
              }
          }
          if(!repeat){
            this.get('newCodeList').pushObject(this.get('codeModel').objectAt(index));
          }
      },

      newAdjTermClicked()
      {
          this.set('newAdjTerm', !(this.get('newAdjTerm')));
          this.set('errAdjTerm', false);
          this.set('newCodeList',[]);
          this.set('newAdjTermName', null);
      },

    removeAdjOption(index)
      {
          this.get('store').find('adjudication',this.get('adjudicationModel').objectAt(index).get('id')).then(function(record){
                record.deleteRecord();
                if(record.get('isDeleted'))
                {
                    record.save();
                }
                
          }, function (error){
              //console.log(error);
          });
      },

      updateAdjChoice(index)
      {
          var e = false;
          if (this.get('adjudicationModel').objectAt(index).get('assessmentCode').get('length')==0)
          {
              this.$("#adjs").find('.'+index).form('add prompt', 'list', 'error text');
              e=true;
          }
          else 
          {
              this.$("#adjs").find('.'+index).form('remove prompt', 'list');
          }
          if (!e)
          {
              var self=this;
              this.get('store').find('adjudication',this.get('adjudicationModel').objectAt(index).get('id')).then(function(record){
                record.save();
              });
          }
      },

      updateCode(index)
      {
          var choice = this.$("#adjs").find('.'+index).find('.selectedCode').val();
          var repeat= false;
          for (var i =0; i<this.get('adjudicationModel').objectAt(index).get('assessmentCode').get('length'); i++)
          {
              if (this.get('codeModel').objectAt(choice).get('code')==this.get('adjudicationModel').objectAt(index).get('assessmentCode').objectAt(i).get('code'))
              {
                  repeat=true;
              }
          }
          if (!repeat)
          {
              this.get('adjudicationModel').objectAt(index).get('assessmentCode').pushObject(this.get('codeModel').objectAt(choice));
          }
          
      },

      removeAssessmentCode(assessmentIndex, codeIndex)
      {
          this.get('adjudicationModel').objectAt(assessmentIndex).get('assessmentCode').removeAt(codeIndex);
      },
    /*********************************/
    
    updateHighSchoolSelection(val){
        this.set('currentHighSchool', val);
        this.set('optionNumber', 1);
        this.set('showList', true);
        this.set('showLevel', false);
        this.set('showUnits', false);
        this.set('showSubject', false);
    },

    updateHSGrade(val){
        this.set('newHSCourseGrade', val);
    },

    addCourseToRecord(idx){

        //console.log('adding....');
        var self = this;
        
        var myCourse = (this.get('highSchoolCourseModel')).objectAt(idx).get('id');

        var record = this.get('store').createRecord('highschool-grade', {
            grade: this.get('newHSCourseGrade'),
            course: (this.get('highSchoolCourseModel')).objectAt(idx),
            student: this.get('currentStudent')
        });
                   
        record.save();

        this.set('showAddCoursePage', false);
        this.set('showList', false);
        this.set('showLevel', false);
        this.set('showUnits', false);
        this.set('showSubject', false);
    },

    toggleHSCourseEdit()
    {
      if(this.get('USP01IsPermitted'))
      {
        this.set('enableHSCourseEdit', !(this.get('enableHSCourseEdit')));
      }
      else{
        Ember.$('.ui.save.modal').modal('show');
      }
      
      
    },

    removeHSGradeOption(index)
    {
      
      this.get('store').find('highschool-grade',this.get('highSchoolGradeModel').objectAt(index).get('id')).then(function(record){
              //console.log(record);
              record.deleteRecord();
              if(record.get('isDeleted'))
              {
                record.save();
              }
                
          }, function (error){
              //console.log(error);
          });
    },

    updateHSGradeSave(index)
    {
      var n = this.$("#hsgrade"+index).find('.hsgrade').val();
      //console.log('n: '+n);
      
      this.get('store').find('highschool-grade',this.get('highSchoolGradeModel').objectAt(index).get('id')).then(function(record){
          
          record.set('grade', n);
         
          record.save();
              
          });
    },
    removeProgram(termIndex, programIndex)
    {
      var self = this;
      this.get('store').find('program-record',this.get('programRecordModel').objectAt(programIndex).get('id')).then(function(record){
                record.deleteRecord();
                if(record.get('isDeleted'))
                {
                    record.save();
                    self.get('programRecordModel').removeAt(programIndex);
                }
                
          }, function (error){
              console.log(error);
          });
    },
    removeGrade(termIndex, gradeIndex)
    {
      var self = this;
      this.get('store').find('grade',this.get('gradeModel').objectAt(gradeIndex).get('id')).then(function(record){
                record.deleteRecord();
                if(record.get('isDeleted'))
                {
                    record.save();
                    self.get('gradeModel').removeAt(gradeIndex);
                }
                
          }, function (error){
             // console.log(error);
          });
    },
    updateSelectedGrade()
    {
      
      if(this.get('newGradeMark')=="")
      {
        this.$('#editGradeForm').form('add prompt', 'mark', 'error text');
      }
      else{
        
        this.$('#editGradeForm').form('remove prompt', 'mark');
        var self = this;
        this.get('store').find('grade',this.get('gradeModel').objectAt(this.get('newGradeIndex')).get('id')).then(function(record){
            record.set('mark', self.get('newGradeMark'));
            record.set('note', self.get('newGradeNote'))
            record.save();
            Ember.$('.ui.grade.modal').modal('hide');
            });
      }
    },
    updateSelectedProgram()
    {
      if (!(this.get('newProgramLevel')=="" || this.get('newProgramLoad')=="" || this.get('newProgramStatus')==""))
      {
        
        var temp = []
        for (let i =0; i< this.get('newProgramPlans').get('length'); i++)
        {
          
          for (let j =0; j< this.get('planCodeModel').get('length'); j++)
          {
            
            
            if (this.get('newProgramPlans').objectAt(i)==this.get('planCodeModel').objectAt(j).get('id'))
            {
              
              temp.pushObject(this.get('planCodeModel').objectAt(j));
            }
          }
        }
        var self = this;
        this.get('store').find('program-record',this.get('programRecordModel').objectAt(this.get('newProgramIndex')).get('id')).then(function(record){
            record.set('level', self.get('newProgramLevel'));
            record.set('load', self.get('newProgramLoad'));
            
            record.set('status', self.get('newProgramStatus'));
            
            record.set('plan', temp);
            
            record.save();
            Ember.$('.ui.program.modal').modal('hide');
            });
      }
    },
    cancelSave()
    {
      Ember.$('.ui.save.modal').modal('hide');
    },
    cancelUpdateGrade()
    {
      Ember.$('.ui.grade.modal').modal('hide');
    },
    updateTheGrade(termIndex, gradeIndex)
    {
     // console.log('w');
      this.set('newGradeMark', this.get('gradeModel').objectAt(gradeIndex).get('mark'));
      this.set('newGradeNote', this.get('gradeModel').objectAt(gradeIndex).get('note'));
      this.set('newGradeIndex', gradeIndex);
      this.set('newGradeCourse', this.get('gradeModel').objectAt(gradeIndex).get('course').get('courseLetter')+this.get('gradeModel').objectAt(gradeIndex).get('course').get('courseNumber'));
      Ember.$('.ui.grade.modal').modal('show');
    },
    selectNewPlans(things)
    {
      this.set('newProgramPlans', things);
      console.log(this.get('newProgramPlans'));
    },
    updateTheProgram(termIndex, gradeIndex)
    {
      
      
      this.set('newProgramLevel', this.get('programRecordModel').objectAt(gradeIndex).get('level'));
      this.set('newProgramLoad', this.get('programRecordModel').objectAt(gradeIndex).get('load'));
      this.set('newProgramStatus', this.get('programRecordModel').objectAt(gradeIndex).get('status'));
      this.set('newProgramPlans', []);
      for (var i =0; i<this.get('programRecordModel').objectAt(gradeIndex).get('plan').get('length'); i++)
      {
        this.get('newProgramPlans').push(this.get('programRecordModel').objectAt(gradeIndex).get('plan').objectAt(i).get('id'));
      }
      
      this.set('newProgramName', this.get('programRecordModel').objectAt(gradeIndex).get('name'));
      this.set('newProgramIndex', gradeIndex);
      Ember.$('.ui.program.modal').modal('show');
    },
    cancelUpdateProgram()
    {
      Ember.$('.ui.program.modal').modal('hide');
    },
    addGrade(index)
    {
      //console.log(this.$('#terms').find('.'+index).find('.mark').val());
      //console.log(this.$('#terms').find('.'+index).find('.note').val());
      //console.log(this.$('#terms').find('.'+index).find('.selectedCourse').val());
      var e = false;
      if(this.$('#terms').find('.'+index).find('.mark').val() == "")
      {
        e = true;
        this.$("#terms").find('.'+index).form('add prompt', 'mark', 'error text');
      }
      else 
      {
        this.$("#terms").find('.'+index).form('remove prompt', 'mark');
      }
      if(this.$('#terms').find('.'+index).find('.note').val() == "")
      {
        e = true;
        this.$("#terms").find('.'+index).form('add prompt', 'note', 'error text');
      }
      else 
      {
        this.$("#terms").find('.'+index).form('remove prompt', 'note');
      }
      if(this.get('chosenCourse') == null)
      {
        e = true;
        
      }
      
      if(!e)
      {
        var record = this.get('store').createRecord('grade', {
                mark: this.$('#terms').find('.'+index).find('.mark').val(),
                note: this.$('#terms').find('.'+index).find('.note').val(),
                term: this.get('termCodeModel').objectAt(index),
                course: this.get('courseCodeModel').objectAt(this.get('chosenCourse')),
                
                });
        var self =this;
        this.set('newGrade', !(this.get('newGrade')));
        record.save().then(() =>{
          self.set('gradeModel', []);
          for(var i =0; i <self.get('termCodeModel').get('length'); i++){
           self.get('store').query('grade',{term: self.get('termCodeModel').objectAt(i).get('id')}).then(function(grades){
            self.get('gradeModel').addObjects(grades);
           });
          }
        });
        
      }
    },
    addProgram(index)
    {
      var e = false;
      if(this.$('#terms').find('.'+index).find('.newProgram').find('.level').val()=="")
      {
        e = true;
        this.$("#terms").find('.'+index).find('.newProgram').form('add prompt', 'level', 'error text');
      }
      else 
      {
        this.$("#terms").find('.'+index).find('.newProgram').form('remove prompt', 'level');
      }
      if(this.$('#terms').find('.'+index).find('.newProgram').find('.load').val()=="")
      {
        e = true;
        this.$("#terms").find('.'+index).find('.newProgram').form('add prompt', 'load', 'error text');
      }
      else 
      {
        this.$("#terms").find('.'+index).find('.newProgram').form('remove prompt', 'load');
      }
      if(this.$('#terms').find('.'+index).find('.newProgram').find('.status').val()=="")
      {
        e = true;
        this.$("#terms").find('.'+index).find('.newProgram').form('add prompt', 'status', 'error text');
      }
      else 
      {
        this.$("#terms").find('.'+index).find('.newProgram').form('remove prompt', 'status');
      }
      if(this.$('#terms').find('.'+index).find('.newProgram').find('.selectedProgram').val()=="Select")
      {
        e = true;
        this.$("#terms").find('.'+index).find('.newProgram').form('add prompt', 'list', 'error text');
      }
      else 
      {
        this.$("#terms").find('.'+index).find('.newProgram').form('remove prompt', 'list');
      }
      if(!e)
      {
        var record = this.get('store').createRecord('programRecord', {
                name: this.get('programModel').objectAt(this.$('#terms').find('.'+index).find('.newProgram').find('.selectedProgram').val()),
                level: this.$('#terms').find('.'+index).find('.newProgram').find('.level').val(),
                load: this.$('#terms').find('.'+index).find('.newProgram').find('.load').val(),
                status: this.$('#terms').find('.'+index).find('.newProgram').find('.status').val(),
                semester: this.get('termCodeModel').objectAt(index),
                plan: [],
                
                });
        var self = this;
        this.set('newProg', !(this.get('newProg')));
        record.save().then(() =>{
          for(var i =0; i <self.get('termCodeModel').get('length'); i++){
           self.get('store').query('program-record',{term: self.get('termCodeModel').objectAt(i).get('id')}).then(function(programs){
            self.get('programRecordModel').addObjects(programs);
          });
          }
        });
      }
      
    },
    addTerm()
    {
      var e = false;
      if(this.$('#newTerm').find('.selectedSemester').val()=="Select")
      {
        e=true;
      }
      else 
      {
        for (var i =0; i<this.get('termCodeModel').get('length');i++)
        {
          if (this.get('termCodeModel').objectAt(i).get('name').get('name')==this.get('termModel').objectAt(this.$('#newTerm').find('.selectedSemester').val()).get('name'))
          {
            e=true;
          }
        }
      }
      if (!e) 
      {
        this.set('newStudentTerm', !(this.get('newStudentTerm')));
        var record = this.get('store').createRecord('termCode', {
                name: this.get('termModel').objectAt(this.$('#newTerm').find('.selectedSemester').val()),
                program: [],
                marks: [],
                student: this.get('currentStudent'),
                });
        var self = this;
        
        record.save().then(() =>{
        
          self.get('store').query('termCode',{student: self.get('currentStudent').get('id')}).then(function(terms){
          self.set('termCodeModel', terms);
          });
        });
      }

    
    },
    selectPlan(i)
    {

    },
    toggleAdvEdit ()
    {
      if(this.get('USP01IsPermitted'))
      {
        this.set('enableAdvEdit', !(this.get('enableAdvEdit')));
      }
      else{
        Ember.$('.ui.save.modal').modal('show');
      }
      
    },
    toggleAwdEdit()
    {
      if(this.get('USP01IsPermitted'))
      {
        this.set('enableAwdEdit', !(this.get('enableAwdEdit')));
      }
      else{
        Ember.$('.ui.save.modal').modal('show');
      }
      
    },
    toggleGradeEdit()
    {
      var self = this;
      // this.get('store').query('student',{department: "58d2a553a3ddd62848d60587"}).then(function(grades){
      //           console.log(grades.get('length'));
      //           self.get('store').query('student',{program: self.get('programModel').objectAt(0).get('id')}).then(function(grades2){
      //           console.log(grades2.get('length'));
      //      });
      //      });
      if(this.get('USP01IsPermitted'))
      {
        this.set('enableGradeEdit', !(this.get('enableGradeEdit')));
      }
      else{
        Ember.$('.ui.save.modal').modal('show');
      }
      
    },
    newProgClicked(index)
    {
      this.set('newProg', !(this.get('newProg')));
      if((this.get('newProg'))){
       var offset = this.$("#terms").find('.'+index).find('#scrollTo').offset();
                    
                  offset.left -=20;
                  offset.top -=20;
                  $('html, body').animate({
                        scrollTop: offset.top,
                        scrollLeft: offset.left
                    });
    }
    },
    newGradeClicked(index)
    {
      this.set('newGrade', !(this.get('newGrade')));
      this.set('chosenCourse', null);
      if((this.get('newGrade'))){
       var offset = this.$("#terms").find('.'+index).find('#termPrograms').offset();
                    
                  offset.left -=20;
                  offset.top -=20;
                  $('html, body').animate({
                        scrollTop: offset.top,
                        scrollLeft: offset.left
                    });
    }
    },
    newStudentTermClicked()
    {
      this.set('newStudentTerm', !(this.get('newStudentTerm')));
    },
    removeAdvOption(index)
    {
      
      this.get('store').find('advStanding',this.get('advStandingModel').objectAt(index).get('id')).then(function(record){
                record.deleteRecord();
                if(record.get('isDeleted'))
                {
                    record.save();
                }
                
          }, function (error){
            //  console.log(error);
          });
    },
    removeAwdOption(index)
    {
      
      this.get('store').find('award',this.get('awards').objectAt(index).get('id')).then(function(record){
                record.deleteRecord();
                if(record.get('isDeleted'))
                {
                    record.save();
                }
                
          }, function (error){
          //    console.log(error);
          });
    },
    updateAwdChoice(index)
    {
      var n = this.$("#award").find('.'+index).find('.note').val();
      if (n=="")
      {
        this.$("#award").find('.'+index).find('.note').val(this.get('awards').objectAt(index).get('note'));
      }
      else 
      {
        this.get('store').find('award',this.get('awards').objectAt(index).get('id')).then(function(record){
            record.set('note', n);
            
            record.save();
                
            });
      }
    },
    updateAdvChoice(index)
    {
      
      var c = this.$("#advStanding").find('.'+index).find('.course').val();
      var g = this.$("#advStanding").find('.'+index).find('.grade').val();
      var f = this.$("#advStanding").find('.'+index).find('.from').val();
      var u = this.$("#advStanding").find('.'+index).find('.unit').val();
      var d = this.$("#advStanding").find('.'+index).find('.description').val();
      var e = 0;
      if(c=="")
      {
        this.$('#advStanding').find('.'+index).find('.course').val(this.get('advStandingModel').objectAt(index).get('course'));
        c = this.get('advStandingModel').objectAt(index).get('course');
        
        e++;
      }
      if(g=="")
      {
        this.$('#advStanding').find('.'+index).find('.grade').val(this.get('advStandingModel').objectAt(index).get('grade'));
        g = this.get('advStandingModel').objectAt(index).get('grade');
        e++;
      }
      if(f=="")
      {
        this.$('#advStanding').find('.'+index).find('.from').val(this.get('advStandingModel').objectAt(index).get('from'));
        f = this.get('advStandingModel').objectAt(index).get('from');
        e++;
      }
      if(u=="")
      {
        this.$('#advStanding').find('.'+index).find('.unit').val(this.get('advStandingModel').objectAt(index).get('unit'));
        u = this.get('advStandingModel').objectAt(index).get('unit');
        e++;
      }
      if (e< 4)
        {
          
            this.get('store').find('advStanding',this.get('advStandingModel').objectAt(index).get('id')).then(function(record){
            record.set('course', c);
            record.set('grade', g);
            record.set('from', f);
            record.set('unit', u);
            record.set('description', d);
            record.save();
                
            });
        }
      
    },
    saveStudent () {
      if(this.get('USP01IsPermitted'))
      {
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
      }
      else{
        //console.log('here');
        Ember.$('.ui.save.modal').modal('show');
      }
      
    },

    firstStudent() {
      this.resetUndo();
      this.set('currentIndex', this.get('firstIndex'));
      
    },
    newAdvClicked()
    {
      this.set('newAdv', !(this.get('newAdv')));
      this.set('err', false);
    },
    newAwdClicked()
    {
      this.set('newAwd', !(this.get('newAwd')));
    },
    nextStudent() {
      this.resetUndo();
      this.set('movingBackword' , false);
       if (this.get('currentIndex') < this.get('lastIndex')) {
         this.set('currentIndex', this.get('currentIndex') + 1);
          
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

    showAddCourse(){
      if(this.get('showAddCoursePage')){
        this.set('showAddCoursePage', false);
        this.set('showList', false);
        this.set('showLevel', false);
        this.set('showUnits', false);
        this.set('showSubject', false);
      } else {
        this.set('showAddCoursePage', true);
      }
    },

    editNumber(num){
        this.get('undoRecords').push("num");
        this.get('undoNumber').push(this.get('currentStudent').get('number'));
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
    addAward(){
      if(this.get('note') != "")
      {
        var student = this.get('currentStudent');
       // console.log(student.get('id'));
        var award =this.get('store').createRecord('award', {

          note: this.get('note'),
          student: this.get('currentStudent'),
        });
        var self=this;
        this.set('newAwd', false);
        award.save().then(() => {
          
          
          self.get('store').query('award',{student: this.get('currentStudent').get('id')}).then(function(awd){
            self.set('awards', awd);
          });
          //console.log(self.get('currentStudent').get('advStanding'));
          //self.set('advStandingModel',student.get('advStanding'));
          
        });
      }
      
    },
    addcredit(){
      this.set("err", false);
      if(this.get('course')=="")
      {
        this.$("#newAdv").form('add prompt', 'course', 'error text');
            this.set("err", true);
      }
      else 
      {
          this.$("#newAdv").form('remove prompt', 'course');
      }
      if(this.get('unit')=="")
      {
        this.$("#newAdv").form('add prompt', 'unit', 'error text');
            this.set("err", true);
      }
      else 
      {
          this.$("#newAdv").form('remove prompt', 'unit');
      }
      if(this.get('grade')=="")
      {
        this.$("#newAdv").form('add prompt', 'grade', 'error text');
            this.set("err", true);
      }
      else 
      {
          this.$("#newAdv").form('remove prompt', 'grade');
      }
      if(this.get('from')=="")
      {
        this.$("#newAdv").form('add prompt', 'from', 'error text');
            this.set("err", true);
      }
      else 
      {
          this.$("#newAdv").form('remove prompt', 'from');
      }
      if (!this.get("err"))
      {
        var student = this.get('currentStudent');
        
        var standing =this.get('store').createRecord('adv-Standing', {

          course: this.get('course'),
          description: this.get('description'),
          unit: this.get('unit'),
          grade: this.get('grade'),
          from: this.get('from'),
          students: this.get('currentStudent'),
        });
       // console.log(this.get('currentStudent'));
        var self=this;
        this.set('newAdv', false);
        standing.save().then(() => {
          //console.log(student.get('advStanding').objectAt(0).get('course'));
          
          self.get('store').query('advStanding',{student: this.get('currentStudent').get('id')}).then(function(adv){
            self.set('advStandingModel', adv);
          });
          //console.log(self.get('currentStudent').get('advStanding'));
          //self.set('advStandingModel',student.get('advStanding'));
          
        });
      }
    },
    updateNote(noted){
      this.set('note',noted);
    },

    updateCourse(courseName){
      this.set('course',courseName);
    },
    updateDescription(descText){
      this.set('description',descText);
    },
    updateGrade(gradeValue){
      this.set('grade',gradeValue);
    },
    updateUnit(unitValue){
      this.set('unit',unitValue);
    },
    updateFrom(fromText){
      this.set('from',fromText);
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
        if(this.get('USP01IsPermitted'))
      {
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
      }
      else{
        Ember.$('.ui.save.modal').modal('show');
      }
        

      },

      
    }
});
