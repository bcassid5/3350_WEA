import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.belongsTo('school-term'),
    program: DS.hasMany('program-record'),
    marks: DS.hasMany('grade'),
    student: DS.belongsTo('student'),
});
