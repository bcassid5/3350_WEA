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
    

    init() {
        this._super(...arguments);
        this.newResChoice="";
        this.newGenderChoice="";
        this.newTermChoice="";
        this.newPlanChoice="";
        this.newCourse=false;
        this.newProgram=false;
        this.err = false;
        this.errProgram = false;
        var self = this;
        this.newPlanList = [];
        
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
            }),
        this.get('store').findAll('schoolTerm').then(function (records) {
           self.set('termModel', records);
        });
        this.get('store').findAll('planCode').then(function (records) {
           self.set('planModel', records);
        });
        this.get('store').findAll('courseCode').then(function (records) {
           self.set('courseModel', records);
        });
        this.get('store').findAll('program').then(function (records) {
           self.set('programModel', records);
        });
    },

    didRender(){
    Ember.$('.menu .item').tab();
  },

  actions: {
      updatePlan(index)
      {
          var choice = this.$("#programs").find('.'+index).find('.selectedPlan').val();
          var repeat= false;
          for (var i =0; i<this.get('programModel').objectAt(index).get('availablePlans').get('length'); i++)
          {
              if (this.get('planModel').objectAt(choice).get('name')==this.get('programModel').objectAt(index).get('availablePlans').objectAt(i).get('name'))
              {
                  console.log("repeat");
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
          console.log(programIndex);
          console.log(planIndex);
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
            console.log(this.get('newPlanList'));
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
      removeProgramOption(index)
      {
          this.get('store').find('program',this.get('programModel').objectAt(index).get('id')).then(function(record){
                record.deleteRecord();
                if(record.get('isDeleted'))
                {
                    record.save();
                }
                
          }, function (error){
              console.log(error);
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
      removeTermOption(index)
      {
        this.get('store').find('schoolTerm',this.get('termModel').objectAt(index).get('id')).then(function(record){
                record.deleteRecord();
                if(record.get('isDeleted'))
                {
                    record.save();
                }
                
          }, function (error){
              console.log(error);
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
              console.log(error);
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
              console.log(error);
          });
      },
      addCourseOption()
      {
        var l =this.$("#newCourse").find('.letter').val();
        var n = this.$("#newCourse").find('.number').val();
        var u =this.$("#newCourse").find('.unit').val();
        var Nname =this.$("#newCourse").find('.name').val();
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
              this.get('programModel').objectAt(index).save();
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
          var searchVal = this.$("#find").find('.searchVal').val().toLowerCase();
          
          console.log(this.get('courseModel').get('length'));
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
