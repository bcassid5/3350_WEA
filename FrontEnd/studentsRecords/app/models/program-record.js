import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr(),
    level: DS.attr('number'),
    load: DS.attr(),
    status: DS.attr(),
    courseCode: DS.belongsTo('course-code'),
    planCode: DS.hasMany('plan-code'),
    termCode: DS.hasMany('term-code'),
    grade: DS.hasMany('grade'),
});
