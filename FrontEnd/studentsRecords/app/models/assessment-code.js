import DS from 'ember-data';

export default DS.Model.extend({
    code: DS.attr(),
    description: DS.attr(),
    adjudication: DS.hasMany("adjudication"),
    rule: DS.hasMany("rule")
});
