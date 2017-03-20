import Ember from 'ember';

export default Ember.Component.extend({
    
    store: Ember.inject.service(),

    termModel:null,
    studentModel:null,
    gradeModel:null,
    termCodeModel:null,
    courseCodeModel:null,        

    adjudicationTerm:null,

    limit:null,
    offset:null,
    pageSize:null,

    gradeSum:null,
    termAvg: null,

    init(){
        this._super(...arguments);
        var self = this;

        this.adjudicationTerm="";
        this.termAvg=0.0;
        this.gradeSum=0.0;

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
    },

    actions: {

        selectTerm(index){
            var term = this.get('termModel').objectAt(index).get('name');
            this.set('adjudicationTerm', term);
            console.log(term);
            console.log(this.get('adjudicationTerm'));
        },

        adjudicate(){
            if(this.get('adjudicationTerm')!=""){
                this.$("#adjudication").form('remove prompt', 'listname');

                for( var i=0;i<this.get('studentModel').get('length');i++){
                    var currentStudent = this.get('studentModel').objectAt(i);
                    this.get('store').query('termCode',{student: currentStudent.get('id')}).then(function(terms){
                        this.set('termCodeModel', terms);
                                                
                        this.set('gradeModel', []);
                        for(var i =0; i <this.get('termCodeModel').get('length'); i++){
                            this.get('store').query('grade',{term: self.get('termCodeModel').objectAt(i).get('id')}).then(function(grades){
                            this.get('gradeModel').addObjects(grades);
                        });
                        
                        }
                        
                    });
                }

            } else{
                this.$("#adjudication").form('add prompt', 'listname', 'error text');
            }
        }
    }
});
