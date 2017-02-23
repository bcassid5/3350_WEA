import DS from 'ember-data';

export default DS.Model.extend({
  grade: DS.attr(),
  course: DS.belongsTo('high-school-course'),
  student: DS.belongsTo('student')
});
