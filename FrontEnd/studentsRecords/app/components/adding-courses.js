import Ember from 'ember';

export default Ember.Component.extend({

    store: Ember.inject.service(),
    notDONE: true,
    currentStudent: null,
    highSchoolModel: null,

    init() {
        this._super(...arguments);
        this.get('store').findAll('highschool').then(function (records) {
            self.set('highSchoolModel', records);
        });
    },

actions:{
    exit: function () {
        this.set('notDONE', false);
        Ember.$('.ui.modal').modal('hide');
        Ember.$('.ui.modal').remove();
    },
    add: function(){
        

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
