import DS from 'ember-data';

export default DS.Model.extend({
    courseLetter: DS.attr(),
    courseNumber: DS.attr(),
    name: DS.attr(),
    unit: DS.attr('number'),
    programRecord: DS.hasMany('program-record'),
});
