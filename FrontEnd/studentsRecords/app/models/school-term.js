import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr(),
    terms: DS.hasMany('term-code'),
});
