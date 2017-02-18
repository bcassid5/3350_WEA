import DS from 'ember-data';

export default DS.Model.extend({
  course: DS.attr(),
  description: DS.attr(),
  unit: DS.attr(),
  grade: DS.attr(),
  from: DS.attr(),
  students: DS.belongsTo('student')

});