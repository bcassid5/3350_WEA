import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr(),
    availablePlans: DS.hasMany('plan-code'),
});
