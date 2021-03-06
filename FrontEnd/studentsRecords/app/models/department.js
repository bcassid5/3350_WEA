import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr(),
    progAdmin: DS.hasMany("progAdmin"),
    faculty: DS.belongsTo("faculty"),
    program: DS.hasMany("program")
});
