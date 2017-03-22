import Ember from 'ember';

export default Ember.Component.extend({
    
    store: Ember.inject.service(),

    termModel:null,
    studentModel:null,
    gradeModel:null,
    termCodeModel:null,
    courseCodeModel:null,  
    logExpModel: null,    
    ruleModel: null,  
    codeModel: null,
    adjudicationModel:null,

    adjudicationTerm:null,
    adjudicationTermToView:null,

    limit:null,
    offset:null,
    pageSize:null,

    gradeSum:null,
    termAvg: null,
    totalTermUnit:null,
    passedTermUnit:null,
    date:null,
    studentCodes:null,

    showResults:null,

    progress:null,

    moveProgress: Ember.observer('progress', function(){
        this.rerender();
        this.$('#progBar').progress('set percent', this.get("progress"));
    }),

    init(){
        this._super(...arguments);
        var self = this;
        this.adjudicationTerm="";
        this.adjudicationTermToView="";
        this.termAvg=0.0;
        this.gradeSum=0.0;
        this.gradeModel=[];
        this.totalTermUnit=0.0;
        this.passedTermUnit=0.0;
        this.studentCodes=[];
        this.showResults=false;
        this.progress=0.0;
        this.get('store').findAll('schoolTerm').then(function (records) {
           self.set('termModel', records);
        });
        this.get('store').findAll('termCode').then(function(records){
            //console.log(records);
            self.set('termCodeModel', records);
            //console.log(self.get('termCodeModel'));
        });
        this.get('store').findAll('courseCode').then(function(records){
            self.set('courseCodeModel', records);
        });
        this.get('store').findAll('grade').then(function(records){
            self.set('gradeModel', records);
        });
        this.set('limit', 10000000000);
        this.set('offset', 0);
        this.set('pageSize', 100000000);
        this.get('store').query('student', {
            limit: self.get('limit'),
            offset: self.get('offset')
        }).then(function (records) {
            self.set('studentModel', records);
        });

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
    },

    didRender(){
        Ember.$('.menu .item').tab();
        var self = this;
        this.$('#progBar').progress('set percent', self.get("progress"));
    },
    actions: {

        selectTerm(index){
            var term = this.get('termModel').objectAt(index).get('name');
            this.set('adjudicationTerm', term);
            this.set('progress', 0);
            this.$('#progBar').progress('reset');
        },

        adjudicate(){
            var self = this;
// for(var t=1; t<=100; t++){
            //     progress=t;
            //     self.$('#progBar').progress('set percent', progress);
            //}
            if(this.get('adjudicationTerm')!=""){
                this.$("#adjudication").form('remove prompt', 'listname');



                var index=0;
                for(var j =0; j <self.get('termModel').get('length'); j++){
                    //console.log(self.get('termCodeModel').objectAt(j).get('name'));
                    if((self.get('termModel').objectAt(j).get('name'))==(self.get('adjudicationTerm'))){
                        //console.log(j);
                        index=j;
                    }
                }

                //console.log(index);
                //console.log(this.get('termModel').objectAt(index).get('id'));
                this.get('store').query('grade', {schoolterm: this.get('termModel').objectAt(index).get('id')}).then(function(grades){
                    //console.log(grades);
                    self.set('gradeModel', grades);
                    //console.log(self.get('gradeModel'));
                });


                for(var i=0;i<this.get('studentModel').get('length');i++){
                    var currentStudent = this.get('studentModel').objectAt(i);

                    console.log("******************");
                    //console.log(this.get('gradeModel'));

                    var tempGrades=[];
                    for(var t=0;t<this.get('gradeModel').get('length');t++){
                        //console.log(currentStudent.get('id'));
                        for(var q=0;q<this.get('termCodeModel').get('length');q++){
                            //console.log(this.get('gradeModel').objectAt(t).get('term').get('id'));
                            //console.log(this.get('termCodeModel').objectAt(q).get('id'));
                            if(this.get('gradeModel').objectAt(t).get('term').get('id')==this.get('termCodeModel').objectAt(q).get('id')){
                                if(this.get('termCodeModel').objectAt(q).get('student').get('id')==currentStudent.get('id')){
                                    tempGrades.push(this.get('gradeModel').objectAt(t));
                                }
                            }
                        }
                    }
                    //console.log(tempTerms);
                    console.log(tempGrades);

                    if(tempGrades.get('length')!=0){
                    
                        for(var k=0;k<tempGrades.get('length');k++){
                            var temp = 0.0;
                            temp=self.get('gradeSum')+tempGrades.objectAt(k).get('mark');
                            self.set('gradeSum',temp);

                            var temp2 = 0;
                            temp2=self.get('totalTermUnit')+tempGrades.objectAt(k).get('course').get('unit');
                            self.set('totalTermUnit', temp2);

                            if(tempGrades.objectAt(k).get('mark')>=50){
                                var temp3=0;
                                temp3=self.get('passedTermUnit')+tempGrades.objectAt(k).get('course').get('unit');
                                self.set('passedTermUnit', temp3);
                            }
                        }

                        var avg = (self.get('gradeSum'))/(tempGrades.get('length'));
                        self.set('termAvg', avg);

                        self.set('date', Date().toString());

                        var codeTest=true;
                        for(var w=0;w<self.get('codeModel').get('length');w++){
                            var currentAssessmentCode = self.get('codeModel').objectAt(w);
                            var rules = currentAssessmentCode.get('rule');
                            for(var x=0;x<rules.get('length');x++){
                                var currentRule = rules.objectAt(x);
                                var logExpressions = currentRule.get('logExpressions');
                                codeTest=true;
                                for(var y=0;y<logExpressions.get('length');y++){
                                    var currentExpression = logExpressions.objectAt(y);
                                    if(currentExpression.get('parameter')=="TotalAvg" && currentExpression.get('operator')=="="){
                                        if(self.get('termAvg')==currentExpression.get('value')){
                                            if(codeTest!=false){
                                                codeTest=true;
                                            }
                                        } else{
                                            codeTest=false;
                                        }
                                    } else if(currentExpression.get('parameter')=="TotalAvg" && currentExpression.get('operator')==">="){
                                        if(self.get('termAvg')>=currentExpression.get('value')){
                                            if(codeTest!=false){
                                                codeTest=true;
                                            }
                                        } else{
                                            codeTest=false;
                                        }
                                    } else if(currentExpression.get('parameter')=="TotalAvg" && currentExpression.get('operator')=="<="){
                                        if(self.get('termAvg')<=currentExpression.get('value')){
                                            if(codeTest!=false){
                                                codeTest=true;
                                            }
                                        } else{
                                            codeTest=false;
                                        }
                                    } else if(currentExpression.get('parameter')=="TotalAvg" && currentExpression.get('operator')==">"){
                                        if(self.get('termAvg')>currentExpression.get('value')){
                                            if(codeTest!=false){
                                                codeTest=true;
                                            }
                                        } else{
                                            codeTest=false;
                                        }
                                    } else if(currentExpression.get('parameter')=="TotalAvg" && currentExpression.get('operator')=="<"){
                                        if(self.get('termAvg')<currentExpression.get('value')){
                                            if(codeTest!=false){
                                                codeTest=true;
                                            }
                                        } else{
                                            codeTest=false;
                                        }
                                    } else if(currentExpression.get('parameter')=="TermUnitPassed" && currentExpression.get('operator')=="="){
                                        if(self.get('passedTermUnit')==currentExpression.get('value')){
                                            if(codeTest!=false){
                                                codeTest=true;
                                            }
                                        } else{
                                            codeTest=false;
                                        }
                                    } else if(currentExpression.get('parameter')=="TermUnitPassed" && currentExpression.get('operator')==">="){
                                        if(self.get('passedTermUnit')>=currentExpression.get('value')){
                                            if(codeTest!=false){
                                                codeTest=true;
                                            }
                                        } else{
                                            codeTest=false;
                                        }
                                    } else if(currentExpression.get('parameter')=="TermUnitPassed" && currentExpression.get('operator')=="<="){
                                        if(self.get('passedTermUnit')<=currentExpression.get('value')){
                                            if(codeTest!=false){
                                                codeTest=true;
                                            }
                                        } else{
                                            codeTest=false;
                                        }
                                    } else if(currentExpression.get('parameter')=="TermUnitPassed" && currentExpression.get('operator')==">"){
                                        if(self.get('passedTermUnit')>currentExpression.get('value')){
                                            if(codeTest!=false){
                                                codeTest=true;
                                            }
                                        } else{
                                            codeTest=false;
                                        }
                                    } else if(currentExpression.get('parameter')=="TermUnitPassed" && currentExpression.get('operator')=="<"){
                                        if(self.get('passedTermUnit')<currentExpression.get('value')){
                                            if(codeTest!=false){
                                                codeTest=true;
                                            }
                                        } else{
                                            codeTest=false;
                                        }
                                    } else if(currentExpression.get('parameter')=="TermUnitTotal" && currentExpression.get('operator')=="="){
                                        if(self.get('totalTermUnit')==currentExpression.get('value')){
                                            if(codeTest!=false){
                                                codeTest=true;
                                            }
                                        } else{
                                            codeTest=false;
                                        }
                                    }
                                    else if(currentExpression.get('parameter')=="TermUnitTotal" && currentExpression.get('operator')==">="){
                                        if(self.get('totalTermUnit')>=currentExpression.get('value')){
                                            if(codeTest!=false){
                                                codeTest=true;
                                            }
                                        } else{
                                            codeTest=false;
                                        }
                                    } else if(currentExpression.get('parameter')=="TermUnitTotal" && currentExpression.get('operator')=="<="){
                                        if(self.get('totalTermUnit')<=currentExpression.get('value')){
                                            if(codeTest!=false){
                                                codeTest=true;
                                            }
                                        } else{
                                            codeTest=false;
                                        }
                                    } else if(currentExpression.get('parameter')=="TermUnitTotal" && currentExpression.get('operator')==">"){
                                        if(self.get('totalTermUnit')>currentExpression.get('value')){
                                            if(codeTest!=false){
                                                codeTest=true;
                                            }
                                        } else{
                                            codeTest=false;
                                        }
                                    } else if(currentExpression.get('parameter')=="TermUnitTotal" && currentExpression.get('operator')=="<"){
                                        if(self.get('totalTermUnit')<currentExpression.get('value')){
                                            if(codeTest!=false){
                                                codeTest=true;
                                            }
                                        } else{
                                            codeTest=false;
                                        }
                                    } else{
                                        var notFound=true;
                                        if(notFound==true){
                                            for(var h=0;h<self.get('courseCodeModel').get('length');h++){
                                                var currentCourse = self.get('courseCodeModel').objectAt(h);
                                                var currentCourseRef = currentCourse.get('courseLetter')+currentCourse.get('courseNumber');
                                                if(currentExpression.get('parameter')==currentCourseRef && currentExpression.get('operator')=="="){
                                                    for(var f=0;f<tempGrades.get('length');f++){
                                                        var currentStudentGrade = tempGrades.objectAt(f);
                                                        var currentStudentGradeCourse = currentStudentGrade.get('course').get('courseLetter')+currentStudentGrade.get('course').get('courseNumber');
                                                        if(currentStudentGradeCourse==currentCourseRef){
                                                            if(currentStudentGrade.get('mark')==currentExpression.get('value')){
                                                                if(codeTest!=false){
                                                                    codeTest=true;
                                                                    notFound=false;
                                                                }
                                                            } else{
                                                                codeTest=false;
                                                            }
                                                        }
                                                    }
                                                } else if(currentExpression.get('parameter')==currentCourseRef && currentExpression.get('operator')==">="){
                                                    for(var f=0;f<tempGrades.get('length');f++){
                                                        var currentStudentGrade = tempGrades.objectAt(f);
                                                        var currentStudentGradeCourse = currentStudentGrade.get('course').get('courseLetter')+currentStudentGrade.get('course').get('courseNumber');
                                                        if(currentStudentGradeCourse==currentCourseRef){ 
                                                            if(currentStudentGrade.get('mark')>=currentExpression.get('value')){
                                                                if(codeTest!=false){
                                                                    codeTest=true;
                                                                    notFound=false;
                                                                }
                                                            } else{
                                                                codeTest=false;
                                                            }
                                                        }
                                                    }
                                                } else if(currentExpression.get('parameter')==currentCourseRef && currentExpression.get('operator')=="<="){
                                                    for(var f=0;f<tempGrades.get('length');f++){
                                                        var currentStudentGrade = tempGrades.objectAt(f);
                                                        var currentStudentGradeCourse = currentStudentGrade.get('course').get('courseLetter')+currentStudentGrade.get('course').get('courseNumber');
                                                        if(currentStudentGradeCourse==currentCourseRef){
                                                            if(currentStudentGrade.get('mark')<=currentExpression.get('value')){
                                                                if(codeTest!=false){
                                                                    codeTest=true;
                                                                    notFound=false;
                                                                }
                                                            } else{
                                                                codeTest=false;
                                                            }
                                                        }
                                                    }
                                                } else if(currentExpression.get('parameter')==currentCourseRef && currentExpression.get('operator')==">"){
                                                    for(var f=0;f<tempGrades.get('length');f++){
                                                        var currentStudentGrade = tempGrades.objectAt(f);
                                                        var currentStudentGradeCourse = currentStudentGrade.get('course').get('courseLetter')+currentStudentGrade.get('course').get('courseNumber');
                                                        if(currentStudentGradeCourse==currentCourseRef){ 
                                                            if (currentStudentGrade.get('mark')>currentExpression.get('value')){
                                                                if(codeTest!=false){
                                                                    codeTest=true;
                                                                    notFound=false;
                                                                }
                                                            } else{
                                                                codeTest=false;
                                                            }
                                                        }
                                                    }
                                                } else if(currentExpression.get('parameter')==currentCourseRef && currentExpression.get('operator')=="<"){
                                                    for(var f=0;f<tempGrades.get('length');f++){
                                                        var currentStudentGrade = tempGrades.objectAt(f);
                                                        var currentStudentGradeCourse = currentStudentGrade.get('course').get('courseLetter')+currentStudentGrade.get('course').get('courseNumber');
                                                        if(currentStudentGradeCourse==currentCourseRef) { 
                                                            if(currentStudentGrade.get('mark')<currentExpression.get('value')){
                                                                if(codeTest!=false){
                                                                    codeTest=true;
                                                                    notFound=false;
                                                                }
                                                            } else{
                                                                codeTest=false;
                                                            }
                                                        }
                                                    }
                                                }
                                            }

                                            if(notFound==true){
                                                codeTest=false;
                                            }
                                        }
                                    }
                                }
                            }

                            if(codeTest==true){
                                self.get('studentCodes').push(self.get('store').peekRecord('assessmentCode', currentAssessmentCode.get('id')));
                            }

                        }
                        
                        var index=0;
                        while(index!=-1){
                            index=self.get('studentCodes').indexOf(null);
                            if (index > -1) {
                                self.get('studentCodes').splice(index, 1);
                            }
                        }
                        

                        console.log(currentStudent);
                        console.log(this.get('studentCodes'));
                        var record = self.get('store').createRecord('adjudication', {
                            date: self.get('date'),
                            termAVG: self.get('termAvg'),
                            termUnitPassed: self.get('passedTermUnit'),
                            termUnitTotal: self.get('totalTermUnit'),
                            note: self.get('adjudicationTerm'),
                            assessmentCode: self.get('studentCodes'),
                            student: self.get('store').peekRecord('student', currentStudent.get('id'))
                        });
                        record.save();
                    }

                    console.log(self.get('totalTermUnit'));
                    console.log(self.get('termAvg'));
                    console.log(self.get('passedTermUnit'));
                    console.log(self.get('date'));

                    self.set('gradeSum', 0.0);
                    self.set('totalTermUnit', 0);
                    self.set('termAvg', 0.0);
                    self.set('passedTermUnit', 0);
                    self.set('studentCodes', []);
                    
                    
                    
                    var incrementVal = 100/(this.get('studentModel').get('length'));
                    if(self.get('progress')<100){
                        self.set('progress', self.get('progress')+incrementVal);
                    }
                   // this.rerender();
                    console.log(self.get('progress'));
                    //this.$('#progBar').progress('set percent', progress);
                    // if(progress >= 1){
                    //     for(var t=100000000; t>0; t--){}
                    //     console.log(incrementVal);
                    //     progress = 0;
                    // }
                    //console.log(progress);
                  //  for(var t=1000000000; t>0; t--){}
                    
                }
            } else{
                this.$("#adjudication").form('add prompt', 'listname', 'error text');
            }

        },

        selectTermToView(index){
            var term = this.get('termModel').objectAt(index).get('name');
            this.set('adjudicationTermToView', term);
        },

        viewAdjudication(){
            this.set('showResults', !this.get('showResults'));
        }
    }
});
