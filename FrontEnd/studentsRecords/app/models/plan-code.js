import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr(),
    programRecords: DS.hasMany('program-record'),
    availableTo: DS.hasMany('program'),
});
