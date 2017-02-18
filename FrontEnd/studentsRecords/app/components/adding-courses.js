import Ember from 'ember';

export default Ember.Component.extend({

    store: Ember.inject.service(),
    notDONE: true,
    currentStudent: null,
    highSchoolModel: null,

    init() {
        this._super(...arguments);
        var self = this;
        this.get('store').findAll('highSchool').then(function (records) {
            self.set('highSchoolModel', records);
            console.log(records);
        });
        // var record = this.get('store').createRecord('highschool', {
        //     name: "St Clair Secondary School",
        //     course: [],
        // });
        // console.log(record.get('name'));
        // record.save();
        
    
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
