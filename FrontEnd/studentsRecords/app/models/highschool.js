import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  course: DS.belongs('course')
});
