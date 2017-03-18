import DS from 'ember-data';

export default DS.Model.extend({
    boolExpress: DS.attr(),
    rule: DS.hasMany("rule")
});
