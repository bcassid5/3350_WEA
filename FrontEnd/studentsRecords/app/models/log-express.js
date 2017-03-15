import DS from 'ember-data';

export default DS.Model.extend({
    boolExpress: DS.attr(),
    logicalLink: DS.hasMany("log-express"),
    parentLink: DS.belongsTo("log-express"),
    rule: DS.belongsTo("rule")
});
