import DS from 'ember-data';

export default DS.Model.extend({
  level: DS.attr(),
  source: DS.attr(),
  unit: DS.attr(),
  subject: DS.belongsTo('highschool-subject'),
  highschool: DS.belongsTo('highschool'),
  grade: DS.hasMany('highschool-grade')
});