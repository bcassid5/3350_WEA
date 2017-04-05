import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  routing: Ember.inject.service('-routing'),
  isUsersShowing: false,
  isFeatureEditing: false,
  isRolesEditing: false,
  isHomeShowing: true,
  main: true,
  change: false,
  
  H: "item active",
  SR: "item",
  MC: "item",
  CR: "item",
  ADM01IsPermitted: Ember.computed(function(){ //Manage system roles
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("ADM01") >= 0);
    }
  }),

  didInsertElement() {
    Ember.$(document).ready(function(){
      Ember.$('.ui .item').on('click', function() {
        Ember.$('.ui .item').removeClass('active');
        Ember.$(this).addClass('active');
      });
    });
  },

  actions: {

    save(){
      var authentication = this.get('oudaAuth');
      var myStore = this.get('store');
      var userName = this.get('name');
      var hashedPassword = authentication.hash(this.get('firstPassword'));
      var self = this;
      myStore.queryRecord('password', {filter: {userName: userName}}).then(function (userShadow) {
        userShadow.set('encryptedPassword', hashedPassword);
        userShadow.set('passwordMustChanged', true);
        userShadow.set('passwordReset', false);
        userShadow.save().then(function () {
          self.get('oudaAuth').close();
            //alert("Password Changed");
            self.set('main', true);
            self.set('change', false);
          //self.get('routing').transitionTo('login');
        });
      });
    },

    mainPress(){
      this.set('main', true);
      this.set('change', false);
    },

    changePress(){
      this.set('main', false);
      this.set('change', true);
    },

    manageUsers () {
      this.set('isUsersShowing', true);
      this.set('isHomeShowing', false);
      this.set('isFeaturesEditing', false);
      this.set('isRolesEditing', false);
      
      this.set('H', 'item');
      this.set('SR', 'item active');
      this.set('MC', 'item');
      this.set('CR', 'item');

    },
    manageRoles (){
      this.set('isUsersShowing', false);
      this.set('isFeaturesEditing', false);
      this.set('isRolesEditing', true);
      this.set('isHomeShowing', false);
      
      this.set('H', 'item');
      this.set('SR', 'item');
      this.set('MC', 'item');
      this.set('CR', 'item active');
    },

    manageFeatures (){
      this.set('isUsersShowing', false);
      this.set('isFeaturesEditing', true);
      this.set('isRolesEditing', false);
      this.set('isHomeShowing', false);
      
      this.set('H', 'item');
      this.set('SR', 'item');
      this.set('MC', 'item active');
      this.set('CR', 'item');
    },
    home()
    {
      this.set('isUsersShowing', false);
      this.set('isFeaturesEditing', false);
      this.set('isRolesEditing', false);
      this.set('isHomeShowing', true);
      this.set('H', 'item active');
      
      this.set('SR', 'item');
      this.set('MC', 'item');
      this.set('CR', 'item');
      
    },
    
    exitAdmin(){
      this.get('routing').transitionTo('home');
    },


  }
});
