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

    init(){
        this._super(...arguments);
        var self = this;

        this.adjudicationTerm="";
        this.adjudicationTermToView="";
        this.termAvg=0.0;
        this.gradeSum=0.0;
        this.gradeModel=[];
        this.termCodeModel=[];
        this.totalTermUnit=0;
        this.passedTermUnit=0;
        this.studentCodes=[];
        this.showResults=false;

        this.get('store').findAll('schoolTerm').then(function (records) {
           self.set('termModel', records);
        });
        this.get('store').findAll('termCode').then(function(records){
            self.set('termCodeModel', records);
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

        this.get('store').findAll('schoolTerm').then(function(records){
            self.set('termCodeModel', records);
            console.log(self.get('termCodeModel'));
        });
    },

    didRender() {
        Ember.$('.menu .item').tab();
    },

    actions: {

        selectTerm(index){
            var term = this.get('termModel').objectAt(index).get('name');
            this.set('adjudicationTerm', term);
        },

        adjudicate(){
            var self = this;

            if(this.get('adjudicationTerm')!=""){
                this.$("#adjudication").form('remove prompt', 'listname');


                var index=0;
                for(var j =0; j <self.get('termCodeModel').get('length'); j++){
                    //console.log(self.get('termCodeModel').objectAt(j).get('name'));
                    if((self.get('termCodeModel').objectAt(j).get('name'))==(self.get('adjudicationTerm'))){
                        console.log(j);
                        index=j;
                    }
                }

                console.log(index);
                console.log(this.get('termCodeModel').objectAt(index).get('id'));
                this.get('store').query('grade', {schoolTerm: this.get('termCodeModel').objectAt(index).get('id')}).then(function(grades){
                    self.set('gradeModel', grades);
                    console.log(self.get('gradeModel'));
                });



                /*for(var i=1;i<this.get('studentModel').get('length');i++){
                    var currentStudent = this.get('studentModel').objectAt(i);
                    this.get('store').query('termCode',{student: currentStudent.get('id')}).then(function(terms){
                        self.set('termCodeModel', terms);
                        self.set('gradeModel', []);
                        for(var j =0; j <self.get('termCodeModel').get('length'); j++){
                            if((self.get('termCodeModel').objectAt(j).get('name').get('name'))==(self.get('adjudicationTerm'))){
                                self.get('store').query('grade',{term: self.get('termCodeModel').objectAt(j).get('id')}).then(function(grades){
                                    self.get('gradeModel').addObjects(grades);

                                    for(var k=0;k<self.get('gradeModel').get('length');k++){
                                        var temp = 0.0;
                                        temp=self.get('gradeSum')+self.get('gradeModel').objectAt(k).get('mark');
                                        self.set('gradeSum',temp);

                                        var temp2 = 0;
                                        temp2=self.get('totalTermUnit')+self.get('gradeModel').objectAt(k).get('course').get('unit');
                                        self.set('totalTermUnit', temp2);

                                        if(self.get('gradeModel').objectAt(k).get('mark')>=50){
                                            var temp3=0;
                                            temp3=self.get('passedTermUnit')+self.get('gradeModel').objectAt(k).get('course').get('unit');
                                            self.set('passedTermUnit', temp3);
                                        }
                                    }

                                    var avg = (self.get('gradeSum'))/(self.get('gradeModel').get('length'));
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
                                                                for(var f=0;f<self.get('gradeModel').get('length');f++){
                                                                    var currentStudentGrade = self.get('gradeModel').objectAt(f);
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
                                                                for(var f=0;f<self.get('gradeModel').get('length');f++){
                                                                    var currentStudentGrade = self.get('gradeModel').objectAt(f);
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
                                                                for(var f=0;f<self.get('gradeModel').get('length');f++){
                                                                    var currentStudentGrade = self.get('gradeModel').objectAt(f);
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
                                                                for(var f=0;f<self.get('gradeModel').get('length');f++){
                                                                    var currentStudentGrade = self.get('gradeModel').objectAt(f);
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
                                                                for(var f=0;f<self.get('gradeModel').get('length');f++){
                                                                    var currentStudentGrade = self.get('gradeModel').objectAt(f);
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

                                    self.set('gradeModel', []);
                                    self.set('gradeSum', 0.0);
                                    self.set('totalTermUnit', 0);
                                    self.set('termAvg', 0.0);
                                    self.set('passedTermUnit', 0);
                                    self.set('studentCodes', []);

                                });
                            }
                        }

                    });
                }*/
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
