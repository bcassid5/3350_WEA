import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
   
  notDONE: null,

    exit: function () {
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
        .modal('hide').modal('show');
    }
});
