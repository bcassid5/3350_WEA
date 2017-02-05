import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  gen: null,
  selectedDate: null,

  res: null,
  residencyModel: null,
  genderModel: null,

  init () {
    this._super(...arguments);
    var self = this;
    this.get('store').findAll('residency').then(function (records) {
      self.set('residencyModel', records);
    });
    this.get('store').findAll('gender').then(function (records) {
      self.set('genderModel', records);
    });
  },

  actions: {
    genderChange (newGen){
      console.log(newGen);
      this.set('gen', newGen);
      console.log(this.get('gen'));
    },

    dateChange (newDate){
      this.set('selectedDate', newDate);
    },

    resChange (newRes){
      console.log(newRes);
      this.set('res', newRes);
    },

    addNewRecord() {
      var myStore = this.get('store');
      var setGen = null;
      var setDate = new Date(this.get('selectedDate'));

      var setRes = this.get('store').peekRecord('residency', this.get('res'));
      var gend = this.get('store').peekRecord('gender', this.get('gen'));

      //logs
      //console.log(this.get('gen'));
      //console.log(this.get('res'));
      //console.log(this.get('selectedDate'));
      //console.log(setDate);

      //console.log("Res:" + setRes.id);
      //console.log("Gen:" + gend.id);
      console.log(gend.get('type'));
      if (gend.get('type') == 'Male') {
        setGen = "assets/studentsPhotos/male.png";
      } else if (gend.get('type') == 'Female') {
        setGen = "assets/studentsPhotos/female.png";
      } else {
        setGen = "assets/studentsPhotos/other.png";

      }

      //console.log(setGen);
      var newRecord = myStore.createRecord('student',{
        number: this.get('number'),
        firstName: this.get('firstName'),
        lastName: this.get('lastName'),
        gender: gend,
        DOB: setDate,
        photo: setGen,
        //resInfo: ,
        regComments: this.get('regComments'),
        BOA: this.get('BOA'),
        admissAvg: this.get('admissAvg'),
        admissComments: this.get('admissComments'),

      });
      //console.log(setGen);
      newRecord.save();
    }
  }
});
