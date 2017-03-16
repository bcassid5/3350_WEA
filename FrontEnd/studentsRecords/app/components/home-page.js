import Ember from 'ember';

export default Ember.Component.extend({
  routing: Ember.inject.service('-routing'),
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
  H: "item active",
  SR: "item",
  MC: "item",
  UD: "item",
  CR: "item",

  actions: {
    home () {
      this.set('isHomeShowing', true);
      this.set('isStudentsRecordsDataEntry', false);
      this.set('isAboutShowing', false);
      this.set('isAddShowing', false);
      this.set('isManageCodeShowing', false);
      this.set('isUploadShowing', false);
      this.set('H', 'item active');
      this.set('SR', 'item');
      this.set('MC', 'item');
      this.set('CR', 'item');
      this.set('UD', 'item');
    },

    studentsDataEntry (){
      this.set('isHomeShowing', false);
      this.set('isStudentsRecordsDataEntry', true);
      this.set('isAboutShowing', false);
      this.set('isAddShowing', false);
      this.set('isManageCodeShowing', false);
      this.set('isUploadShowing', false);
      this.set('H', 'item');
      this.set('SR', 'item active');
      this.set('MC', 'item');
      this.set('CR', 'item');
      this.set('UD', 'item');
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
      this.set('H', 'item');
      this.set('SR', 'item');
      this.set('MC', 'item');
      this.set('CR', 'item active');
      this.set('UD', 'item');
    },
    manageCode (){
      this.set('isHomeShowing', false);
      this.set('isStudentsRecordsDataEntry', false);
      this.set('isAboutShowing', false);
      this.set('isManageCodeShowing', true);
      this.set('isAddShowing', false);

      this.set('isUploadShowing', false);
      this.set('H', 'item');
      this.set('SR', 'item');
      this.set('MC', 'item active');
      this.set('CR', 'item');
      this.set('UD', 'item');
    },
    uploadFile(){
      this.set('isHomeShowing', false);
      this.set('isStudentsRecordsDataEntry', false);
      this.set('isAboutShowing', false);
      this.set('isManageCodeShowing', false);
      this.set('isAddShowing', false);
      this.set('isUploadShowing', true);
      this.set('H', 'item');
      this.set('SR', 'item');
      this.set('MC', 'item');
      this.set('CR', 'item');
      this.set('UD', 'item active');
    },

    
    addNewUser(){
      this.get('routing').transitionTo('add-user');
    },

  }
});
