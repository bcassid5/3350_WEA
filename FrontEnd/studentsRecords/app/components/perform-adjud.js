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
    showResults:null,

    progress:null,

    departmentModel: null,
    programModel: null,
    isNone: true,
    isDepartment:false,
    isProgram: false,
    departmentGroups: [],
    programGroups: [],
    moveProgress: Ember.observer('progress', function(){
        this.rerender();
        this.$('#progBar').progress('set percent', this.get("progress"));
    }),

    init(){
        this._super(...arguments);
        var self = this;
        this.adjudicationTerm="";
        this.adjudicationTermToView="";
        this.gradeModel=[];
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
        //this.get('store').query('student',{department: "58d2a553a3ddd62848d60587"}).then(function(grades){
      //           console.log(grades.get('length'));
      //           self.get('store').query('student',{program: self.get('programModel').objectAt(0).get('id')}).then(function(grades2){
      //           console.log(grades2.get('length'));
      //      });
      //      });
        this.get('store').findAll('department').then(function(records){
            self.set('departmentModel', records);
            //console.log(self.get('departmentModel').get('length'));
            for (var i =0;i<self.get('departmentModel').get('length');i++)
            {
                self.get('store').query('student',{department: self.get('departmentModel').objectAt(i).get('id')}).then(function(grades){
                
                self.get('departmentGroups').push(grades);
                
           });
           
            }
        });
        this.get('store').findAll('adjudication').then(function(records){
            self.set('adjudicationModel', records);
        });
        this.get('store').findAll('program').then(function (records) {
           self.set('programModel', records);
           for (var i =0;i<self.get('programModel').get('length');i++)
            {
                self.get('store').query('student',{program: self.get('programModel').objectAt(i).get('id')}).then(function(grades){
                
                self.get('programGroups').push(grades);
                
           });
           
            }
        });
        
    },

    didRender(){
        Ember.$('.menu .item').tab();
        var self = this;
        this.$('#progBar').progress('set percent', self.get("progress"));
    },
    actions: {
        noneSelected(){
            this.set('showResults', false);
        },
        programSelected(){
            this.set('isProgram', !this.get('isProgram'));
        },
        departmentSelected(){
            this.set('isDepartment', !this.get('isDepartment'));
        },
        viewAdjudication(){
            if (this.get("adjudicationTermToView") == ""){
                alert("Term not selected");
            } else {
                this.set('showResults', !this.get('showResults'));
            }
        },
        selectTerm(index){
            var term = this.get('termModel').objectAt(index).get('name');
            this.set('adjudicationTerm', term);
            this.set('progress', 0);
            this.$('#progBar').progress('reset');
        },

        adjudicate(){

            var self = this;
            var index=0;
            for(var j =0; j <self.get('termModel').get('length'); j++){
                //console.log(self.get('termCodeModel').objectAt(j).get('name'));
                if((self.get('termModel').objectAt(j).get('name'))==(self.get('adjudicationTerm'))){
                    //console.log(j);
                    index=j;
                }
            }
            this.get('store').query('grade', {schoolterm: self.get('termModel').objectAt(index).get('id')}).then(function(grades){
            self.set('gradeModel', []);
            var studentCodes = [];
            //console.log(studentCodes);
            
            var gradeSum = 0.0;
            var totalTermUnit = 0.0;
            var passedTermUnit = 0.0;
            var date = new Date().toString();
            var termAvg = 0.0;
// for(var t=1; t<=100; t++){
            //     progress=t;
            //     self.$('#progBar').progress('set percent', progress);
            //}
            

                //console.log(index);
                //console.log(this.get('termModel').objectAt(index).get('id'));
                
                    self.set('gradeModel', grades);
                    if(self.get('adjudicationTerm')!=""){
                        self.$("#adjudication").form('remove prompt', 'listname');  
                        for(var i=0;i<self.get('studentModel').get('length');i++){
                            var currentStudent = self.get('studentModel').objectAt(i);

                            //console.log("******************");
                            //console.log(this.get('gradeModel'));

                            gradeSum = 0.0;
                            totalTermUnit = 0.0;
                            passedTermUnit = 0.0;
                            studentCodes=null;
                            studentCodes = [];
                            date=new Date().toString();
                            termAvg=0.0;

                            //console.log(studentCodes);
                            //console.log(studentCodes.get('length'));
                            //console.log(studentCodes);
                            //console.log(studentCodes.get('length'));
                            //console.log("----------------");
                            var tempGrades=[];
                            for(var t=0;t<self.get('gradeModel').get('length');t++){
                                //console.log(currentStudent.get('id'));
                                for(var q=0;q<self.get('termCodeModel').get('length');q++){
                                    //console.log(this.get('gradeModel').objectAt(t).get('term').get('id'));
                                    //console.log(this.get('termCodeModel').objectAt(q).get('id'));
                                    if(self.get('gradeModel').objectAt(t).get('term').get('id')==self.get('termCodeModel').objectAt(q).get('id')){
                                        if(self.get('termCodeModel').objectAt(q).get('student').get('id')==currentStudent.get('id')){
                                            tempGrades.push(self.get('gradeModel').objectAt(t));
                                        }
                                    }
                                }
                            }
                            //console.log(tempTerms);
                           // console.log(tempGrades);

                            if(tempGrades.get('length')!=0){
                            
                                for(var k=0;k<tempGrades.get('length');k++){
                                    var temp = 0.0;
                                    temp=gradeSum+tempGrades.objectAt(k).get('mark');
                                    gradeSum=temp;

                                    var temp2 = 0.0;
                                    temp2=totalTermUnit+tempGrades.objectAt(k).get('course').get('unit');
                                    totalTermUnit=temp2;

                                    if(tempGrades.objectAt(k).get('mark')>=50){
                                        var temp3=0.0;
                                        temp3=passedTermUnit+tempGrades.objectAt(k).get('course').get('unit');
                                        passedTermUnit=temp3;
                                    }
                                }

                                if(tempGrades.get('length')>0){
                                    var avg = (gradeSum)/(tempGrades.get('length'));
                                    termAvg=avg;
                                } else{
                                    termAvg=0.0;
                                }
                                

                                //console.log(termAvg);
                                //console.log(totalTermUnit);
                                //console.log(passedTermUnit);


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
                                                codeTest = codeTest && termAvg==currentExpression.get('value');
                                                    /*if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }*/
                                            } else if(currentExpression.get('parameter')=="TotalAvg" && currentExpression.get('operator')==">="){
                                                codeTest = codeTest && (termAvg>=currentExpression.get('value'));
                                                  /*  if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }*/
                                            } else if(currentExpression.get('parameter')=="TotalAvg" && currentExpression.get('operator')=="<="){
                                                codeTest = codeTest && (termAvg<=currentExpression.get('value'));
                                                    /*if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }*/
                                            } else if(currentExpression.get('parameter')=="TotalAvg" && currentExpression.get('operator')==">"){
                                                codeTest = codeTest && (termAvg>currentExpression.get('value'));
                                                    /*if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }*/
                                            } else if(currentExpression.get('parameter')=="TotalAvg" && currentExpression.get('operator')=="<"){
                                                codeTest = codeTest && (termAvg<currentExpression.get('value'));
                                                    /*if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }*/
                                            } else if(currentExpression.get('parameter')=="TermUnitPassed" && currentExpression.get('operator')=="="){
                                                codeTest = codeTest && (passedTermUnit==currentExpression.get('value'));
                                                   /* if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }*/
                                            } else if(currentExpression.get('parameter')=="TermUnitPassed" && currentExpression.get('operator')==">="){
                                                codeTest = codeTest && (passedTermUnit>=currentExpression.get('value'));
                                                  /*  if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }*/
                                            } else if(currentExpression.get('parameter')=="TermUnitPassed" && currentExpression.get('operator')=="<="){
                                                codeTest = codeTest && (passedTermUnit<=currentExpression.get('value'));
                                                    /*if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }*/
                                            } else if(currentExpression.get('parameter')=="TermUnitPassed" && currentExpression.get('operator')==">"){
                                                codeTest = codeTest && (passedTermUnit>currentExpression.get('value'));
                                                  /*  if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }*/
                                            } else if(currentExpression.get('parameter')=="TermUnitPassed" && currentExpression.get('operator')=="<"){
                                                codeTest = codeTest && (passedTermUnit<currentExpression.get('value'));
                                                  /*  if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }*/
                                            } else if(currentExpression.get('parameter')=="TermUnitTotal" && currentExpression.get('operator')=="="){
                                                codeTest = codeTest && (totalTermUnit==currentExpression.get('value'));
                                                  /*  if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }*/
                                            }
                                            else if(currentExpression.get('parameter')=="TermUnitTotal" && currentExpression.get('operator')==">="){
                                                codeTest = codeTest && (totalTermUnit>=currentExpression.get('value'));
                                                  /*  if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }*/
                                            } else if(currentExpression.get('parameter')=="TermUnitTotal" && currentExpression.get('operator')=="<="){
                                                codeTest = codeTest && (totalTermUnit<=currentExpression.get('value'));
                                                 /*   if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }*/
                                            } else if(currentExpression.get('parameter')=="TermUnitTotal" && currentExpression.get('operator')==">"){
                                               codeTest = codeTest && (totalTermUnit>currentExpression.get('value'));
                                                /*    if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }*/
                                            } else if(currentExpression.get('parameter')=="TermUnitTotal" && currentExpression.get('operator')=="<"){
                                                codeTest = codeTest && (totalTermUnit<currentExpression.get('value'));
                                                /*    if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }*/
                                            } else{
                                                var found=false;
                                                for(var h=0;h<self.get('courseCodeModel').get('length');h++){
                                                    var currentCourse = self.get('courseCodeModel').objectAt(h);
                                                    var currentCourseRef = currentCourse.get('courseLetter')+currentCourse.get('courseNumber');

                                                    if(currentExpression.get('parameter')==currentCourseRef){
                                                        for(var z=0;z<tempGrades.get('length');z++){
                                                            var currentStudentGrade = tempGrades.objectAt(z);
                                                            var currentStudentGradeCourse = currentStudentGrade.get('course').get('courseLetter')+currentStudentGrade.get('course').get('courseNumber');
                                                            if(currentStudentGradeCourse==currentCourseRef){
                                                                if(currentExpression.get('operator')=="="){
                                                                    codeTest = codeTest && (currentStudentGrade.get('mark')==currentExpression.get('value'));
                                                                    found=true;
                                                                } else if(currentExpression.get('operator')==">="){
                                                                    codeTest = codeTest && (currentStudentGrade.get('mark')>=currentExpression.get('value'));
                                                                    found=true;
                                                                } else if(currentExpression.get('operator')=="<="){
                                                                    codeTest = codeTest && (currentStudentGrade.get('mark')<=currentExpression.get('value'));
                                                                    found=true;
                                                                } else if(currentExpression.get('operator')==">"){
                                                                    codeTest = codeTest && (currentStudentGrade.get('mark')>currentExpression.get('value'));
                                                                    found=true;
                                                                } else if(currentExpression.get('operator')=="<"){
                                                                    codeTest = codeTest && (currentStudentGrade.get('mark')<currentExpression.get('value'));
                                                                    found=true;
                                                                } 
                                                            }
                                                        }
                                                    }
                                                }

                                                codeTest=codeTest&&found;

                                            }
                                        }
                                    }

                                    if(codeTest==true){
                                        //console.log(studentCodes);
                                        studentCodes.push(self.get('store').peekRecord('assessmentCode', currentAssessmentCode.get('id')));
                                       // console.log(studentCodes);
                                        var index=0;
                                        while(index!=-1){
                                            index=studentCodes.indexOf(null);
                                            //console.log(index);
                                            if (index > -1) {
                                                studentCodes.splice(index, 1);
                                            }
                                        }        
                                    }

                                }
                                
                                
                                

                                //console.log(currentStudent);
                                //console.log(studentCodes);
                                //console.log(totalTermUnit);
                                //console.log(termAvg);
                                //console.log(passedTermUnit);
                                //console.log(date);

                                var record = self.get('store').createRecord('adjudication', {
                                    date: date,
                                    termAVG: termAvg,
                                    termUnitPassed: passedTermUnit,
                                    termUnitTotal: totalTermUnit,
                                    note: self.get('adjudicationTerm'),
                                    assessmentCode: studentCodes,
                                    student: self.get('store').peekRecord('student', currentStudent.get('id'))
                                });
                                //console.log(studentCodes);
                                record.save();
                            }

                            //console.log(studentCodes);
                            
                            var incrementVal = 100/(self.get('studentModel').get('length'));
                            if(self.get('progress')<100){
                                self.set('progress', self.get('progress')+incrementVal);
                            }
                        // this.rerender();
                            //console.log(self.get('progress'));
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
                        self.$("#adjudication").form('add prompt', 'listname', 'error text');
                    }
            });
        },

        selectTermToView(index){
            var term = this.get('termModel').objectAt(index).get('name');
            this.set('adjudicationTermToView', term);
        },

        

        exportPDF(id) {
            var self = this;
            var doc = new jsPDF();
            var title = "";
            //doc.text("Adjudication: " + this.get("adjudicationTermToView"), 14, 16);
            if(id == 1){
                var elem = document.getElementById("studentTable");
                title = "Students in Term";
            } else if (id == 2){
                var elem = document.getElementById("departmentTable");
                title = "Students in Departments";
            } else if (id == 3){
                var elem = document.getElementById("programTable");
                title = "Students in Programs";
            }
            
            var res = doc.autoTableHtmlToJson(elem);
            doc.autoTable(res.columns, res.data, {
                startY: 20, 
                theme: 'grid',
                headerStyles: {fillColor: [79, 38, 131]},
                addPageContent: function(data) {
                    doc.text("Adjudication: " + self.get("adjudicationTermToView") + ": " + title, 15, 15);
                }
            });
            doc.output("dataurlnewwindow");
        },

        exportExcel(){
            
            var uri = 'data:application/vnd.ms-excel;base64,'
            , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
            , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
            , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
            return function (table, name, filename) {
                if (!table.nodeType) table = document.getElementById('table')
                var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }

                document.getElementById("dlink").href = uri + base64(format(template, ctx));
                document.getElementById("dlink").download = filename;
                document.getElementById("dlink").click();
            }
        },
    
        export2() {
            var doc = new jsPDF();
            
            for(var i =0; i <this.get('departmentGroups').get('length');i++)
            {
                var self = this;
                //console.log(this.get('departmentGroups').get('length'));
            
                //doc.text("Adjudication: " + this.get("adjudicationTermToView"), 14, 16);
                var elem = document.getElementById(i);
                var res = doc.autoTableHtmlToJson(elem);
                doc.autoTable(res.columns, res.data, {
                    startY: 20, 
                    theme: 'grid',
                    headerStyles: {fillColor: [79, 38, 131]},
                    addPageContent: function(data) {
                        doc.text("Adjudication: " + self.get("adjudicationTermToView"), 15, 15);
                    }
                });
                
            }
            doc.output("dataurlnewwindow");
            
        },

        deleteAll() {
            this.get('store').findAll('adjudication').then(function(record){
                record.content.forEach(function(rec) {
                    Ember.run.once(this, function() {
                        rec.deleteRecord();
                        rec.save();
                    });
                }, this);
            }); 
        }
    }
});


                    