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
      self.set('res', self.get('residencyModel').objectAt('0').get('id'));
  });

    this.get('store').findAll('gender').then(function (records) {
      self.set('genderModel', records);
      self.set('gen', self.get('genderModel').objectAt('0').get('id'));
  });
    self.set("selectedDate", new Date().toISOString().substring(0, 10));
    

    this.set('firstName', "");
    this.set('lastName', "");   

  },

  actions: {
    genderChange (newGen){
      this.set('gen', newGen);//this.get('genderModel').objectAt(newGen-1).get('id'));
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
      //console.log(this.get('firstName'));
      //console.log(this.get('gen'));
      //console.log(this.get('res'));
      //console.log(this.get('selectedDate'));
      //console.log(setDate);
      //console.log(setRes);
      /*
      console.log("Res id:" + setRes.id);
      console.log("Res name:" + setRes.get("name"));
      console.log("gen id:" + gend.id);
      console.log("Gen type:" + gend.get("type"));
      console.log(gend);
      console.log(setRes);*/
      
      if (gend.get('type') == 'Male') {
        setGen = "assets/studentsPhotos/male.png";
      } else if (gend.get('type') == 'Female') {
        setGen = "assets/studentsPhotos/female.png";
      } else {
        setGen = "assets/studentsPhotos/other.png";
      }

      //console.log(setGen);
      if(this.get('number')==null){
        alert('No Student Number!');
      }
      else if(this.get('firstName')==""){
        alert('No First Name!');
      }
      else if(this.get('lastName')==""){
        alert('No Last Name!');
      }
     
      else{
        var newRecord = myStore.createRecord('student',{
          number: this.get('number'),
          firstName: this.get('firstName'),
          lastName: this.get('lastName'),
          gender: gend,
          DOB: setDate,
          photo: setGen,
          resInfo: setRes,
          regComments: this.get('regComments'),
          BOA: this.get('BOA'),
          admissAvg: this.get('admissAvg'),
          admissComments: this.get('admissComments'),

        });
        //console.log(setGen);
        newRecord.save();
        alert('Saved Student!');
      }
    }
  }
});
