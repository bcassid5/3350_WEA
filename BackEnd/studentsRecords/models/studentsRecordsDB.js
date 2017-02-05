var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var studentsSchema = mongoose.Schema(
    {
        number: String,
        firstName: String,
        lastName: String,
        gender: Number,
        DOB: Date,
        photo: String,
        resInfo: {type: mongoose.Schema.ObjectId, ref: 'Residencies'},

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
    }
);
var Students = mongoose.model('student', studentsSchema);
var Residencies = mongoose.model('residency', residencySchema);
var Genders = mongoose.model('gender', genderSchema);


mongoose.connect('mongodb://localhost/studentsRecords');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

    exports.Students = Students;
    exports.Residencies = Residencies;
    exports.Genders=Genders;

});



