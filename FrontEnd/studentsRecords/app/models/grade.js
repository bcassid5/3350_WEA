import DS from 'ember-data';

export default DS.Model.extend({
    mark: DS.attr('number'),
    note: DS.attr('note'),
    programRecord: DS.belongsTo('program-Record'),
    student: DS.belongsTo('student'),
});
