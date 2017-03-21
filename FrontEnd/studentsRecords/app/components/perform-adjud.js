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

    adjudicationTerm:null,

    limit:null,
    offset:null,
    pageSize:null,

    gradeSum:null,
    termAvg: null,
    totalTermUnit:null,
    passedTermUnit:null,
    date:null,

    init(){
        this._super(...arguments);
        var self = this;

        this.adjudicationTerm="";
        this.termAvg=0.0;
        this.gradeSum=0.0;
        this.gradeModel=[];
        this.termCodeModel=[];
        this.totalTermUnit=0;
        this.passedTermUnit=0;

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

                for(var i=0;i<this.get('studentModel').get('length');i++){
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

                                    console.log(self.get('totalTermUnit'));
                                    console.log(self.get('termAvg'));
                                    console.log(self.get('passedTermUnit'));
                                    console.log(self.get('date'));

                                    




                                    self.set('gradeModel', []);
                                    self.set('gradeSum', 0.0);
                                    self.set('totalTermUnit', 0);
                                    self.set('termAvg', 0.0);
                                    self.set('passedTermUnit', 0);

                                });
                            }
                        }

                    });
                }
            } else{
                this.$("#adjudication").form('add prompt', 'listname', 'error text');
            }
        }
    }
});
