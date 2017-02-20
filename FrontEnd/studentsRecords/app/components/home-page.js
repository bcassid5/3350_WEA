import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement() {
//    Ember.$('.tabular.menu .item').tab();
    Ember.$(document).ready(function(){
      Ember.$('.ui .item').on('click', function() {
        Ember.$('.ui .item').removeClass('active');
        Ember.$(this).addClass('active');
      });
    });
  },





  isHomeShowing: true,
  isStudentsRecordsDataEntry: false,
  isAboutShowing: false,
  isAddShowing: false,
  isManageCodeShowing: false,
  isUploadShowing: false,

  actions: {
    home () {
      this.set('isHomeShowing', true);
      this.set('isStudentsRecordsDataEntry', false);
      this.set('isAboutShowing', false);
      this.set('isAddShowing', false);
      this.set('isManageCodeShowing', false);
      this.set('isUploadShowing', false);
    },

    studentsDataEntry (){
      this.set('isHomeShowing', false);
      this.set('isStudentsRecordsDataEntry', true);
      this.set('isAboutShowing', false);
      this.set('isAddShowing', false);
      this.set('isManageCodeShowing', false);
      this.set('isUploadShowing', false);
    },

    about (){
      this.set('isHomeShowing', false);
      this.set('isStudentsRecordsDataEntry', false);
      this.set('isAboutShowing', true);
      this.set('isAddShowing', false);
      this.set('isManageCodeShowing', false);
      this.set('isUploadShowing', false);
    },

    new (){
      this.set('isHomeShowing', false);
      this.set('isStudentsRecordsDataEntry', false);
      this.set('isAboutShowing', false);
      this.set('isAddShowing', true);
      this.set('isManageCodeShowing', false);
      this.set('isUploadShowing', false);
    },
    manageCode (){
      this.set('isHomeShowing', false);
      this.set('isStudentsRecordsDataEntry', false);
      this.set('isAboutShowing', false);
      this.set('isManageCodeShowing', true);
      this.set('isAddShowing', false);
      this.set('isUploadShowing', false);
    },
    uploadFile(){
      this.set('isHomeShowing', false);
      this.set('isStudentsRecordsDataEntry', false);
      this.set('isAboutShowing', false);
      this.set('isManageCodeShowing', false);
      this.set('isAddShowing', false);
      this.set('isUploadShowing', true);
    }
  }
});
