import DS from 'ember-data';

export default DS.Model.extend({
  number: DS.attr('number'),
  firstName: DS.attr(),
  lastName: DS.attr(),
  gender: DS.attr('number'),
  DOB: DS.attr('date'),
  photo: DS.attr(),

  resInfo: DS.belongsTo('residency'),
  regComments: DS.attr(),
  BOA: DS.attr(),
  admissAvg: DS.attr('number'),
  admissComments: DS.attr(),
  advStanding: DS.hasMany('adv-standing'),


});
