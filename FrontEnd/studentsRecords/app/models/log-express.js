import DS from 'ember-data';

export default DS.Model.extend({
    boolExpress: DS.attr(),
    logicalLink: DS.attr(),
    assessmentCode: DS.belongsTo("assessmentCode")
});
