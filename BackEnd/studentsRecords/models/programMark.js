var mongoose = require('mongoose');

var gradeSchema = mongoose.Schema(
    {
        mark: Number,
        note: String,
        term: {type: mongoose.Schema.ObjectId, ref: 'TermCodes'},
        course: {type: mongoose.Schema.ObjectId, ref: 'CourseCodes'}
    }
);

var programRecordSchema = mongoose.Schema(
    {
        name: {type: mongoose.Schema.ObjectId, ref: 'Programs'},
        level: Number,
        load: String,
        status: String,
        
        semester: {type: mongoose.Schema.ObjectId, ref: 'TermCodes'},
        
        plan: [{type: mongoose.Schema.ObjectId, ref: 'PlanCodes'}],
    }
);
var programSchema = mongoose.Schema(
    {
        name: String,
        availablePlans: [{type: mongoose.Schema.ObjectId, ref: 'PlanCodes'}],
        department: {type: mongoose.Schema.ObjectId, ref: 'Departments'},
    }
);

var termCodeSchema = mongoose.Schema(
    {
        name: {type: mongoose.Schema.ObjectId, ref: 'SchoolTerms'},
        program: [{type: mongoose.Schema.ObjectId, ref: 'ProgramRecords'}],
        marks: [{type: mongoose.Schema.ObjectId, ref: 'Grades'}],
        student: {type: mongoose.Schema.ObjectId, ref: 'Students'}
    }
);
var schoolTermSchema = mongoose.Schema(
    {
        name: String,
        terms: [{type: mongoose.Schema.ObjectId, ref: 'Termcodes'}]
    }
);
var courseCodeSchema = mongoose.Schema(
    {
        courseLetter: String,
        courseNumber: String,
        name: String,
        unit: String,
        marks: [{type: mongoose.Schema.ObjectId, ref: 'Grades'}],
        
    }
);

var planCodeSchema = mongoose.Schema(
    {
        name: String,
        programRecords: [{type: mongoose.Schema.ObjectId, ref: 'ProgramRecords'}],
        availbleTo: [{type: mongoose.Schema.ObjectId, ref: 'Programs'}],
    }
);

var Grades = mongoose.model('grade', gradeSchema);
var ProgramRecords = mongoose.model('programRecord',programRecordSchema);
var TermCodes = mongoose.model('termCode', termCodeSchema);
var CourseCodes = mongoose.model('courseCode',courseCodeSchema);
var PlanCodes = mongoose.model('planCode', planCodeSchema);
var SchoolTerms = mongoose.model('schoolTerm', schoolTermSchema);
var Programs = mongoose.model('program', programSchema);

mongoose.connect('mongodb://localhost/studentsRecords');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

    exports.Grades = Grades;
    exports.ProgramRecords = ProgramRecords;
    exports.TermCodes = TermCodes;
    exports.CourseCodes = CourseCodes;
    exports.PlanCodes = PlanCodes;
    exports.SchoolTerms = SchoolTerms;
    exports.Programs = Programs;

});