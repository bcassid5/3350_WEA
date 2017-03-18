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
        advStanding: [{type: mongoose.Schema.ObjectId, ref: 'AdvStandings'}],
        regComments: String,
        BOA: String,
        admissAvg: Number,
        admissComments: String,
        highSchoolGrade: {type: mongoose.Schema.ObjectId, ref: 'HighSchoolGrades'},
        mark: [{type: mongoose.Schema.ObjectId, ref: 'Grades'}],
        awards: [{type: mongoose.Schema.ObjectId, ref: 'Awards'}],

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
        grade: String,
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
        course: {type:mongoose.Schema.ObjectId, ref: ('HighSchoolCourses')},
        student: {type:mongoose.Schema.ObjectId, ref: ('Students')}
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

var awardsSchema=mongoose.Schema(
    {
        note: String,
        student: {type: mongoose.Schema.ObjectId, ref: ('Students')}
    }
);
var Students = mongoose.model('student', studentsSchema);
var Residencies = mongoose.model('residency', residencySchema);
var Genders = mongoose.model('gender', genderSchema);
var AdvStandings = mongoose.model('advStanding', advStandingSchema);
var Awards = mongoose.model('awards', awardsSchema);

var adjudicationSchema=mongoose.Schema(
    {
        date: Date,
        termAVG: Number,
        termUnitPassed: String,
        termUnitTotal: String,
        note: String,
        assessmentCode: [{type: mongoose.Schema.ObjectId, ref:('AssessmentCodes')}]
    }
);
var facultySchema=mongoose.Schema(
    {
        name: String,
        department: [{type: mongoose.Schema.ObjectId, ref:('Departments')}]
    }
);
var assessmentCodeSchema=mongoose.Schema(
    {
        code: String,
        description: String,
        adjudication: {type: mongoose.Schema.ObjectId, ref:('Adjudications')},
        rule: [{type: mongoose.Schema.ObjectId, ref:('Rules')}]
    }
);
var departmentSchema = mongoose.Schema(
    {
        name: String,
        progAdmin: [{type: mongoose.Schema.ObjectId, ref:('ProgramAdministration')}],
        faculty: {type: mongoose.Schema.ObjectId, ref:('Faculties')},
        program: [{type: mongoose.Schema.ObjectId, ref:('Programs')}],
    }
);
var progAdminSchema=mongoose.Schema(
    {
        name: String,
        position: String,
        department: {type: mongoose.Schema.ObjectId, ref:('Departments')}
    }
);
var logExpressSchema = mongoose.Schema(
    {
        boolExpress: String,
        logicalLink: String,
        parentLink: String,
        rule:{type: mongoose.Schema.ObjectId, ref:("Rules")}
    }
);
var ruleSchema = mongoose.Schema(
    {
        description: String,
        logExpressions: [{type: mongoose.Schema.ObjectId, ref:('LogicalExpressions')}],
        assessmentCode: {type: mongoose.Schema.ObjectId, ref:('AssessmentCodes')}
    }
)
var Adjudications = mongoose.model('adjudication', adjudicationSchema);
var Faculties = mongoose.model('faculty', facultySchema);
var AssessmentCodes = mongoose.model('assessmentCode', assessmentCodeSchema);
var ProgramAdministrations = mongoose.model('progAdmin', progAdminSchema);
var Departments = mongoose.model('department', departmentSchema);
var LogicalExpressions = mongoose.model('logExpress', logExpressSchema);
var Rules = mongoose.model('rule', ruleSchema);

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
    exports.AdvStandings= AdvStandings;
    exports.Awards = Awards;
    exports.Adjudications = Adjudications;
    exports.Faculties = Faculties;
    exports.AssessmentCodes = AssessmentCodes;
    exports.ProgramAdministrations = ProgramAdministrations;
    exports.Departments = Departments;
    exports.LogicalExpressions = LogicalExpressions;
    exports.Rules = Rules;
});



