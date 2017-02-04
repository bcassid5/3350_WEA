import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  gen: 1,
  date: null,
  res: 1,

  actions: {
    genderChange (newGen){
      console.log(newGen);
      this.set('gen', newGen);
      console.log(this.get('gen'));
    },

    dateChange (newDate){
      this.set('date', newDate);
    },

    resChange (newRes){
      this.set('res', newRes);
    },

    addNewRecord() {
      var myStore = this.get('store');
      var setGen = null;

      //logs
      console.log(this.get('gen'));
      console.log(this.get('res'));

      if(this.get('gen')==1){
        setGen = "/assets/studentsPhotos/male.png";
      }
      else{
        setGen = "/assets/studentsPhotos/female.png";
      }

      var newRecord = myStore.createRecord('student',{
        number: this.get('number'),
        firstName: this.get('firstName'),
        lastName: this.get('lastName'),
        photo: setGen,

      });
      newRecord.save();
    }
  }
});
