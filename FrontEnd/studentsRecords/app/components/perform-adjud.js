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

    //gradeSum:null,
    //termAvg: null,
    //totalTermUnit:null,
    //passedTermUnit:null,
    //date:null,
    //studentCodes:null,

    showResults:null,

    progress:null,
    chosen: null,
    departmentModel: null,
    programModel: null,
    isNone: true,
    isDepartment:false,
    isProgram: false,
    departmentGroups: [],
    programGroups: [],
    departmentsAdded: [],
    programsAdded: [],
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
        this.isNone=true;
        this.isDepartment=false;
        this.isProgram=false;
        this.departmentGroups=[],
        this.programGroups=[],
        this.chosen=false;
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
            this.set('isDepartment', false);
            this.set('isProgram', false);
            this.set("isNone", true);
        },
        programSelected(){
            this.set('isDepartment', false);
            this.set('isProgram', true);
            this.set("isNone", false);
        },
        departmentSelected(){
            this.set('isDepartment', true);
            this.set('isProgram', false);
            this.set("isNone", false);
        },
        viewAdjudication(){
            this.set('showResults', !this.get('showResults'));
        },
        selectTerm(index){
            var term = this.get('termModel').objectAt(index).get('name');
            this.set('adjudicationTerm', term);
            this.set('progress', 0);
            this.$('#progBar').progress('reset');
        },

        adjudicate(){

            this.set('gradeModel', []);

            var self = this;
// for(var t=1; t<=100; t++){
            //     progress=t;
            //     self.$('#progBar').progress('set percent', progress);
            //}
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
                self.get('store').query('grade', {schoolterm: self.get('termModel').objectAt(index).get('id')}).then(function(grades){
                    //console.log(grades);
                    self.set('gradeModel', grades);
                    //console.log(self.get('gradeModel'));
                    if(self.get('adjudicationTerm')!=""){
                        self.$("#adjudication").form('remove prompt', 'listname');

                            var gradeSum = 0.0;
                            var totalTermUnit = 0.0;
                            var passedTermUnit = 0.0;
                            var studentCodes=null;
                            //studentCodes = [];
                            var date=new Date().toString();
                            var termAvg=0.0;
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
                            //console.log(tempGrades);

                            if(tempGrades.get('length')!=0){
                            
                                for(var k=0;k<tempGrades.get('length');k++){
                                    var temp = 0.0;
                                    temp=gradeSum+tempGrades.objectAt(k).get('mark');
                                    gradeSum=temp;

                                    var temp2 = 0.0;
                                    temp2=totalTermUnit+tempGrades.objectAt(k).get('course').get('unit');
                                    totalTermUnit=temp2;

                                    if(tempGrades.objectAt(k).get('mark')>=50){
                                        var temp3=0;
                                        temp3=passedTermUnit+tempGrades.objectAt(k).get('course').get('unit');
                                        passedTermUnit=temp3;
                                    }
                                }

                                var avg = (gradeSum)/(tempGrades.get('length'));
                                termAvg=avg;

                                


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
                                                if(termAvg==currentExpression.get('value')){
                                                    if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }
                                            } else if(currentExpression.get('parameter')=="TotalAvg" && currentExpression.get('operator')==">="){
                                                if(termAvg>=currentExpression.get('value')){
                                                    if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }
                                            } else if(currentExpression.get('parameter')=="TotalAvg" && currentExpression.get('operator')=="<="){
                                                if(termAvg<=currentExpression.get('value')){
                                                    if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }
                                            } else if(currentExpression.get('parameter')=="TotalAvg" && currentExpression.get('operator')==">"){
                                                if(termAvg>currentExpression.get('value')){
                                                    if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }
                                            } else if(currentExpression.get('parameter')=="TotalAvg" && currentExpression.get('operator')=="<"){
                                                if(termAvg<currentExpression.get('value')){
                                                    if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }
                                            } else if(currentExpression.get('parameter')=="TermUnitPassed" && currentExpression.get('operator')=="="){
                                                if(passedTermUnit==currentExpression.get('value')){
                                                    if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }
                                            } else if(currentExpression.get('parameter')=="TermUnitPassed" && currentExpression.get('operator')==">="){
                                                if(passedTermUnit>=currentExpression.get('value')){
                                                    if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }
                                            } else if(currentExpression.get('parameter')=="TermUnitPassed" && currentExpression.get('operator')=="<="){
                                                if(passedTermUnit<=currentExpression.get('value')){
                                                    if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }
                                            } else if(currentExpression.get('parameter')=="TermUnitPassed" && currentExpression.get('operator')==">"){
                                                if(passedTermUnit>currentExpression.get('value')){
                                                    if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }
                                            } else if(currentExpression.get('parameter')=="TermUnitPassed" && currentExpression.get('operator')=="<"){
                                                if(passedTermUnit<currentExpression.get('value')){
                                                    if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }
                                            } else if(currentExpression.get('parameter')=="TermUnitTotal" && currentExpression.get('operator')=="="){
                                                if(totalTermUnit==currentExpression.get('value')){
                                                    if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }
                                            }
                                            else if(currentExpression.get('parameter')=="TermUnitTotal" && currentExpression.get('operator')==">="){
                                                if(totalTermUnit>=currentExpression.get('value')){
                                                    if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }
                                            } else if(currentExpression.get('parameter')=="TermUnitTotal" && currentExpression.get('operator')=="<="){
                                                if(totalTermUnit<=currentExpression.get('value')){
                                                    if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }
                                            } else if(currentExpression.get('parameter')=="TermUnitTotal" && currentExpression.get('operator')==">"){
                                                if(totalTermUnit>currentExpression.get('value')){
                                                    if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }
                                            } else if(currentExpression.get('parameter')=="TermUnitTotal" && currentExpression.get('operator')=="<"){
                                                if(totalTermUnit<currentExpression.get('value')){
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
                                        console.log(studentCodes);
                                        studentCodes.push(self.get('store').peekRecord('assessmentCode', currentAssessmentCode.get('id')));
                                        console.log(studentCodes);
                                    }

                                }
                                
                                var index=0;
                                while(index!=-1){
                                    index=studentCodes.indexOf(null);
                                    if (index > -1) {
                                        studentCodes.splice(index, 1);
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
    departmentExport(type)
    {

        this.set('departmentsAdded', []);
        for(let i =0; i < this.get('departmentModel').get('length'); i++)
        {
            this.get('departmentsAdded').push(false);
        }
        console.log(this.get('departmentsAdded'));
        this.set('chosen', type);
        Ember.$('.ui.department.modal').modal('show');
    },
    programExport(type)
    {

        this.set('programsAdded', []);
        for(let i =0; i < this.get('programModel').get('length'); i++)
        {
            this.get('programsAdded').push(false);
        }
        console.log(this.get('programsAdded'));
        this.set('chosen', type);
        Ember.$('.ui.program.modal').modal('show');
    },
    cancelDepartment()
    {
        Ember.$('.ui.department.modal').modal('hide');
        
    },
    cancelProgram()
    {
        Ember.$('.ui.program.modal').modal('hide');
    },
    selectDepartmentToExport(id)
    {
        this.set('departmentsAdded', []);
        for(let i=0; i<this.get('departmentModel').get('length');i++)
        {
            let match = false;
            for(let j =0; j<id.length;j++)
            {
                if(i==id[j])
                {
                    match=true;
                }
            }
            this.get('departmentsAdded').push(match);
            
            
        }
        
        console.log(this.get('departmentsAdded'));
    },
    selectProgramToExport(id)
    {
        this.set('programsAdded', []);
        for(let i=0; i<this.get('programModel').get('length');i++)
        {
            let match = false;
            for(let j =0; j<id.length;j++)
            {
                if(i==id[j])
                {
                    match=true;
                }
            }
            this.get('programsAdded').push(match);
            
            
        }
        
        console.log(this.get('programsAdded'));
    },
    exportDepartment(thing)
    {
        if(thing)
        {
            this.set('departmentsAdded', []);
            for(let i =0; i < this.get('departmentModel').get('length'); i++)
            {
                this.get('departmentsAdded').push(true);
            }
            
        }
        if (this.get('chosen')){
            var doc = new jsPDF('p', 'pt');
            var header = function(data) {
                doc.setFontSize(20);
                doc.setTextColor(79, 38, 131);
                doc.setFontStyle('normal');
                //doc.addImage(headerImgData, 'JPEG', data.settings.margin.left, 20, 50, 50);
                doc.text("Adjudication By Department", data.settings.margin.left, 50);
            };
            var first=true;
            for(var i =0; i<this.get('departmentModel').get('length'); i++)
            {
                if(first)
                {
                    if(this.get('departmentsAdded').objectAt(i))
                    {
                        first=false;
                        var res = doc.autoTableHtmlToJson(this.$('#departments').find('#'+i)[0]);
                        doc.text(40, 70, this.get('departmentModel').objectAt(i).get('name'));
                        doc.autoTable(res.columns, res.data, {margin: {top: 80}, headerStyles: {fillColor: [79, 38, 131]}, addPageContent: header});
                    }
                }
                else
                {
                    if(this.get('departmentsAdded').objectAt(i))
                    {
                        var res = doc.autoTableHtmlToJson(this.$('#departments').find('#'+i)[0]);
                        doc.text(40, doc.autoTableEndPosY()+20, this.get('departmentModel').objectAt(i).get('name'));
                        var options = {
                            headerStyles: {fillColor: [79, 38, 131]},
                            margin: {
                            top: 80
                            },
                            startY: doc.autoTableEndPosY() + 30
                        };
                        doc.autoTable(res.columns, res.data, options);

                    }
                }
            }
            Ember.$('.ui.department.modal').modal('hide');
            doc.output("dataurlnewwindow");
        }
        else 
        {
                function extractContent(value){
                var div = document.createElement('div')
                div.innerHTML=value;
                var text= div.textContent;            
                return text;
            }
            var stuff= [];
            var options = [];
            var i =-1;
            var first=false;
            var self=this;
            for(let j=0; j<this.get('departmentGroups').get('length');j++){
                if(this.get('departmentsAdded').objectAt(j)){
                var data=[];
                
                $('#departments').find('#'+j+' tr').each(function() {
                    var row=[];
                    if(first)
                    {
                    
                    row.push(extractContent($(this).find(".info").html()));  
                    row.push(extractContent($(this).find(".id").html()));  
                    
                    row.push(extractContent($(this).find(".avg").html()));   
                    row.push(extractContent($(this).find(".termtotal").html()));   
                    row.push(extractContent($(this).find(".termPassed").html()));   
                    row.push(extractContent(extractContent($(this).find(".codes").html()).replace(/\s\s+/g, ' ')));   
                    data.push(row);
                }
                else 
                {
                    row=["Student Name","Student Number", "Term Average", "Term Units", "Term Units Recieved", "Assesment Codes"];
                    data.push(row);
                    first=true;
                    options.push(self.get('departmentModel').objectAt(j).get('name'));
                }
            });
            first=false;
            stuff.push(data);
                }
        }
        
        Ember.$('.ui.department.modal').modal('hide');
        this.get('myexport').export(stuff, options, "AdjudicationReportByDepartment.xlsx");
        }
    
    },
    exportProgram(thing)
    {
        if(thing)
        {
            this.set('programsAdded', []);
            for(let i =0; i < this.get('programModel').get('length'); i++)
            {
                this.get('programsAdded').push(true);
            }
            
        }
        if (this.get('chosen')){
        var doc = new jsPDF('p', 'pt');
        var header = function(data) {
            doc.setFontSize(20);
            doc.setTextColor(79, 38, 131);
            doc.setFontStyle('normal');
            //doc.addImage(headerImgData, 'JPEG', data.settings.margin.left, 20, 50, 50);
            doc.text("Adjudication By Program", data.settings.margin.left, 50);
        };
        var first=true;
        for(var i =0; i<this.get('programModel').get('length'); i++)
        {
            if(first)
            {
                if(this.get('programsAdded').objectAt(i))
                {
                    first=false;
                    var res = doc.autoTableHtmlToJson(this.$('#programs').find('#'+i)[0]);
                    doc.text(40, 70, this.get('programModel').objectAt(i).get('name'));
                    doc.autoTable(res.columns, res.data, {margin: {top: 80}, headerStyles: {fillColor: [79, 38, 131]}, addPageContent: header});
                }
            }
            else
            {
                if(this.get('programsAdded').objectAt(i))
                {
                    var res = doc.autoTableHtmlToJson(this.$('#programs').find('#'+i)[0]);
                    doc.text(40, doc.autoTableEndPosY()+20, this.get('programModel').objectAt(i).get('name'));
                    var options = {
                        headerStyles: {fillColor: [79, 38, 131]},
                        margin: {
                        top: 80
                        },
                        startY: doc.autoTableEndPosY() + 30
                    };
                    doc.autoTable(res.columns, res.data, options);

                }
            }
        }
        Ember.$('.ui.program.modal').modal('hide');
        doc.output("dataurlnewwindow");
    }
    else 
        {
                function extractContent(value){
                var div = document.createElement('div')
                div.innerHTML=value;
                var text= div.textContent;            
                return text;
            }
            var stuff= [];
            var options = [];
            var i =-1;
            var first=false;
            var self=this;
            for(let j=0; j<this.get('programGroups').get('length');j++){
                if(this.get('programsAdded').objectAt(j)){
                var data=[];
                
                $('#programs').find('#'+j+' tr').each(function() {
                    var row=[];
                    if(first)
                    {
                    
                    row.push(extractContent($(this).find(".info").html()));  
                    row.push(extractContent($(this).find(".id").html()));  
                    
                    row.push(extractContent($(this).find(".avg").html()));   
                    row.push(extractContent($(this).find(".termtotal").html()));   
                    row.push(extractContent($(this).find(".termPassed").html()));   
                    row.push(extractContent(extractContent($(this).find(".codes").html()).replace(/\s\s+/g, ' ')));   
                    data.push(row);
                }
                else 
                {
                    row=["Student Name","Student Number", "Term Average", "Term Units", "Term Units Recieved", "Assesment Codes"];
                    data.push(row);
                    first=true;
                    options.push(self.get('programModel').objectAt(j).get('name'));
                }
            });
            first=false;
            stuff.push(data);
                }
        }
        
        Ember.$('.ui.program.modal').modal('hide');
        this.get('myexport').export(stuff, options, "AdjudicationReportByProgram.xlsx");
        }
    },
    excelExport()
    {
        function extractContent(value){
            var div = document.createElement('div')
            div.innerHTML=value;
            var text= div.textContent;            
            return text;
        }
        var stuff= [];
        var first =false;
        var data=[];
        var options = ["All Students"];
        $('#studentTable tr').each(function() {
            var row=[];
            if(first)
            {
            row.push(extractContent($(this).find(".info").html()));  
            row.push(extractContent($(this).find(".id").html()));  
            
            row.push(extractContent($(this).find(".avg").html()));   
            row.push(extractContent($(this).find(".termtotal").html()));   
            row.push(extractContent($(this).find(".termPassed").html()));   
            row.push(extractContent(extractContent($(this).find(".codes").html()).replace(/\s\s+/g, ' ')));   
            data.push(row);
        }
        else 
        {
            row=["Student Name","Student Number", "Term Average", "Term Units", "Term Units Recieved", "Assesment Codes"];
            data.push(row);
            first=true;
        }
    });
    stuff.push(data);
        
        
   
   
   
   
    this.get('myexport').export(stuff, options, "AdjudicationReport.xlsx");
   
                
    },

    }
});


                    