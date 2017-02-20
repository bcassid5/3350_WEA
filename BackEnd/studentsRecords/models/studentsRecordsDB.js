var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var studentsSchema = mongoose.Schema(
    {
        number: String,
        firstName: String,
        lastName: String,
        gender: {type: mongoose.Schema.ObjectId, ref: 'Genders'},
        DOB: Date,
        photo: String,
        resInfo: {type: mongoose.Schema.ObjectId, ref: 'Residencies'},
        advStanding: [{type: mongoose.Schema.ObjectId, ref: 'AdvancedStandings'}],
        regComments: String,
        BOA: String,
        admissAvg: Number,
        admissComments: String,

    }
);
studentsSchema.plugin(mongoosePaginate);

var residencySchema = mongoose.Schema(
    {
        name: String,
        students: [{type: mongoose.Schema.ObjectId, ref: ('Students')}]
    }
);

var genderSchema = mongoose.Schema(
    {
        type: String,
        students: [{type: mongoose.Schema.ObjectId, ref: ('Students')}]
    }
);

var advStandingSchema = mongoose.Schema(
    {
        course: String,
        description: String,
        unit: Number,
        grade: Number,
        from: String,
        students: {type: mongoose.Schema.ObjectId, ref: ('Students')}
    }
)
var Students = mongoose.model('student', studentsSchema);
var Residencies = mongoose.model('residency', residencySchema);
var Genders = mongoose.model('gender', genderSchema);
var AdvancedStandings = mongoose.model('advStanding', advStandingSchema);



mongoose.connect('mongodb://localhost/studentsRecords');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

    exports.Students = Students;
    exports.Residencies = Residencies;
    exports.Genders=Genders;
    exports.AdvancedStandings= AdvancedStandings;


});



