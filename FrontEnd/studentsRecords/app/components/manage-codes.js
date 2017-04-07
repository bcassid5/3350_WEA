import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service(),
    residencyModel: null,
    genderModel: null,
    termModel: null,
    planModel: null,
    courseModel: null,
    programModel: null,
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
    newTermChoice: null,
    newPlanChoice: null,
    newCourse: null,
    newProgram: null,
    err: null,
    errProgram:null,
    newPlanList: null,

    /**********/
    newFacultyChoice: null,
    facultyModel: null,
    newDept: null,
    newDeptFaculty: null,
    newDeptName: null,
    departmentModel: null,

    newProgDepartment: null,

    newProgAdminName: null,
    newProgAdminPosition: null,
    newProgAdminDept: null,
    progAdminModel: null,

    /***************/
    logExpModel: null,
    newLogExpValue: null,
    newLogExpOpr: null,
    newLogExpParam: null,

    ruleModel: null,
    newRule: null,
    errRule: null,
    newRuleList: null,

    codeModel: null,
    newCode: null,
    errCode: null,
    newCodeList: null,

    MSC02IsPermitted: Ember.computed(function(){ //Manage system roles
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("MSC02") >= 0);
    }
  }),
    MACC1IsPermitted: Ember.computed(function(){ //Manage system roles
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("MACC1") >= 0);
    }
  }),
    MAR02IsPermitted: Ember.computed(function(){ //Manage system roles
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("MAR02") >= 0);
    }
  }),
    init() {
        this._super(...arguments);
        this.newResChoice="";
        this.newGenderChoice="";
        this.newTermChoice="";
        this.newPlanChoice="";
        this.newCourse=false;
        this.newProgram=false;
        this.newCode=false;
        this.newRule=false;
        this.newDept=false;
        this.newDeptFaculty=null;
        this.err = false;
        this.errProgram = false;
        this.errCode=false;
        this.errRule=false;
        var self = this;
        this.newPlanList = [];
        this.newCodeList=[];
        this.newRuleList=[];
        this.newProgDepartment = "";
        this.newProgAdminName="";
        this.newDeptName="";
        this.newProgAdminPosition="";
        this.newCourseHighSchool=null;
        this.newProgAdminDept=null;

        
        this.get('store').findAll('residency').then(function (records) {
            self.set('residencyModel', records);
        });
        this.get('store').findAll('gender').then(function (records) {
           self.set('genderModel', records);
        });
        

        this.get('store').findAll('highschool-subject').then(function(records){
            self.set('highSchoolSubjectModel', records);
            self.get('store').findAll('highSchool').then(function(records3){
            self.set('highSchoolModel', records3);
            self.get('store').findAll('high-school-course').then(function(records2){
            self.set('highSchoolCourseModel', records2);
            });
        });
        });

        

        
        this.get('store').findAll('schoolTerm').then(function (records) {
           self.set('termModel', records);
        });
        this.get('store').findAll('planCode').then(function (records) {
           self.set('planModel', records);
        });
        this.get('store').findAll('courseCode').then(function (records) {
           self.set('courseModel', records);
        });
        
        

        /****************/
        this.get('store').findAll('faculty').then(function(records){
            self.set('facultyModel', records);
        });
        this.get('store').findAll('department').then(function(records){
            self.set('departmentModel', records);
            
        });
        this.get('store').findAll('progAdmin').then(function(records){
            self.set('progAdminModel', records);
        });

        this.get('store').findAll('program').then(function (records) {
           self.set('programModel', records);
        });

        /*************/
        this.get('store').findAll('logExpress').then(function(records){
            self.set('logExpModel', records);
        });

        this.get('store').findAll('rule').then(function(records){
            self.set('ruleModel', records);
        });

        this.get('store').findAll('assessmentCode').then(function(records){
            self.set('codeModel', records);
        });

    },

    didRender(){
    Ember.$('.menu .item').tab();
  },

  actions: {
      selectDepartment(val){
          var dept = this.get('store').peekRecord('department', val);
          this.set('newProgDepartment',dept);
          //console.log(dept);
          //console.log(this.get('newProgDepartment'));
      },
      updatePlan(index)
      {
          var choice = this.$("#programs").find('.'+index).find('.selectedPlan').val();
          var repeat= false;
          for (var i =0; i<this.get('programModel').objectAt(index).get('availablePlans').get('length'); i++)
          {
              if (this.get('planModel').objectAt(choice).get('name')==this.get('programModel').objectAt(index).get('availablePlans').objectAt(i).get('name'))
              {
                  //console.log("repeat");
                  repeat=true;
              }
          }
          if (!repeat)
          {
              this.get('programModel').objectAt(index).get('availablePlans').pushObject(this.get('planModel').objectAt(choice));
          }
          
      },
      removeNewPlan(index)
      {
          
          this.get('newPlanList').splice(index, 1);
          this.$("#newProgram").find('.'+index).remove();
          
      },
      removeProgramPlan(programIndex, planIndex)
      {
         // console.log(programIndex);
          //console.log(planIndex);
          this.get('programModel').objectAt(programIndex).get('availablePlans').removeAt(planIndex);
      },
      selectPlan(index)
      {
          var repeat = false;
          for(var i =0;i<this.get('newPlanList').get('length');i++)
          {
              if(this.get('planModel').objectAt(index).get('name') == this.get('newPlanList').objectAt(i).get('name'))
              {
                  repeat = true;
              }
          }
          if(!repeat){
            this.get('newPlanList').pushObject(this.get('planModel').objectAt(index));
            //console.log(this.get('newPlanList'));
          }
      },
      newCourseClicked()
      {
          this.set('newCourse', !(this.get('newCourse')));
          this.set('err', false);
      },
      newProgramClicked()
      {
          this.set('newProgram', !(this.get('newProgram')));
          this.set('errProgram', false);
          this.set('newPlanList',[]);
          
      },
      removeStudentOption(index){
          
          //this.get('residencyModel').removeAt(index);
          this.get('store').find('residency',this.get('residencyModel').objectAt(index).get('id')).then(function(record){
                record.deleteRecord();
                if(record.get('isDeleted'))
                {
                    record.save();
                }
                
          }, function (error){
             // console.log(error);
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
      removeProgramOption(index)
      {
          this.get('store').find('program',this.get('programModel').objectAt(index).get('id')).then(function(record){
                record.deleteRecord();
                if(record.get('isDeleted'))
                {
                    record.save();
                }
                
          }, function (error){
              //console.log(error);
          });
      },
      addProgramOption()
      {
          var n =this.$("#newProgram").find('.name').val();
          
          this.set("errProgram", false);
            if(n=="")
            {
                this.$("#newProgram").form('add prompt', 'name', 'error text');
                this.set("errProgram", true);
            }
            else 
            {
                this.$("#newProgram").form('remove prompt', 'name');
            }
            if(this.get('newPlanList').get('length')==0)
            {   
                this.$("#newProgram").form('add prompt', 'listname', 'error text');
                this.set("errProgram", true);
            }
            else 
            {
                this.$("#newProgram").form('remove prompt', 'listname');
            }
            if(!this.get('errProgram'))
            {
                
                this.set('newProgram', false);
                this.set("errProgram", false);
                var record = this.get('store').createRecord('program', {
                name: n,
                availablePlans: this.get('newPlanList'),
                department: this.get('newProgDepartment'),
            });
           // console.log(record);
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
              //console.log(error);
          });
          //console.log(index);
      },
      addGenderOption(){
        if (this.get('newGenderChoice')!==""){
            var record = this.get('store').createRecord('gender', {
                type: this.get('newGenderChoice'),
                students: []
            });
            //console.log(record.get('type'));
            record.save();
        }
      },
      removeTermOption(index)
      {
        this.get('store').find('schoolTerm',this.get('termModel').objectAt(index).get('id')).then(function(record){
                record.deleteRecord();
                if(record.get('isDeleted'))
                {
                    record.save();
                }
                
          }, function (error){
              //console.log(error);
          });
      },
      addTermOption()
      {
          if (this.get('newTermChoice')!==""){
            var record = this.get('store').createRecord('schoolTerm', {
                name: this.get('newTermChoice'),
                terms: []
            });
            record.save();
        }
      },
      removePlanOption(index)
      {
        this.get('store').find('planCode',this.get('planModel').objectAt(index).get('id')).then(function(record){
                record.deleteRecord();
                if(record.get('isDeleted'))
                {
                    record.save();
                }
                
          }, function (error){
              //console.log(error);
          });
      },
      addPlanOption()
      {
          if (this.get('newPlanChoice')!==""){
            var record = this.get('store').createRecord('planCode', {
                name: this.get('newPlanChoice'),
                programRecords: []
            });
            record.save();
        }
      },
      removeCourseOption(index)
      {
          this.get('store').find('courseCode',this.get('courseModel').objectAt(index).get('id')).then(function(record){
                record.deleteRecord();
                if(record.get('isDeleted'))
                {
                    record.save();
                }
                
          }, function (error){
             // console.log(error);
          });
      },
      addCoursesOption()
      {
          //console.log("Here");
        var l =this.$("#newCourse").find('.letter').val();
        var n = this.$("#newCourse").find('.number').val();
        var u =this.$("#newCourse").find('.unit').val();
        var Nname =this.$("#newCourse").find('.name').val();
       // console.log(l + " " + n + " " + u + " " + Nname);
        this.set("err", false);
        if(l=="")
        {
            this.$("#newCourse").form('add prompt', 'letter', 'error text');
            this.set("err", true);
        }
        else {
            this.$("#newCourse").form('remove prompt', 'letter');
        }
        if (n =="")
        {
            this.$("#newCourse").form('add prompt', 'number', 'error text');
            this.set("err", true);
        }
        else {
            this.$("#newCourse").form('remove prompt', 'number');
        }
        if (u=="")
        {
            this.$("#newCourse").form('add prompt', 'unit', 'error text');
            this.set("err", true);
        }
        else {
            this.$("#newCourse").form('remove prompt', 'unit');
        }
        if (Nname=="")
        {
            this.$("#newCourse").form('add prompt', 'name', 'error text');
            this.set("err", true);
        }
        else {
            this.$("#newCourse").form('remove prompt', 'name');
        }
        if (!this.get("err"))
        {
            this.set('newCourse', false);
            this.set("err", false);
            var record = this.get('store').createRecord('courseCode', {
                courseLetter: l,
                courseNumber: n,
                name: Nname,
                unit: u,
                marks: [],
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
      updateTermChoice(val)
      {
        this.set('newTermChoice',val);
      },
      updatePlanChoice(val)
      {
          this.set('newPlanChoice',val);
      },
      
      updateProgramChoice(index)
      {
          console.log(this.$("#programChoice").find('.'+index).find('.selectedDepartment').val());
          var e = false;
          if(this.get('programModel').objectAt(index).get('name')=="")
          {
              this.$("#programs").find('.'+index).form('add prompt', 'name', 'error text');
              e=true;
          }
          else 
          {
              this.$("#programs").find('.'+index).form('remove prompt', 'name');
          }
          if (this.get('programModel').objectAt(index).get('availablePlans').get('length')==0)
          {
              this.$("#programs").find('.'+index).form('add prompt', 'list', 'error text');
              e=true;
          }
          else 
          {
              this.$("#programs").find('.'+index).form('remove prompt', 'list');
          }
          if (!e)
          {
              var self=this;
              this.get('store').find('program',this.get('programModel').objectAt(index).get('id')).then(function(record){
            
            record.set('department', self.get('departmentModel').objectAt(self.$("#programChoice").find('.'+index).find('.selectedDepartment').val()));
            record.save();
                
            });
              //this.set(this.get('programModel').objectAt(index).get('department'), this.$("#programChoice").find('.'+index).find('.selectedDepartment').val());
              //this.get('programModel').objectAt(index).save();
          }
      },
      updateCourseChoice(index)
      {
          var lett = this.$('#courseCodes').find('.'+index).find('.letter').val();
          var num = this.$('#courseCodes').find('.'+index).find('.number').val();
          var name = this.$('#courseCodes').find('.'+index).find('.name').val();
          var unit = this.$('#courseCodes').find('.'+index).find('.unit').val();
          var e = 0;
          if(lett=="")
          {
              e++;
              this.$('#courseCodes').find('.'+index).find('.letter').val(this.get('courseModel').objectAt(index).get('courseLetter'));
              lett = this.get('courseModel').objectAt(index).get('courseLetter');
          }
          if(num=="")
          {
              e++;
              this.$('#courseCodes').find('.'+index).find('.number').val(this.get('courseModel').objectAt(index).get('courseNumber'));
              num = this.get('courseModel').objectAt(index).get('courseNumber');
          }
          if(name=="")
          {
              e++;
              this.$('#courseCodes').find('.'+index).find('.name').val(this.get('courseModel').objectAt(index).get('name'));
              name = this.get('courseModel').objectAt(index).get('name');
          }
          if(unit=="")
          {
              e++;
              this.$('#courseCodes').find('.'+index).find('.unit').val(this.get('courseModel').objectAt(index).get('unit'));
              unit = this.get('courseModel').objectAt(index).get('unit');
          }
          if (e!= 4)
          {
              this.get('store').find('courseCode',this.get('courseModel').objectAt(index).get('id')).then(function(record){
            record.set('name', name);
            record.set('courseLetter', lett);
            record.set('courseNumber', num);
            record.set('unit', unit);
            record.save();
                
            });
          }
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
      changeTermName(index)
      {
          var self = this;
          
          if((this.$("#termCodes").find('.'+index)).val()!== "")
          {
            this.get('store').find('schoolTerm', this.get('termModel').objectAt(index).get('id')).then(function(record){
            
            record.set('name', (self.$("#termCodes").find('.'+index)).val());
            record.save();
                
            });
          }
      },
      changePlanName(index)
      {
          var self = this;
          
          if((this.$("#planCodes").find('.'+index)).val()!== "")
          {
            this.get('store').find('planCode', this.get('planModel').objectAt(index).get('id')).then(function(record){
            
            record.set('name', (self.$("#planCodes").find('.'+index)).val());
            record.save();
                
            });
          }
      },
      findClicked()
      {
          
          var searchVal = this.$("#find5").find('.searchVal').val().toLowerCase();
          
         // console.log(this.get('courseModel').get('length'));
          for (var i=0; i<this.get('courseModel').get('length'); i++)
          {
              if(this.get('courseModel').objectAt(i).get('courseNumber').toLowerCase() == searchVal)
              {
                 console.log(this.$("#courseCodes").find('.'+i).offset());
                  var offset = this.$("#courseCodes").find('.'+i).offset();
                  offset.left -=20;
                  offset.top -=20;
                  $('html, body').animate({
                        scrollTop: offset.top,
                        scrollLeft: offset.left
                    });
                    break;
              }
          }
      },
      findProgramClicked()
      {
          var searchVal = this.$('.programSearchVal').val().toLowerCase();
          
         // console.log(this.get('courseModel').get('length'));
          for (var i=0; i<this.get('courseModel').get('length'); i++)
          {
              if(this.get('programModel').objectAt(i).get('name').toLowerCase() == searchVal)
              {
                 
                  var offset = this.$("#programChoice").find('.'+i).offset();
                  offset.left -=20;
                  offset.top -=20;
                  $('html, body').animate({
                        scrollTop: offset.top,
                        scrollLeft: offset.left
                    });
                    break;
              }
          }
      },
      findPlanClicked()
      {
          var searchVal = this.$('.planSearchVal').val().toLowerCase();
          
         // console.log(this.get('courseModel').get('length'));
          for (var i=0; i<this.get('planModel').get('length'); i++)
          {
              if(this.get('planModel').objectAt(i).get('name').toLowerCase() == searchVal)
              {
                 
                  var offset = this.$("#planCodes").find('.'+i).offset();
                  offset.left -=20;
                  offset.top -=20;
                  $('html, body').animate({
                        scrollTop: offset.top,
                        scrollLeft: offset.left
                    });
                    break;
              }
          }
      },
      findSubjectClicked()
      {
          var searchVal = this.$('.subjectSearchVal').val().toLowerCase();
          
         // console.log(this.get('courseModel').get('length'));
          for (var i=0; i<this.get('highSchoolSubjectModel').get('length'); i++)
          {
              if(this.get('highSchoolSubjectModel').objectAt(i).get('name').toLowerCase() == searchVal)
              {
                 
                  var offset = this.$("#hsSubjects").find('.'+i).offset();
                  offset.left -=20;
                  offset.top -=20;
                  $('html, body').animate({
                        scrollTop: offset.top,
                        scrollLeft: offset.left
                    });
                    break;
              }
          }
      },
      findHSClicked()
      {
          var searchVal = this.$('.hsSearchVal').val().toLowerCase();
          
         // console.log(this.get('courseModel').get('length'));
          for (var i=0; i<this.get('highSchoolModel').get('length'); i++)
          {
              if(this.get('highSchoolModel').objectAt(i).get('name').toLowerCase() == searchVal)
              {
                 
                  var offset = this.$("#highschoolsmod").find('.'+i).offset();
                  offset.left -=20;
                  offset.top -=20;
                  $('html, body').animate({
                        scrollTop: offset.top,
                        scrollLeft: offset.left
                    });
                    break;
              }
          }
      },
      findCourseClicked()
      { 
          
          var searchVal = this.$('.courseSearchVal').val().toLowerCase();
          var searchVal2 = this.$('.courseSearchVal2').val().toLowerCase();
          
          
          //console.log(xc[0].get('subject'));
         // console.log(this.get('courseModel').get('length'));
          for (var i=0; i<this.get('highSchoolCourseModel').get('length'); i++)
          {
              
              if (searchVal == "")
              {
                if (this.get('highSchoolCourseModel').objectAt(i).get('subject').get('name').toLowerCase()==searchVal2)
                {
                    var offset = this.$("#hsCourses").find('.'+i).offset();
                    
                  offset.left -=20;
                  offset.top -=20;
                  $('html, body').animate({
                        scrollTop: offset.top,
                        scrollLeft: offset.left
                    });
                    break;
                }
              }
              else if (searchVal2 == "")
              {
                if (this.get('highSchoolCourseModel').objectAt(i).get('highschool').get('name').toLowerCase()==searchVal)
                {
                    var offset = this.$("#hsCourses").find('.'+i).offset();
                    console.log(this.get('highSchoolCourseModel').objectAt(i).get('highschool').get('name').toLowerCase());
                  offset.left -=20;
                  offset.top -=20;
                  $('html, body').animate({
                        scrollTop: offset.top,
                        scrollLeft: offset.left
                    });
                    break;
                }
              }
              else 
              {
                if (this.get('highSchoolCourseModel').objectAt(i).get('highschool').get('name').toLowerCase()==searchVal && 
                this.get('highSchoolCourseModel').objectAt(i).get('subject').get('name').toLowerCase()==searchVal2) 
                {
                    console.log(this.get('highSchoolCourseModel').objectAt(i).get('highschool').get('name').toLowerCase());
                    console.log(this.get('highSchoolCourseModel').objectAt(i).get('subject').get('name').toLowerCase());
                    var offset = this.$("#hsCourses").find('.'+i).offset();
                  offset.left -=20;
                  offset.top -=20;
                  $('html, body').animate({
                        scrollTop: offset.top,
                        scrollLeft: offset.left
                    });
                    break;
                }
              }
              
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
             // console.log(error);
          });
          //console.log(index);
      },

      changeSubjectName(index)
      {
          //console.log("changeSubjectName called");
          var self = this;
        if((this.$('.' + index)).val()!== ""){
            //console.log(index);
            //console.log('hello   '+(this.$('.'+index)).val());
            //console.log('hellox2   '+(self.$('.'+index)).val());
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
         // console.log("changeSubjectDescription called");
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
        if ((this.get('newSubjectName')!=="")&&(this.get('newSubjectDescription')!=="")&&(this.get('newSubjectName')!==null)&&(this.get('newSubjectDescription')!==null)){
            var record = this.get('store').createRecord('highschool-subject', {
                name: this.get('newSubjectName'),
                description: this.get('newSubjectDescription'),
                course: []
            });
            //console.log(record);
            record.save();
        }
      },

       changeHighSchoolName(index)
      {
         //console.log('Change HS Name called');
          var self = this;
          //console.log(index);
        if((this.$('#' + index)).val()!== ""){
            this.get('store').findRecord('highSchool', index).then(function(record){
               // console.log(record);
                record.set('name', (self.$('.' + index)).val());
                record.data.name= (self.$('.' + index)).val();
               // console.log(self.$('.'+ index).val());
                //console.log(record.get('name'));
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
              //console.log(error);
          });
          //console.log(index);
      },

      updateHighSchoolName(val)
      {
        this.set('newHighSchoolName',val);
      },

      addHighSchoolOption(){
        if ((this.get('newHighSchoolName')!=="")&&(this.get('newHighSchoolName')!==null)){
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
        if((this.$('.level' + index)).val()!== ""){
            this.get('store').find('high-school-course', this.get('highSchoolCourseModel').objectAt(index).get('id')).then(function(record){
            record.set('level', (self.$('.level' + index)).val());
            record.save();
                
          });
        }
      },

      changeCourseSource(index)
      {
          var self = this;
        if((this.$('.source' + index)).val()!== ""){
            this.get('store').find('high-school-course', this.get('highSchoolCourseModel').objectAt(index).get('id')).then(function(record){
            record.set('source', (self.$('.source' + index)).val());
            record.save();
                
          });
        }
      },

      changeCourseUnit(indexHS)
      {
          var self = this;
        if((this.$('.unit' + indexHS)).val()!== ""){
            var toFind = "unit"+indexHS;
            this.get('store').find('high-school-course', this.get('highSchoolCourseModel').objectAt(indexHS).get('id')).then(function(record){
            record.set('unit', (self.$('.unit'+indexHS)).val());
            record.save();
                
          });
        }
      },
      changeCourseSchool(index){
        var self = this;
        var hs = this.get('store').peekRecord('high-school', self.$(".hs"+index).val());
        //console.log(hs);
        //console.log(self.$(".hs"+index).val());
        this.get('store').find('high-school-course', this.get('highSchoolCourseModel').objectAt(index).get('id')).then(function(record){
         //  console.log(record);
           record.set('highschool', hs);
           //console.log(record);
           record.save();
        });
      },

      removeHSCourseOption(index){
          var self=this;
          
        self.get('store').find('high-school-course',self.get('highSchoolCourseModel').objectAt(index).get('id')).then(function(record){
                record.deleteRecord();
                if(record.get('isDeleted'))
                {
                    record.save();
                }
                
          }, function (error){
              //console.log(error);
          });
          //console.log(index);
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
       // console.log("Subject" + val);
        //console.log("CourseSubject" +  this.get('newCourseSubject'));
      },

      updateCourseHighSchool(val)
      {
        var hs = this.get('store').peekRecord('high-school', val);
        this.set('newCourseHighSchool', hs);
        //console.log("HS" + val);
        //console.log("CourseHS" +  this.get('newCourseHighSchool'));
      },

      addCourseOption(){
        if ((this.get('newCourseHighSchoolName')!=="")&&(this.get('newCourseHighSchool')!=null)
        &&(this.get('newCourseSubject')!=null)&&(this.get('newCourseSubject')!=="")
        &&(this.get('newCourseLevel')!==null)&&(this.get('newCourseLevel')!=="")
        &&(this.get('newCourseSource')!==null)&&(this.get('newCourseSource')!=="")
        &&(this.get('newCourseUnit')!==null)&&(this.get('newCourseUnit')!=="")){
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
      },

/*******************************************************************************/

    updateFacultyChoice(val)
      {
        this.set('newFacultyChoice',val);
      },

      addFacultyOption(){
        if (this.get('newFacultyChoice')!==""&&(this.get('newFacultyChoice')!==null)){
            var record = this.get('store').createRecord('faculty', {
                name: this.get('newFacultyChoice'),
                department: []
            });
            //console.log(record.get('name'));
            record.save();
        }
      },

      changeFacultyName(index)
      {
          var self = this;
        if((this.$('.' + index)).val()!== ""){
            this.get('store').find('gender', this.get('genderModel').objectAt(index).get('id')).then(function(record){
            record.set('type', (self.$('.' + index)).val());
            record.save();
                
          });
        }
      },
      removeFacultyOption(index){
       this.get('store').find('faculty',this.get('facultyModel').objectAt(index).get('id')).then(function(record){
                record.deleteRecord();
                if(record.get('isDeleted'))
                {
                    record.save();
                }
                
          }, function (error){
              //console.log(error);
          });
          //console.log(index);
      },

      /***************/

      newDepartmentClicked()
      {
          this.set('newDept', !(this.get('newDept')));         
      },

      updateDeptFaculty(val)
      {
        var sub = this.get('store').peekRecord('faculty', val);
        this.set('newDeptFaculty', sub);
      },

      addDeptOption(){
        if (this.get('newDeptName')!=="" && this.get('newDeptFaculty')!=null){
            var record = this.get('store').createRecord('department', {
                name: this.get('newDeptName'),
                faculty: this.get('newDeptFaculty'),
                progAdmin: []
            });
            record.save();
        }
      },
      updateDeptName(val)
      {
        this.set('newDeptName',val);
      },
      changeDeptName(index)
      {
          var self = this;
        if((this.$('.name' + index)).val()!== ""){
            this.get('store').find('department', this.get('departmentModel').objectAt(index).get('id')).then(function(record){
            record.set('name', (self.$('.name' + index)).val());
            record.save();
                
          });
        }
      },

      changeDeptFaculty(val)
      {
          /*************HOW DO WE USE THIS FUNCTION TO SAVE....**********/
        var sub = this.get('store').peekRecord('faculty', val);
        this.set('newDeptFaculty', sub);
      },

      removeDeptOption(index){
       this.get('store').find('department',this.get('departmentModel').objectAt(index).get('id')).then(function(record){
           //console.log(record);
                record.deleteRecord();
                if(record.get('isDeleted'))
                {
                    //console.log("deleted");
                    record.save();
                }
                
          }, function (error){
              //console.log(error);
          });
      },

      /*********************/
      updateProgAdminName(val)
      {
        this.set('newProgAdminName',val);
      },

      updateProgAdminPosition(val)
      {
        this.set('newProgAdminPosition',val);
      },

      updateProgAdminDept(val)
      {
        var sub = this.get('store').peekRecord('department', val);
        this.set('newProgAdminDept', sub);
      },

      addProgAdminOption(){
        if (this.get('newProgAdminName')!==""&&this.get('newProgAdminPosition')!="" && this.get('newProgAdminDept')!=null){
            var record = this.get('store').createRecord('progAdmin', {
                name: this.get('newProgAdminName'),
                position: this.get('newProgAdminPosition'),
                department: this.get('newProgAdminDept')
            });
            record.save();
        }
      },

      changeProgAdminName(index)
      {
          var self = this;
        if((this.$('.progName' + index)).val()!== ""){
            this.get('store').find('progAdmin', this.get('progAdminModel').objectAt(index).get('id')).then(function(record){
            record.set('name', (self.$('.progName' + index)).val());
            record.save();
                
          });
        }
      },

      changeProgAdminPos(index)
      {
          var self = this;
        if((this.$('.progName' + index)).val()!== ""){
            this.get('store').find('progAdmin', this.get('progAdminModel').objectAt(index).get('id')).then(function(record){
            record.set('position', (self.$('.progPos' + index)).val());
            record.save();
                
          });
        }
      },

      removeProgAdminOption(index){
       this.get('store').find('progAdmin',this.get('progAdminModel').objectAt(index).get('id')).then(function(record){
                record.deleteRecord();
                if(record.get('isDeleted'))
                {
                    record.save();
                }
                
          }, function (error){
              //console.log(error);
          });
          //console.log(index);
      },


      /************************/

      removeLogExpOption(index)
      {
        this.get('store').find('logExpress',this.get('logExpModel').objectAt(index).get('id')).then(function(record){
                record.deleteRecord();
                if(record.get('isDeleted'))
                {
                    record.save();
                }
                
          }, function (error){
              //console.log(error);
          });
      },

       updateValueChoice(val)
      {
          this.set('newLogExpValue',val);
      },

       updateOperatorChoice(val)
      {
          this.set('newLogExpOpr',val);
      },

      updateParameterChoice(val)
      {
          this.set('newLogExpParam',val);
      },

      addLogExpOption()
      {
          if (this.get('newLogExpValue')!==null && this.get('newLogExpParam')!==null && this.get('newLogExpOpr')!==null 
          && this.get('newLogExpOpr')!==""&&this.get('newLogExpParam')!==""&&this.get('newLogExpValue')!==""){
            var expression =  this.get('newLogExpParam')+this.get('newLogExpOpr')+this.get('newLogExpValue');
            var record = this.get('store').createRecord('logExpress', {
                boolExpress: expression,
                rule: [],
                parameter: this.get('newLogExpParam'),
                operator: this.get('newLogExpOpr'),
                value: this.get('newLogExpValue')
            });
            record.save();
        }
      },

      /*************/

      newRuleClicked()
      {
          this.set('newRule', !(this.get('newRule')));
          this.set('errRule', false);
          this.set('newRuleList',[]);
      },

      selectExpression(index)
      {
          var repeat = false;
          for(var i =0;i<this.get('newRuleList').get('length');i++)
          {
              if(this.get('logExpModel').objectAt(index).get('boolExpress') == this.get('newRuleList').objectAt(i).get('boolExpress'))
              {
                  repeat = true;
              }
          }
          if(!repeat){
            this.get('newRuleList').pushObject(this.get('logExpModel').objectAt(index));
          }
      },

      removeNewRule(index)
      {
          this.get('newRuleList').splice(index, 1);
          this.$("#newRule").find('.'+index).remove();
      },

      addRuleOption()
      {
          var n =this.$("#newRule").find('.description').val();
          
          this.set("errRule", false);
            if(n=="")
            {
                this.$("#newRule").form('add prompt', 'description', 'error text');
                this.set("errRule", true);
            }
            else 
            {
                this.$("#newRule").form('remove prompt', 'description');
            }
            if(this.get('newRuleList').get('length')==0)
            {   
                this.$("#newRule").form('add prompt', 'listname', 'error text');
                this.set("errRule", true);
            }
            else 
            {
                this.$("#newRule").form('remove prompt', 'listname');
            }
            if(!this.get('errRule'))
            {
                
                this.set('newRule', false);
                this.set("errRule", false);
                var record = this.get('store').createRecord('rule', {
                description: n,
                logExpressions: this.get('newRuleList'),
                assessmentCode: []
            });
                record.save();
            }
      },

      removeRuleOption(index)
      {
          this.get('store').find('rule',this.get('ruleModel').objectAt(index).get('id')).then(function(record){
                record.deleteRecord();
                if(record.get('isDeleted'))
                {
                    record.save();
                }
                
          }, function (error){
              //console.log(error);
          });
      },

      updateRuleChoice(index)
      {
          var e = false;
          if(this.get('ruleModel').objectAt(index).get('description')=="")
          {
              this.$("#rules").find('.'+index).form('add prompt', 'name', 'error text');
              e=true;
          }
          else 
          {
              this.$("#rules").find('.'+index).form('remove prompt', 'name');
          }
          if (this.get('ruleModel').objectAt(index).get('logExpressions').get('length')==0)
          {
              this.$("#rules").find('.'+index).form('add prompt', 'list', 'error text');
              e=true;
          }
          else 
          {
              this.$("#rules").find('.'+index).form('remove prompt', 'list');
          }
          if (!e)
          {
              this.get('ruleModel').objectAt(index).save();
          }
      },

      updateRule(index)
      {
          var choice = this.$("#rules").find('.'+index).find('.selectedRule').val();


          var repeat= false;
          for (var i =0; i<this.get('ruleModel').objectAt(index).get('logExpressions').get('length'); i++)
          {
              if (this.get('logExpModel').objectAt(choice).get('boolExpress')==this.get('ruleModel').objectAt(index).get('logExpressions').objectAt(i).get('boolExpress'))
              {
                  //console.log("repeat");
                  repeat=true;
              }
          }
          if (!repeat)
          {
              this.get('ruleModel').objectAt(index).get('logExpressions').pushObject(this.get('logExpModel').objectAt(choice));
          }
          
      },

      removeRuleExp(ruleIndex, expIndex)
      {
          //console.log(ruleIndex);
          //console.log(expIndex);
          this.get('ruleModel').objectAt(ruleIndex).get('logExpressions').removeAt(expIndex);
      },

      /****************************/

      newCodeClicked()
      {
          this.set('newCode', !(this.get('newCode')));
          this.set('errCode', false);
          this.set('newCodeList',[]);
          
      },

      selectRule(index)
      {
          var repeat = false;
          for(var i =0;i<this.get('newCodeList').get('length');i++)
          {
              if(this.get('ruleModel').objectAt(index).get('description') == this.get('newCodeList').objectAt(i).get('description'))
              {
                  repeat = true;
              }
          }
          if(!repeat){
            this.get('newCodeList').pushObject(this.get('ruleModel').objectAt(index));
          }
      },

      removeNewCode(index)
      {
          
          this.get('newCodeList').splice(index, 1);
          this.$("#newCode").find('.'+index).remove();
      },

      addCodeOption()
      {
          var n =this.$("#newCode").find('.code').val();
          var m = this.$("#newCode").find('.description').val();
          
          this.set("errCode", false);
            if(n=="")
            {
                this.$("#newCode").form('add prompt', 'code', 'error text');
                this.set("errCode", true);
            }
            else 
            {
                this.$("#newCode").form('remove prompt', 'code');
            }
            if(m=="")
            {
                this.$("#newCode").form('add prompt', 'description', 'error text');
                this.set("errCode", true);
            }
            else 
            {
                this.$("#newCode").form('remove prompt', 'description');
            }
            if(this.get('newCodeList').get('length')==0)
            {   
                this.$("#newCode").form('add prompt', 'listname', 'error text');
                this.set("errCode", true);
            }
            else 
            {
                this.$("#newCode").form('remove prompt', 'listname');
            }
            if(!this.get('errCode'))
            {
                
                this.set('newCode', false);
                this.set("errCode", false);
                var record = this.get('store').createRecord('assessmentCode', {
                code: n,
                description: m,
                rule: this.get('newCodeList'),
                adjudication: []
            });
            //console.log(record);
                record.save();
            }

      },

      removeCodeOption(index)
      {
          this.get('store').find('assessmentCode',this.get('codeModel').objectAt(index).get('id')).then(function(record){
                record.deleteRecord();
                if(record.get('isDeleted'))
                {
                    record.save();
                }
                
          }, function (error){
              //console.log(error);
          });
      },

      updateCodeChoice(index)
      {
          var e = false;
          if(this.get('codeModel').objectAt(index).get('code')=="")
          {
              this.$("#codes").find('.'+index).form('add prompt', 'code', 'error text');
              e=true;
          }
          else 
          {
              this.$("#codes").find('.'+index).form('remove prompt', 'code');
          }
           if(this.get('codeModel').objectAt(index).get('description')=="")
          {
              this.$("#codes").find('.'+index).form('add prompt', 'description', 'error text');
              e=true;
          }
          else 
          {
              this.$("#codes").find('.'+index).form('remove prompt', 'description');
          }
          if (this.get('codeModel').objectAt(index).get('rule').get('length')==0)
          {
              this.$("#codes").find('.'+index).form('add prompt', 'list', 'error text');
              e=true;
          }
          else 
          {
              this.$("#codes").find('.'+index).form('remove prompt', 'list');
          }
          if (!e)
          {
              //console.log(this.get('codeModel').objectAt(index));
              this.get('codeModel').objectAt(index).save();
          }
      },

       updateCode(index)
      {
          var choice = this.$("#codes").find('.'+index).find('.selectedCode').val();
          var repeat= false;
          for (var i =0; i<this.get('codeModel').objectAt(index).get('rule').get('length'); i++)
          {
              if (this.get('ruleModel').objectAt(choice).get('description')==this.get('codeModel').objectAt(index).get('rule').objectAt(i).get('description'))
              {
                  //console.log("repeat");
                  repeat=true;
              }
          }
          if (!repeat)
          {
              this.get('codeModel').objectAt(index).get('rule').pushObject(this.get('ruleModel').objectAt(choice));
          }
          
      },

      removeCodeRule(codeIndex, ruleIndex)
      {
          //console.log(codeIndex);
          //console.log(ruleIndex);
          this.get('codeModel').objectAt(codeIndex).get('rule').removeAt(ruleIndex);
      },

  }
});
