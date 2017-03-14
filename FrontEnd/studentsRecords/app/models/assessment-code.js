import DS from 'ember-data';

export default DS.Model.extend({
    code: DS.attr(),
    name: DS.attr(),
    faculty: DS.hasMany("faculty"),
    adjudication: DS.belongsTo("adjudication"),
    logExpress: DS.hasMany("logExpress")
});
