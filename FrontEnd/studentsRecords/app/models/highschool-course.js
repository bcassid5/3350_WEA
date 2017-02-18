import DS from 'ember-data';

export default DS.Model.extend({
  level: DS.attr(),
  source: DS.attr(),
  unit: DS.attr(),
  subject: DS.hasMany('highschool-subject'),
  highschool: DS.hasMany('highschool'),
  grade: DS.belongsTo('highschool-grade')
});