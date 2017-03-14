import DS from 'ember-data';

export default DS.Model.extend({
    date: DS.attr("date"),
    termAVG: DS.attr("number"),
    termUnitPassed: DS.attr(),
    termUnitTotal: DS.attr(),
    note: DS.attr(),
    assessmentCode: DS.hasMany("assessmentCode")
});
