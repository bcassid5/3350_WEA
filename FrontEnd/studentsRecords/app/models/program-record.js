import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.belongsTo('program'),
    level: DS.attr('number'),
    load: DS.attr(),
    status: DS.attr(),
    
    plan: DS.hasMany('plan-code'),
    semester: DS.belongsTo('term-code'),
    
});
