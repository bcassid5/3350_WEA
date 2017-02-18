import DS from 'ember-data';

export default DS.Model.extend({
    note: DS.attr(),
    student: DS.belongsTo('student')
});
