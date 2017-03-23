import Ember from 'ember';

export default Ember.Component.extend({

  notDONE: null,

  actions: {

    exit: function () {
      this.set('notDONE', false);
      Ember.$('.ui.all.modal').modal('hide');
      Ember.$('.ui.all.modal').remove();
    }
  },

  didRender() {
      Ember.$('.ui.all.modal')
        .modal({
         closable: false
        })
        .modal('hide').modal('show');
    }

});
