import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr(),
    programRecord: DS.hasMany('program-record'),
});
