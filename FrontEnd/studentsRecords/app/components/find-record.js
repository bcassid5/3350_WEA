import Ember from 'ember';

export default Ember.Component.extend({

  store: Ember.inject.service(),
  notDONE: null,

  residencyModel: null,
  studentsRecords: null,
  firstIndex: 0,
  lastIndex: 0,
  //finalIndex: 99,
  studentPhoto: null,
  limit: null,
  offset: null,
  pageSize: null,
  studentNumber: null,
  firstName: "",
  lastName: "",
  searchResults: [],
  showResults: null,

  INDEX: null,
  FOUND: null,
  OFFSET: null,
  indexCancel: null,
  offsetCancel: null,

init() {
    this._super(...arguments);

    this.get('store').findAll('residency').then(function (records) {
      self.set('residencyModel', records);
    });

    this.set('limit', 10000000000);
    this.set('offset', 0);
    this.set('pageSize', 100000000);
    //this.set('finalIndex', 99);
    var self = this;
    this.get('store').query('student', {
      limit: self.get('limit'),
      offset: self.get('offset')
    }).then(function (records) {
      self.set('studentsRecords', records);
      self.set('firstIndex', records.indexOf(records.get("firstObject")));
      self.set('lastIndex', records.indexOf(records.get("lastObject")));
    });

    this.set('indexCancel', this.get('INDEX'));
    this.set('offsetCancel', this.get('OFFSET'));
  },

  actions: {
   
   search: function(){

     this.get('searchResults').clear();

      if((this.get('studentNumber')!="")&&(this.get('firstName')!="")&&(this.get('lastName')!="")){
        for(var i=0;i<(this.get('studentsRecords').content.length);i++){
          if((this.get('studentsRecords').content[i].record.data.firstName.toLowerCase().search(this.get('firstName').toLowerCase())>-1)
          &&(this.get('studentsRecords').content[i].record.data.lastName.toLowerCase().search(this.get('lastName').toLowerCase())>-1)
          &&(this.get('studentsRecords').content[i].record.data.number.toString().search(this.get('studentNumber').toString()))>-1){
            this.get('searchResults').push({
              DOB: this.get('studentsRecords').content[i].record.data.DOB,
              firstName: this.get('studentsRecords').content[i].record.data.firstName,
              gender: this.get('studentsRecords').content[i].record.data.gender,
              lastName: this.get('studentsRecords').content[i].record.data.lastName,
              number: this.get('studentsRecords').content[i].record.data.number,
              photo: this.get('studentsRecords').content[i].record.data.photo
            });
          }
        }
      } else if((this.get('firstName')!="")&&(this.get('studentNumber')!="")){
        for(var i=0;i<(this.get('studentsRecords').content.length);i++){
          if((this.get('studentsRecords').content[i].record.data.firstName.toLowerCase().search(this.get('firstName').toLowerCase())>-1)
          &&(this.get('studentsRecords').content[i].record.data.number.toString().search(this.get('studentNumber').toString()))>-1){
            this.get('searchResults').push({
              DOB: this.get('studentsRecords').content[i].record.data.DOB,
              firstName: this.get('studentsRecords').content[i].record.data.firstName,
              gender: this.get('studentsRecords').content[i].record.data.gender,
              lastName: this.get('studentsRecords').content[i].record.data.lastName,
              number: this.get('studentsRecords').content[i].record.data.number,
              photo: this.get('studentsRecords').content[i].record.data.photo
            });
          }
        }
      } else if((this.get('lastName')!="")&&(this.get('studentNumber')!="")){
        for(var i=0;i<(this.get('studentsRecords').content.length);i++){
          if((this.get('studentsRecords').content[i].record.data.lastName.toLowerCase().search(this.get('lastName').toLowerCase())>-1)
          &&(this.get('studentsRecords').content[i].record.data.number.toString().search(this.get('studentNumber').toString()))>-1){
            this.get('searchResults').push({
              DOB: this.get('studentsRecords').content[i].record.data.DOB,
              firstName: this.get('studentsRecords').content[i].record.data.firstName,
              gender: this.get('studentsRecords').content[i].record.data.gender,
              lastName: this.get('studentsRecords').content[i].record.data.lastName,
              number: this.get('studentsRecords').content[i].record.data.number,
              photo: this.get('studentsRecords').content[i].record.data.photo
            });
          }
        }
      } else if((this.get('firstName')!="")&&(this.get('lastName')!="")){
        for(var i=0;i<(this.get('studentsRecords').content.length);i++){
          if((this.get('studentsRecords').content[i].record.data.firstName.toLowerCase().search(this.get('firstName').toLowerCase())>-1)
          &&(this.get('studentsRecords').content[i].record.data.lastName.toLowerCase().search(this.get('lastName').toLowerCase())>-1)){
            this.get('searchResults').push({
              DOB: this.get('studentsRecords').content[i].record.data.DOB,
              firstName: this.get('studentsRecords').content[i].record.data.firstName,
              gender: this.get('studentsRecords').content[i].record.data.gender,
              lastName: this.get('studentsRecords').content[i].record.data.lastName,
              number: this.get('studentsRecords').content[i].record.data.number,
              photo: this.get('studentsRecords').content[i].record.data.photo
            });
          }
        }
      } else if(this.get('studentNumber')!=""){
        for(var i=0;i<(this.get('studentsRecords').content.length);i++){
          if(this.get('studentsRecords').content[i].record.data.number.toString().search(this.get('studentNumber').toString())>-1){
            this.get('searchResults').push({
              DOB: this.get('studentsRecords').content[i].record.data.DOB,
              firstName: this.get('studentsRecords').content[i].record.data.firstName,
              gender: this.get('studentsRecords').content[i].record.data.gender,
              lastName: this.get('studentsRecords').content[i].record.data.lastName,
              number: this.get('studentsRecords').content[i].record.data.number,
              photo: this.get('studentsRecords').content[i].record.data.photo
            });
          }
        }
      } else if(this.get('firstName')!=""){
        for(var i=0;i<(this.get('studentsRecords').content.length);i++){
          if(this.get('studentsRecords').content[i].record.data.firstName.toLowerCase().search(this.get('firstName').toLowerCase())>-1){
            this.get('searchResults').push({
              DOB: this.get('studentsRecords').content[i].record.data.DOB,
              firstName: this.get('studentsRecords').content[i].record.data.firstName,
              gender: this.get('studentsRecords').content[i].record.data.gender,
              lastName: this.get('studentsRecords').content[i].record.data.lastName,
              number: this.get('studentsRecords').content[i].record.data.number,
              photo: this.get('studentsRecords').content[i].record.data.photo
            });
          }
        }
      } else if(this.get('lastName')!=""){
        for(var i=0;i<(this.get('studentsRecords').content.length);i++){
          if(this.get('studentsRecords').content[i].record.data.lastName.toLowerCase().search(this.get('lastName').toLowerCase())>-1){
            this.get('searchResults').push({
              DOB: this.get('studentsRecords').content[i].record.data.DOB,
              firstName: this.get('studentsRecords').content[i].record.data.firstName,
              gender: this.get('studentsRecords').content[i].record.data.gender,
              lastName: this.get('studentsRecords').content[i].record.data.lastName,
              number: this.get('studentsRecords').content[i].record.data.number,
              photo: this.get('studentsRecords').content[i].record.data.photo
            });
          }
        }
      }

      if(this.get('searchResults').length!=0){
        this.set('showResults', true);
      }

      //this.set('notDONE', false);
      Ember.$('.ui.search.modal').modal('hide');
      //Ember.$('.ui.search.modal').remove();
      Ember.$('.ui.search.modal').modal('show');
   },

   select: function(student){

     var index = -1;

     var found = false;


     for(var i=0;i<(this.get('studentsRecords').content.length);i++){
          if((this.get('studentsRecords').content[i].record.data.lastName==student.lastName)
          && (this.get('studentsRecords').content[i].record.data.firstName==student.firstName)
          && (this.get('studentsRecords').content[i].record.data.DOB==student.DOB)
          &&(this.get('studentsRecords').content[i].record.data.gender==student.gender)
          && (this.get('studentsRecords').content[i].record.data.number==student.number)
          &&(this.get('studentsRecords').content[i].record.data.photo==student.photo)){
            index=i;
            found=true;
          }
          if(found){
            i=this.get('studentsRecords').content.length;
          }
        }
     
     if(found){
       this.set('FOUND', found);
       var offset = (parseInt((index/10)))*10;
       var currentIndex = index%10;
       this.set('INDEX', currentIndex);
       if(offset<0){
         this.set('OFFSET', 0);
       }else{
         this.set('OFFSET', offset);
      }
     }
      
   },

    exit: function () {
      this.set('showResults', false);
      this.set('notDONE', false);
      Ember.$('.ui.search.modal').modal('hide');
      Ember.$('.ui.search.modal').remove();
    },

    remove: function () {
      this.set('showResults', false);
      this.set('FOUND', true);
      this.set('OFFSET', this.get('offsetCancel'));
      this.set('INDEX', this.get('indexCancel'));
      this.set('notDONE', false);
      Ember.$('.ui.search.modal').modal('hide');
      Ember.$('.ui.search.modal').remove();
    }
  },

  didRender() {
      Ember.$('.ui.search.modal')
        .modal({
         closable: false
        })
        .modal('show');
    }
});
