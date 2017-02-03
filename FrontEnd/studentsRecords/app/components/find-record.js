import Ember from 'ember';

export default Ember.Component.extend({

  store: Ember.inject.service(),
  notDONE: null,

  residencyModel: null,
  studentsRecords: null,
  firstIndex: 0,
  lastIndex: 0,
  finalIndex: 99,
  studentPhoto: null,
  limit: null,
  offset: null,
  pageSize: null,
  studentNumber: null,
  firstName: "",
  lastName: "",
  searchResults: [],
  showResults: null,

init() {
    this._super(...arguments);

    this.get('store').findAll('residency').then(function (records) {
      self.set('residencyModel', records);
    });

    this.set('limit', 100);
    this.set('offset', 0);
    this.set('pageSize', 99);
    this.set('finalIndex', 99);
    var self = this;
    this.get('store').query('student', {
      limit: self.get('limit'),
      offset: self.get('offset')
    }).then(function (records) {
      self.set('studentsRecords', records);
      self.set('firstIndex', records.indexOf(records.get("firstObject")));
      self.set('lastIndex', records.indexOf(records.get("lastObject")));
    });
  },

    actions: {
   
   search: function(){

     this.get('searchResults').clear();

     console.log(this.get('studentNumber')+"; "+this.get('firstName')+"; "+this.get('lastName'));


      if((this.get('studentNumber')!="")&&(this.get('firstName')!="")&&(this.get('lastName')!="")){
        for(var i=0;i<=(this.get('finalIndex'));i++){
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
        for(var i=0;i<=(this.get('finalIndex'));i++){
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
        for(var i=0;i<=(this.get('finalIndex'));i++){
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
        console.log('firstName + lastName search');
        for(var i=0;i<=(this.get('finalIndex'));i++){
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
        for(var i=0;i<=(this.get('finalIndex'));i++){
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
        for(var i=0;i<=(this.get('finalIndex'));i++){
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
        for(var i=0;i<=(this.get('finalIndex'));i++){
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
      console.log(this.get('searchResults'));

      this.set('showResults', true);

      //this.set('notDONE', false);
      Ember.$('.ui.modal').modal('hide');
      //Ember.$('.ui.modal').remove();
      Ember.$('.ui.modal').modal('show');
   },

   select: function(){

   },

    exit: function () {
      this.set('showResults', false);
      this.set('notDONE', false);
      Ember.$('.ui.modal').modal('hide');
      Ember.$('.ui.modal').remove();
    }
  },

  didRender() {
      Ember.$('.ui.modal')
        .modal({
         closable: false
        })
        .modal('show');
    }
});
