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
        advStanding: {type: mongoose.Schema.ObjectId, ref: 'AdvancedStandings'},
        regComments: String,
        BOA: String,
        admissAvg: Number,
        admissComments: String,
        highSchoolGrade: {type: mongoose.Schema.ObjectId, ref: 'HighSchoolGrades'}

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
);

var highSchoolSubjectSchema = mongoose.Schema(
    {
        name: String,
        description: String,
        course: [{type:mongoose.Schema.ObjectId, ref: ('HighSchoolCourses')}]
    }
);

var highSchoolCourseSchema = mongoose.Schema(
    {
        level: String,
        subject: String,
        description: String,
        unit: String,
        source: String,
        highschool: {type:mongoose.Schema.ObjectId, ref: ('HighSchools')},
        subject: {type:mongoose.Schema.ObjectId, ref: ('HighSchoolSubjects')},
        grade: [{type:mongoose.Schema.ObjectId, ref: ('HighSchoolGrades')}]
    }
);

var highSchoolSchema= mongoose.Schema(
    {
        name: String,
        course: [{type:mongoose.Schema.ObjectId, ref: ('HighSchoolCourses')}]
    }
);

var highSchoolGradeSchema = mongoose.Schema(
    {
        grade: String,
        course: [{type:mongoose.Schema.ObjectId, ref: ('HighSchoolCourses')}],
        student: [{type:mongoose.Schema.ObjectId, ref: ('Students')}]
    }
);

var Students = mongoose.model('student', studentsSchema);
var Residencies = mongoose.model('residency', residencySchema);
var Genders = mongoose.model('gender', genderSchema);
var AdvancedStandings = mongoose.model('advStanding', advStandingSchema);
var HighSchoolSubjects = mongoose.model('highSchoolSubject', highSchoolSubjectSchema); 
var HighSchoolCourses = mongoose.model('highSchoolCourse', highSchoolCourseSchema);
var HighSchools = mongoose.model('highSchool', highSchoolSchema);
var HighSchoolGrades = mongoose.model('highSchoolGrade', highSchoolGradeSchema);

mongoose.connect('mongodb://localhost/studentsRecords');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

    exports.Students = Students;
    exports.Residencies = Residencies;
    exports.Genders=Genders;
    exports.AdvancedStandings= AdvancedStandings;
    exports.HighSchools = HighSchools;
    exports.HighSchoolSubjects = HighSchoolSubjects;
    exports.HighSchoolGrades = HighSchoolGrades;
    exports.HighSchoolCourses = HighSchoolCourses;

});



