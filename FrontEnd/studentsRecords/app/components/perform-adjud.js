import Ember from 'ember';

export default Ember.Component.extend({
    
    store: Ember.inject.service(),

    termModel:null,
    studentModel:null,
    gradeModel:null,
    termCodeModel:null,
    courseCodeModel:null,  
    logExpModel: null,    
    ruleModel: null,  
    codeModel: null,
    adjudicationModel:null,

    adjudicationTerm:null,
    adjudicationTermToView:null,

    limit:null,
    offset:null,
    pageSize:null,
    showResults:null,
    
    progress:null,
    chosen: null,
    departmentModel: null,
    programModel: null,
    isNone: true,
    isDepartment:false,
    isProgram: false,
    departmentGroups: [],
    programGroups: [],
    departmentsAdded: [],
    programsAdded: [],
    numberData: null,
    numberData2: null,
    numberData3: null,
    numberData4: null,
    numberData5: null,
    numberData6: null,
    numberData7:null,
    numberData8:null,
    numberData9:null,
    numberData10:null,
    ifNoneStat: null,
    selectedDepartment:null,
    selectedProgram:null,
    baroptions4:null,
    baroptions5:null,
    baroptions7:null,
    baroptions8:null,
    baroptions9:{
                title: {
                    display: true,
                    fontSize: 16,
                    fontStle:"bold",
                    fontColor:"#101",
                    text: 'Students per Program'
                },
                legend: {
                    display: true,
                    
                },
                
            },
    baroptions10:{
                title: {
                    display: true,
                    fontSize: 16,
                    fontStle:"bold",
                    fontColor:"#101",
                    text: 'Students per Department'
                },
                legend: {
                    display: true,
                    
                },
                
            },
    baroptions2:{
                title: {
                    display: true,
                    fontSize: 16,
                    fontStle:"bold",
                    fontColor:"#101",
                    text: 'Students per Department'
                },
                legend: {
                    display: true,
                    
                },
                
            },
    baroptions3:{
                title: {
                    display: true,
                    fontSize: 16,
                    fontStle:"bold",
                    fontColor:"#101",
                    text: 'Students per Program'
                },
                legend: {
                    display: true,
                    
                },
                
            },
    baroptions6: null,
    baroptions: {
                title: {
                    display: true,
                    fontSize: 16,
                    fontStle:"bold",
                    fontColor:"#101",
                    text: 'Students per Assestment Code'
                },
                legend: {
                    display: false,
                },
                scales: {
                    yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Students',
                        
                    },
                    ticks: {
                            suggestedMin: 0,
                            fixedStepSize: 1,
                        }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Assesment Code'
                    }
                    }]
                }
            },
    GRS01IsPermitted: Ember.computed(function(){ //Manage system roles
        var authentication = this.get('oudaAuth');
        if (authentication.getName === "Root") {
        return true;
        } else {
        return (authentication.get('userCList').indexOf("GRS01") >= 0);
        }
    }),
    ASR02IsPermitted: Ember.computed(function(){ //Manage system roles
        var authentication = this.get('oudaAuth');
        if (authentication.getName === "Root") {
        return true;
        } else {
        return (authentication.get('userCList').indexOf("ASR02") >= 0);
        }
    }),
    moveProgress: Ember.observer('progress', function(){
        this.rerender();
        this.$('#progBar').progress('set percent', this.get("progress"));
    }),
    
    init(){
        this._super(...arguments);
        var self = this;
        this.ifNoneStat=false;
        this.adjudicationTerm="";
        this.adjudicationTermToView="";
        this.gradeModel=[];
        this.showResults=false;
        this.progress=0.0;
        this.isNone=true;
        this.isDepartment=false;
        this.isProgram=false;
        this.departmentGroups=[],
        this.programGroups=[],
        this.chosen=false;
        this.selectedDepartment=null;
        this.selectedProgram=null;
        
        this.get('store').findAll('schoolTerm').then(function (records) {
           self.set('termModel', records);
        });
        this.get('store').findAll('termCode').then(function(records){
            //console.log(records);
            self.set('termCodeModel', records);
            //console.log(self.get('termCodeModel'));
        });
        this.get('store').findAll('courseCode').then(function(records){
            self.set('courseCodeModel', records);
        });
        this.get('store').findAll('grade').then(function(records){
            self.set('gradeModel', records);
        });
        this.set('limit', 10000000000);
        this.set('offset', 0);
        this.set('pageSize', 100000000);
        this.get('store').query('student', {
            limit: self.get('limit'),
            offset: self.get('offset')
        }).then(function (records) {
            self.set('studentModel', records);
        });

        this.get('store').findAll('logExpress').then(function(records){
            self.set('logExpModel', records);
        });

        this.get('store').findAll('rule').then(function(records){
            self.set('ruleModel', records);
        });

        this.get('store').findAll('assessmentCode').then(function(records){
            self.set('codeModel', records);
        });
        //this.get('store').query('student',{department: "58d2a553a3ddd62848d60587"}).then(function(grades){
      //           console.log(grades.get('length'));
      //           self.get('store').query('student',{program: self.get('programModel').objectAt(0).get('id')}).then(function(grades2){
      //           console.log(grades2.get('length'));
      //      });
      //      });
        this.get('store').findAll('department').then(function(records){
            self.set('departmentModel', records);
            //console.log(self.get('departmentModel').get('length'));
            for (var i =0;i<self.get('departmentModel').get('length');i++)
            {
               
                self.get('store').query('student',{department: self.get('departmentModel').objectAt(i).get('id')}).then(function(grades){
                
                self.get('departmentGroups').push(grades);
                
           });
           
            }
        });
        this.get('store').findAll('adjudication').then(function(records){
            self.set('adjudicationModel', records);
        });
        this.get('store').findAll('program').then(function (records) {
           self.set('programModel', records);
           for (var i =0;i<self.get('programModel').get('length');i++)
            {
                self.get('store').query('student',{program: self.get('programModel').objectAt(i).get('id')}).then(function(grades){
                
                self.get('programGroups').push(grades);
                
           });
           
            }
        });
        
    },

    didRender(){
        Ember.$('.menu .item').tab();
        var self = this;
        this.$('#progBar').progress('set percent', self.get("progress"));
    },
    actions: {
        noneSelected(){
            
            this.set('isDepartment', false);
            this.set('isProgram', false);
            this.set("isNone", true);
            this.set('ifNoneStat', false);
        },
        programSelected(){
            this.set('isDepartment', false);
            this.set('isProgram', true);
            this.set("isNone", false);
            this.set('ifNoneStat', false);
        },
        departmentSelected(){
            this.set('isDepartment', true);
            this.set('isProgram', false);
            this.set("isNone", false);
            this.set('ifNoneStat', false);
        },
        displayStatistics()
        {
            function extractContent(value){
                var div = document.createElement('div')
                div.innerHTML=value;
                var text= div.textContent;            
                return text;
            }
            function rainbow(numOfSteps, step) {
                
                var r, g, b;
                var h = step / numOfSteps;
                var i = ~~(h * 6);
                var f = h * 6 - i;
                var q = 1 - f;
                switch(i % 6){
                    case 0: r = 1; g = f; b = 0; break;
                    case 1: r = q; g = 1; b = 0; break;
                    case 2: r = 0; g = 1; b = f; break;
                    case 3: r = 0; g = q; b = 1; break;
                    case 4: r = f; g = 0; b = 1; break;
                    case 5: r = 1; g = 0; b = q; break;
                }
                var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
                return (c);
            }
            if(!this.get('ifNoneStat'))
            {
                var counts =[];
                    var names=[]
                    for(let i =0;i<this.get('codeModel').get('length');i++)
                    {
                        counts.push(0);
                        names.push(this.get('codeModel').objectAt(i).get('code'));
                    }
                    
                    
                    
                    var first=true;
                    $('#studentTable tr').each(function() {
                        if(!first)
                        {
                            var codes = extractContent($(this).find(".codes").html().replace(/\s\s+/g, '').replace(/<br>/g,"|")).split("|");
                            for(let j=0;j<codes.length;j++)
                            {
                                for(let k=0;k<names.length;k++)
                                {
                                    if(codes[j]==names[k])
                                    {
                                        counts[k]++;
                                    }
                                }
                            }
                            
                        }
                        else{
                        first=false;
                    }
                    
                });
                var max =0;
                    for (let i =0;i<counts.length;i++)
                    {
                        if(counts[i]>max)
                        {
                            max=counts[i];
                        }
                    }
                    this.set('baroptions', {
                title: {
                    display: true,
                    fontSize: 16,
                    fontStle:"bold",
                    fontColor:"#101",
                    text: 'Students per Assestment Code'
                },
                legend: {
                    display: false,
                },
                scales: {
                    yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Number of Students',
                        
                    },
                    ticks: {
                            suggestedMin: 0,
                            suggestedMax: max+2,
                            fixedStepSize: 1,
                        }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Assesment Code'
                    }
                    }]
                }
            });
                    this.set('numberData', {
                    labels: names,
                    datasets: [
                        {
                            backgroundColor: "rgba(0,0,128,.9)",
                            borderWidth: 1,
                            data: counts,
                        }
                    ]
                    
                });
                counts=[];
                names=[];
                var colors = [];
                
                for(let i =0;i<this.get('departmentModel').get('length');i++)
                    {
                        var count=0;
                        first=true;
                        $('#departments2').find('#'+i+' tr').each(function() {
                            if(!first)
                                {
                                    count++;
                                    
                                }
                                else{
                                first=false;
                            }
                        });
                        counts[i]=count;
                        colors.push(rainbow(this.get('departmentModel').get('length'),i+1));
                        names.push(this.get('departmentModel').objectAt(i).get('name'));
                    }
                    
                    this.set('numberData2', {
                    labels: names,
                    datasets: [
                        {
                            backgroundColor: colors,
                            
                            data: counts,
                        }
                    ]
                    
                });
                counts=[];
                names=[];
                colors=[];
                
                for(let i =0;i<this.get('programModel').get('length');i++)
                    {
                        var count=0;
                        first=true;
                        $('#programs2').find('#'+i+' tr').each(function() {
                            if(!first)
                                {
                                    count++;
                                    
                                }
                                else{
                                first=false;
                            }
                        });
                        counts[i]=count;
                        colors.push(rainbow(this.get('programModel').get('length'),i+1));
                        names.push(this.get('programModel').objectAt(i).get('name'));
                    }
                    this.set('numberData3', {
                    labels: names,
                    datasets: [
                        {
                            backgroundColor: colors,
                            
                            data: counts,
                        }
                    ]
                    
                });
                counts=[];
                names=[];
                colors=[];
                for(let i =0;i<7;i++)
                {
                    counts.push(0);
                    
                }
                names.push("Under 40");
                names.push("40-50");
                names.push("50-60");
                names.push("60-70");
                names.push("70-80");
                names.push("80-90");
                names.push("90+");
                first=true;
                $('#studentTable tr').each(function() {
                        if(!first)
                        {
                            var grades = extractContent($(this).find(".avg").html());
                            
                            
                               if(grades<40)
                               {
                                    counts[0]++;
                               }
                               else if(grades>=40 && grades<50)
                               {
                                    counts[1]++;
                               }
                               else if(grades>=50 && grades<60)
                               {
                                   counts[2]++;
                               }
                               else if(grades>=60 && grades<70)
                               {
                                   counts[3]++;
                               }
                               else if(grades>=70 && grades<80)
                               {
                                   counts[4]++;
                               }
                               else if(grades>=80 && grades<90)
                               {
                                   counts[5]++;
                               }
                               else if(grades>=90)
                               {
                                   counts[6]++;
                               }
                        }
                        else{
                        first=false;
                    }
                    
                });
                 max =0;
                    for (let i =0;i<counts.length;i++)
                    {
                        if(counts[i]>max)
                        {
                            max=counts[i];
                        }
                    }
                    this.set('baroptions6', {
                title: {
                    display: true,
                    fontSize: 16,
                    fontStle:"bold",
                    fontColor:"#101",
                    text: 'Student Grade Distribution'
                },
                legend: {
                    display: false,
                },
                scales: {
                    yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Number of Students',
                        
                    },
                    ticks: {
                            suggestedMin: 0,
                            suggestedMax: max+2,
                            fixedStepSize: 1,
                        }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Grade Range'
                    }
                    }]
                }
            });
                    this.set('numberData6', {
                    labels: names,
                    datasets: [
                        {
                            backgroundColor: "rgba(0,0,128,.9)",
                            borderWidth: 1,
                            data: counts,
                        }
                    ]
                    
                });
                this.set('ifNoneStat', !(this.get('ifNoneStat')));
            }
        },
        displayStatistics2()
        {
            
            if(this.get('ifNoneStat'))
            {
                this.set('ifNoneStat', !(this.get('ifNoneStat')));
            }
            if(!this.get('ifNoneStat') && this.get('selectedDepartment')!=null)
            {
                
                var counts =[];
                    var names=[]
                    for(let i =0;i<this.get('codeModel').get('length');i++)
                    {
                        counts.push(0);
                        names.push(this.get('codeModel').objectAt(i).get('code'));
                    }
                    var first=true;
                 $('#departments').find('#'+this.get('selectedDepartment')+' tr').each(function() {
                     if(!first)
                        {
                            var codes = extractContent($(this).find(".codes").html().replace(/\s\s+/g, '').replace(/<br>/g,"|")).split("|");
                            for(let j=0;j<codes.length;j++)
                            {
                                for(let k=0;k<names.length;k++)
                                {
                                    if(codes[j]==names[k])
                                    {
                                        counts[k]++;
                                    }
                                }
                            }
                            
                        }
                        else{
                        first=false;
                    }
                 });
                 var max =0;
                    for (let i =0;i<counts.length;i++)
                    {
                        if(counts[i]>max)
                        {
                            max=counts[i];
                        }
                    }
                    this.set('baroptions4', {
                title: {
                    display: true,
                    fontSize: 16,
                    fontStle:"bold",
                    fontColor:"#101",
                    text: 'Students per Assestment Code in '+this.get('departmentModel').objectAt(this.get('selectedDepartment')).get('name')
                },
                legend: {
                    display: false,
                },
                scales: {
                    yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Number of Students',
                        
                    },
                    ticks: {
                            suggestedMin: 0,
                            suggestedMax: max+2,
                            fixedStepSize: 1,
                        }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Assesment Code'
                    }
                    }]
                }
            });
                    this.set('numberData4', {
                    labels: names,
                    datasets: [
                        {
                            backgroundColor: "rgba(0,0,128,.9)",
                            borderWidth: 1,
                            data: counts,
                        }
                    ]
                    
                });
                counts=[];
                names=[];
                var colors=[];
                for(let i =0;i<7;i++)
                {
                    counts.push(0);
                    
                }
                names.push("Under 40");
                names.push("40-50");
                names.push("50-60");
                names.push("60-70");
                names.push("70-80");
                names.push("80-90");
                names.push("90+");
                
                    first=true;
                    $('#departments').find('#'+this.get('selectedDepartment')+' tr').each(function() {
                     if(!first)
                        {
                            var grades = extractContent($(this).find(".avg").html());
                               if(grades<40)
                               {
                                    counts[0]++;
                               }
                               else if(grades>=40 && grades<50)
                               {
                                    counts[1]++;
                               }
                               else if(grades>=50 && grades<60)
                               {
                                   counts[2]++;
                               }
                               else if(grades>=60 && grades<70)
                               {
                                   counts[3]++;
                               }
                               else if(grades>=70 && grades<80)
                               {
                                   counts[4]++;
                               }
                               else if(grades>=80 && grades<90)
                               {
                                   counts[5]++;
                               }
                               else if(grades>=90)
                               {
                                   counts[6]++;
                               }
                        }
                        else{
                        first=false;
                    }
                 });
                  max =0;
                    for (let i =0;i<counts.length;i++)
                    {
                        if(counts[i]>max)
                        {
                            max=counts[i];
                        }
                    }
                    this.set('baroptions7', {
                title: {
                    display: true,
                    fontSize: 16,
                    fontStle:"bold",
                    fontColor:"#101",
                    text: 'Student Grade Distribution for ' +this.get('departmentModel').objectAt(this.get('selectedDepartment')).get('name')
                },
                legend: {
                    display: false,
                },
                scales: {
                    yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Number of Students',
                        
                    },
                    ticks: {
                            suggestedMin: 0,
                            suggestedMax: max+2,
                            fixedStepSize: 1,
                        }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Grade Range'
                    }
                    }]
                }
            });
                    this.set('numberData7', {
                    labels: names,
                    datasets: [
                        {
                            backgroundColor: "rgba(0,0,128,.9)",
                            borderWidth: 1,
                            data: counts,
                        }
                    ]
                    
                });
                 counts =[];
                names=[];
                colors=[];
                    for(let i =0;i<this.get('programModel').get('length');i++)
                    {
                        counts.push(0);
                        names.push(this.get('programModel').objectAt(i).get('name'));
                        colors.push(rainbow(this.get('programModel').get('length'),i+1));
                    }
                    
                    
                    
                    first=true;
                    $('#departments').find('#'+this.get('selectedDepartment')+' tr').each(function() {
                        if(!first)
                        {
                            var codes = $(this).find(".grams").html().replace(/\s\s+/g, '').replace(/<!---->/g, "").replace(/(?:\r\n|\r|\n)/g, '').replace(/<br>/g,"|").split("|");
                            
                            
                            for(let j=0;j<codes.length;j++)
                            {
                                for(let k=0;k<names.length;k++)
                                {
                                    if(codes[j]==names[k])
                                    {
                                        counts[k]++;
                                    }
                                }
                            }
                            
                        }
                        else{
                        first=false;
                    }
                    
                });
                this.set('baroptions9',{
                title: {
                    display: true,
                    fontSize: 16,
                    fontStle:"bold",
                    fontColor:"#101",
                    text: 'Students per Program in '+this.get('departmentModel').objectAt(this.get('selectedDepartment')).get('name')
                },
                legend: {
                    display: true,
                    
                },
                
            });
                this.set('numberData9', {
                    labels: names,
                    datasets: [
                        {
                            backgroundColor: colors,
                            
                            data: counts,
                        }
                    ]
                    
                });
               this.set('ifNoneStat', !(this.get('ifNoneStat'))); 
            }
            function extractContent(value){
                var div = document.createElement('div')
                div.innerHTML=value;
                var text= div.textContent;            
                return text;
            }
            function rainbow(numOfSteps, step) {
                
                var r, g, b;
                var h = step / numOfSteps;
                var i = ~~(h * 6);
                var f = h * 6 - i;
                var q = 1 - f;
                switch(i % 6){
                    case 0: r = 1; g = f; b = 0; break;
                    case 1: r = q; g = 1; b = 0; break;
                    case 2: r = 0; g = 1; b = f; break;
                    case 3: r = 0; g = q; b = 1; break;
                    case 4: r = f; g = 0; b = 1; break;
                    case 5: r = 1; g = 0; b = q; break;
                }
                var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
                return (c);
            }
        },
        displayStatistics3()
        {
            
            if(this.get('ifNoneStat'))
            {
                this.set('ifNoneStat', !(this.get('ifNoneStat')));
            }
            if(!this.get('ifNoneStat') && this.get('selectedProgram')!=null)
            {
                
                var counts =[];
                    var names=[]
                    for(let i =0;i<this.get('codeModel').get('length');i++)
                    {
                        counts.push(0);
                        names.push(this.get('codeModel').objectAt(i).get('code'));
                    }
                    var first=true;
                 $('#programs').find('#'+this.get('selectedProgram')+' tr').each(function() {
                     if(!first)
                        {
                            var codes = extractContent($(this).find(".codes").html().replace(/\s\s+/g, '').replace(/<br>/g,"|")).split("|");
                            for(let j=0;j<codes.length;j++)
                            {
                                for(let k=0;k<names.length;k++)
                                {
                                    if(codes[j]==names[k])
                                    {
                                        counts[k]++;
                                    }
                                }
                            }
                            
                        }
                        else{
                        first=false;
                    }
                 });
                 var max =0;
                    for (let i =0;i<counts.length;i++)
                    {
                        if(counts[i]>max)
                        {
                            max=counts[i];
                        }
                    }
                    this.set('baroptions5', {
                title: {
                    display: true,
                    fontSize: 16,
                    fontStle:"bold",
                    fontColor:"#101",
                    text: 'Students per Assestment Code in '+this.get('programModel').objectAt(this.get('selectedProgram')).get('name')
                },
                legend: {
                    display: false,
                },
                scales: {
                    yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Number of Students',
                        
                    },
                    ticks: {
                            suggestedMin: 0,
                            suggestedMax: max+2,
                            fixedStepSize: 1,
                        }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Assesment Code'
                    }
                    }]
                }
            });
                    this.set('numberData5', {
                    labels: names,
                    datasets: [
                        {
                            backgroundColor: "rgba(0,0,128,.9)",
                            borderWidth: 1,
                            data: counts,
                        }
                    ]
                    
                });
                counts=[];
                names=[];
                var colors=[];
                for(let i =0;i<7;i++)
                {
                    counts.push(0);
                    
                }
                names.push("Under 40");
                names.push("40-50");
                names.push("50-60");
                names.push("60-70");
                names.push("70-80");
                names.push("80-90");
                names.push("90+");
                
                    first=true;
                    $('#programs').find('#'+this.get('selectedProgram')+' tr').each(function() {
                     if(!first)
                        {
                            var grades = extractContent($(this).find(".avg").html());
                               if(grades<40)
                               {
                                    counts[0]++;
                               }
                               else if(grades>=40 && grades<50)
                               {
                                    counts[1]++;
                               }
                               else if(grades>=50 && grades<60)
                               {
                                   counts[2]++;
                               }
                               else if(grades>=60 && grades<70)
                               {
                                   counts[3]++;
                               }
                               else if(grades>=70 && grades<80)
                               {
                                   counts[4]++;
                               }
                               else if(grades>=80 && grades<90)
                               {
                                   counts[5]++;
                               }
                               else if(grades>=90)
                               {
                                   counts[6]++;
                               }
                        }
                        else{
                        first=false;
                    }
                 });
                  max =0;
                    for (let i =0;i<counts.length;i++)
                    {
                        if(counts[i]>max)
                        {
                            max=counts[i];
                        }
                    }
                    this.set('baroptions8', {
                title: {
                    display: true,
                    fontSize: 16,
                    fontStle:"bold",
                    fontColor:"#101",
                    text: 'Student Grade Distribution for ' +this.get('programModel').objectAt(this.get('selectedProgram')).get('name')
                },
                legend: {
                    display: false,
                },
                scales: {
                    yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Number of Students',
                        
                    },
                    ticks: {
                            suggestedMin: 0,
                            suggestedMax: max+2,
                            fixedStepSize: 1,
                        }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Grade Range'
                    }
                    }]
                }
            });
                    this.set('numberData8', {
                    labels: names,
                    datasets: [
                        {
                            backgroundColor: "rgba(0,0,128,.9)",
                            borderWidth: 1,
                            data: counts,
                        }
                    ]
                    
                });
                counts =[];
                names=[];
                colors=[];
                    for(let i =0;i<this.get('departmentModel').get('length');i++)
                    {
                        counts.push(0);
                        names.push(this.get('departmentModel').objectAt(i).get('name'));
                        colors.push(rainbow(this.get('departmentModel').get('length'),i+1));
                    }
                    
                    
                    
                    first=true;
                    $('#programs').find('#'+this.get('selectedProgram')+' tr').each(function() {
                        if(!first)
                        {
                            var codes = $(this).find(".dpts").html().replace(/\s\s+/g, '').replace(/<!---->/g, "").replace(/(?:\r\n|\r|\n)/g, '').replace(/<br>/g,"|").split("|");
                            
                            
                            for(let j=0;j<codes.length;j++)
                            {
                                for(let k=0;k<names.length;k++)
                                {
                                    if(codes[j]==names[k])
                                    {
                                        counts[k]++;
                                    }
                                }
                            }
                            
                        }
                        else{
                        first=false;
                    }
                    
                });
                this.set('baroptions10',{
                title: {
                    display: true,
                    fontSize: 16,
                    fontStle:"bold",
                    fontColor:"#101",
                    text: 'Students per Department in '+this.get('programModel').objectAt(this.get('selectedProgram')).get('name')
                },
                legend: {
                    display: true,
                    
                },
                
            });
                this.set('numberData10', {
                    labels: names,
                    datasets: [
                        {
                            backgroundColor: colors,
                            
                            data: counts,
                        }
                    ]
                    
                });
                this.set('ifNoneStat', !(this.get('ifNoneStat')));
            }
            function extractContent(value){
                var div = document.createElement('div')
                div.innerHTML=value;
                var text= div.textContent;            
                return text;
            }
            function rainbow(numOfSteps, step) {
                
                var r, g, b;
                var h = step / numOfSteps;
                var i = ~~(h * 6);
                var f = h * 6 - i;
                var q = 1 - f;
                switch(i % 6){
                    case 0: r = 1; g = f; b = 0; break;
                    case 1: r = q; g = 1; b = 0; break;
                    case 2: r = 0; g = 1; b = f; break;
                    case 3: r = 0; g = q; b = 1; break;
                    case 4: r = f; g = 0; b = 1; break;
                    case 5: r = 1; g = 0; b = q; break;
                }
                var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
                return (c);
            }
        },
        viewAdjudication(){
            
            if (this.get("adjudicationTermToView") == ""){
                alert("Term not selected");
            } else {
                this.set('showResults', !this.get('showResults'));
                
            }
            
            
            
        },
        selectTerm(index){
            var term = this.get('termModel').objectAt(index).get('name');
            this.set('adjudicationTerm', term);
            this.set('progress', 0);
            this.$('#progBar').progress('reset');
        },

        adjudicate(){

            var self = this;
            var index=0;
            for(var j =0; j <self.get('termModel').get('length'); j++){
                //console.log(self.get('termCodeModel').objectAt(j).get('name'));
                if((self.get('termModel').objectAt(j).get('name'))==(self.get('adjudicationTerm'))){
                    //console.log(j);
                    index=j;
                }
            }
            this.get('store').query('grade', {schoolterm: self.get('termModel').objectAt(index).get('id')}).then(function(grades){
            self.set('gradeModel', []);
            var studentCodes = [];
            //console.log(studentCodes);
            
            var gradeSum = 0.0;
            var totalTermUnit = 0.0;
            var passedTermUnit = 0.0;
            var date = new Date().toString();
            var termAvg = 0.0;
// for(var t=1; t<=100; t++){
            //     progress=t;
            //     self.$('#progBar').progress('set percent', progress);
            //}
            

                //console.log(index);
                //console.log(this.get('termModel').objectAt(index).get('id'));
                
                    self.set('gradeModel', grades);
                    if(self.get('adjudicationTerm')!=""){
                        self.$("#adjudication").form('remove prompt', 'listname');  
                        for(var i=0;i<self.get('studentModel').get('length');i++){
                            var currentStudent = self.get('studentModel').objectAt(i);

                            //console.log("******************");
                            //console.log(this.get('gradeModel'));

                            gradeSum = 0.0;
                            totalTermUnit = 0.0;
                            passedTermUnit = 0.0;
                            studentCodes=null;
                            studentCodes = [];
                            date=new Date().toString();
                            termAvg=0.0;

                            //console.log(studentCodes);
                            //console.log(studentCodes.get('length'));
                            //console.log(studentCodes);
                            //console.log(studentCodes.get('length'));
                            //console.log("----------------");
                            var tempGrades=[];
                            for(var t=0;t<self.get('gradeModel').get('length');t++){
                                //console.log(currentStudent.get('id'));
                                for(var q=0;q<self.get('termCodeModel').get('length');q++){
                                    //console.log(this.get('gradeModel').objectAt(t).get('term').get('id'));
                                    //console.log(this.get('termCodeModel').objectAt(q).get('id'));
                                    if(self.get('gradeModel').objectAt(t).get('term').get('id')==self.get('termCodeModel').objectAt(q).get('id')){
                                        if(self.get('termCodeModel').objectAt(q).get('student').get('id')==currentStudent.get('id')){
                                            tempGrades.push(self.get('gradeModel').objectAt(t));
                                        }
                                    }
                                }
                            }
                            //console.log(tempTerms);
                           // console.log(tempGrades);

                            if(tempGrades.get('length')!=0){
                            
                                for(var k=0;k<tempGrades.get('length');k++){
                                    var temp = 0.0;
                                    temp=gradeSum+tempGrades.objectAt(k).get('mark');
                                    gradeSum=temp;

                                    var temp2 = 0.0;
                                    temp2=totalTermUnit+tempGrades.objectAt(k).get('course').get('unit');
                                    totalTermUnit=temp2;

                                    if(tempGrades.objectAt(k).get('mark')>=50){
                                        var temp3=0.0;
                                        temp3=passedTermUnit+tempGrades.objectAt(k).get('course').get('unit');
                                        passedTermUnit=temp3;
                                    }
                                }

                                if(tempGrades.get('length')>0){
                                    var avg = (gradeSum)/(tempGrades.get('length'));
                                    termAvg=avg;
                                } else{
                                    termAvg=0.0;
                                }
                                

                                //console.log(termAvg);
                                //console.log(totalTermUnit);
                                //console.log(passedTermUnit);



                                var codeTest=true;
                                for(var w=0;w<self.get('codeModel').get('length');w++){
                                    var currentAssessmentCode = self.get('codeModel').objectAt(w);
                                    var rules = currentAssessmentCode.get('rule');
                                    for(var x=0;x<rules.get('length');x++){
                                        var currentRule = rules.objectAt(x);
                                        var logExpressions = currentRule.get('logExpressions');
                                        codeTest=true;
                                        for(var y=0;y<logExpressions.get('length');y++){
                                            var currentExpression = logExpressions.objectAt(y);
                                            if(currentExpression.get('parameter')=="TotalAvg" && currentExpression.get('operator')=="="){
                                                codeTest = codeTest && termAvg==currentExpression.get('value');
                                                    /*if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }*/
                                            } else if(currentExpression.get('parameter')=="TotalAvg" && currentExpression.get('operator')==">="){
                                                codeTest = codeTest && (termAvg>=currentExpression.get('value'));
                                                  /*  if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }*/
                                            } else if(currentExpression.get('parameter')=="TotalAvg" && currentExpression.get('operator')=="<="){
                                                codeTest = codeTest && (termAvg<=currentExpression.get('value'));
                                                    /*if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }*/
                                            } else if(currentExpression.get('parameter')=="TotalAvg" && currentExpression.get('operator')==">"){
                                                codeTest = codeTest && (termAvg>currentExpression.get('value'));
                                                    /*if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }*/
                                            } else if(currentExpression.get('parameter')=="TotalAvg" && currentExpression.get('operator')=="<"){
                                                codeTest = codeTest && (termAvg<currentExpression.get('value'));
                                                    /*if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }*/
                                            } else if(currentExpression.get('parameter')=="TermUnitPassed" && currentExpression.get('operator')=="="){
                                                codeTest = codeTest && (passedTermUnit==currentExpression.get('value'));
                                                   /* if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }*/
                                            } else if(currentExpression.get('parameter')=="TermUnitPassed" && currentExpression.get('operator')==">="){
                                                codeTest = codeTest && (passedTermUnit>=currentExpression.get('value'));
                                                  /*  if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }*/
                                            } else if(currentExpression.get('parameter')=="TermUnitPassed" && currentExpression.get('operator')=="<="){
                                                codeTest = codeTest && (passedTermUnit<=currentExpression.get('value'));
                                                    /*if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }*/
                                            } else if(currentExpression.get('parameter')=="TermUnitPassed" && currentExpression.get('operator')==">"){
                                                codeTest = codeTest && (passedTermUnit>currentExpression.get('value'));
                                                  /*  if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }*/
                                            } else if(currentExpression.get('parameter')=="TermUnitPassed" && currentExpression.get('operator')=="<"){
                                                codeTest = codeTest && (passedTermUnit<currentExpression.get('value'));
                                                  /*  if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }*/
                                            } else if(currentExpression.get('parameter')=="TermUnitTotal" && currentExpression.get('operator')=="="){
                                                codeTest = codeTest && (totalTermUnit==currentExpression.get('value'));
                                                  /*  if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }*/
                                            }
                                            else if(currentExpression.get('parameter')=="TermUnitTotal" && currentExpression.get('operator')==">="){
                                                codeTest = codeTest && (totalTermUnit>=currentExpression.get('value'));
                                                  /*  if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }*/
                                            } else if(currentExpression.get('parameter')=="TermUnitTotal" && currentExpression.get('operator')=="<="){
                                                codeTest = codeTest && (totalTermUnit<=currentExpression.get('value'));
                                                 /*   if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }*/
                                            } else if(currentExpression.get('parameter')=="TermUnitTotal" && currentExpression.get('operator')==">"){
                                               codeTest = codeTest && (totalTermUnit>currentExpression.get('value'));
                                                /*    if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }*/
                                            } else if(currentExpression.get('parameter')=="TermUnitTotal" && currentExpression.get('operator')=="<"){
                                                codeTest = codeTest && (totalTermUnit<currentExpression.get('value'));
                                                /*    if(codeTest!=false){
                                                        codeTest=true;
                                                    }
                                                } else{
                                                    codeTest=false;
                                                }*/
                                            } else{
                                                var found=false;
                                                for(var h=0;h<self.get('courseCodeModel').get('length');h++){
                                                    var currentCourse = self.get('courseCodeModel').objectAt(h);
                                                    var currentCourseRef = currentCourse.get('courseLetter')+currentCourse.get('courseNumber');

                                                    if(currentExpression.get('parameter')==currentCourseRef){
                                                        for(var z=0;z<tempGrades.get('length');z++){
                                                            var currentStudentGrade = tempGrades.objectAt(z);
                                                            var currentStudentGradeCourse = currentStudentGrade.get('course').get('courseLetter')+currentStudentGrade.get('course').get('courseNumber');
                                                            if(currentStudentGradeCourse==currentCourseRef){
                                                                if(currentExpression.get('operator')=="="){
                                                                    codeTest = codeTest && (currentStudentGrade.get('mark')==currentExpression.get('value'));
                                                                    found=true;
                                                                } else if(currentExpression.get('operator')==">="){
                                                                    codeTest = codeTest && (currentStudentGrade.get('mark')>=currentExpression.get('value'));
                                                                    found=true;
                                                                } else if(currentExpression.get('operator')=="<="){
                                                                    codeTest = codeTest && (currentStudentGrade.get('mark')<=currentExpression.get('value'));
                                                                    found=true;
                                                                } else if(currentExpression.get('operator')==">"){
                                                                    codeTest = codeTest && (currentStudentGrade.get('mark')>currentExpression.get('value'));
                                                                    found=true;
                                                                } else if(currentExpression.get('operator')=="<"){
                                                                    codeTest = codeTest && (currentStudentGrade.get('mark')<currentExpression.get('value'));
                                                                    found=true;
                                                                } 
                                                            }
                                                        }
                                                    }
                                                }

                                                codeTest=codeTest&&found;

                                            }
                                        }
                                    }

                                    if(codeTest==true){
                                        //console.log(studentCodes);
                                        studentCodes.push(self.get('store').peekRecord('assessmentCode', currentAssessmentCode.get('id')));
                                       // console.log(studentCodes);
                                        var index=0;
                                        while(index!=-1){
                                            index=studentCodes.indexOf(null);
                                            //console.log(index);
                                            if (index > -1) {
                                                studentCodes.splice(index, 1);
                                            }
                                        }        
                                    }

                                }
                                
                                
                                

                                //console.log(currentStudent);
                                //console.log(studentCodes);
                                //console.log(totalTermUnit);
                                //console.log(termAvg);
                                //console.log(passedTermUnit);
                                //console.log(date);

                                var record = self.get('store').createRecord('adjudication', {
                                    date: date,
                                    termAVG: termAvg,
                                    termUnitPassed: passedTermUnit,
                                    termUnitTotal: totalTermUnit,
                                    note: self.get('adjudicationTerm'),
                                    assessmentCode: studentCodes,
                                    student: self.get('store').peekRecord('student', currentStudent.get('id'))
                                });
                                //console.log(studentCodes);
                                record.save();
                            }

                            //console.log(studentCodes);
                            
                            var incrementVal = 100/(self.get('studentModel').get('length'));
                            if(self.get('progress')<100){
                                self.set('progress', self.get('progress')+incrementVal);
                            }
                        // this.rerender();
                            //console.log(self.get('progress'));
                            //this.$('#progBar').progress('set percent', progress);
                            // if(progress >= 1){
                            //     for(var t=100000000; t>0; t--){}
                            //     console.log(incrementVal);
                            //     progress = 0;
                            // }
                            //console.log(progress);
                        //  for(var t=1000000000; t>0; t--){}
                            
                        }
                        
                    } else{
                        self.$("#adjudication").form('add prompt', 'listname', 'error text');
                    }
            });
        },

        selectTermToView(index){
            var term = this.get('termModel').objectAt(index).get('name');
            this.set('adjudicationTermToView', term);
        },
        selectDepartmentToView(index){
            
            this.set('selectedDepartment', index);
            
        },
        selectProgramToView(index){
            this.set('selectedProgram', index);
            
        },

        

        exportPDF(id) {
            var self = this;
            var doc = new jsPDF();
            var title = "";
            //doc.text("Adjudication: " + this.get("adjudicationTermToView"), 14, 16);
            if(id == 1){
                var elem = document.getElementById("studentTable");
                title = "Students in Term";
            } else if (id == 2){
                var elem = document.getElementById("departmentTable");
                title = "Students in Departments";
            } else if (id == 3){
                var elem = document.getElementById("programTable");
                title = "Students in Programs";
            }
            
            var res = doc.autoTableHtmlToJson(elem);
            doc.autoTable(res.columns, res.data, {
                startY: 20, 
                theme: 'grid',
                headerStyles: {fillColor: [79, 38, 131]},
                addPageContent: function(data) {
                    doc.text("Adjudication Results for: " + self.get("adjudicationTermToView") , 15, 15);
                }
            });
            
            doc.output("dataurlnewwindow");
        },

        
    
        export2() {
            var doc = new jsPDF();
            
            for(var i =0; i <this.get('departmentGroups').get('length');i++)
            {
                var self = this;
                //console.log(this.get('departmentGroups').get('length'));
                
            
            //doc.text("Adjudication: " + this.get("adjudicationTermToView"), 14, 16);
            var elem = document.getElementById(i);
            var res = doc.autoTableHtmlToJson(elem);
            doc.autoTable(res.columns, res.data, {
                startY: 20, 
                theme: 'grid',
                headerStyles: {fillColor: [79, 38, 131]},
                addPageContent: function(data) {
                    doc.text("Adjudication: " + self.get("adjudicationTermToView"), 15, 15);
                }
            });
            
                //doc.text("Adjudication: " + this.get("adjudicationTermToView"), 14, 16);
                var elem = document.getElementById(i);
                var res = doc.autoTableHtmlToJson(elem);
                doc.autoTable(res.columns, res.data, {
                    startY: 20, 
                    theme: 'grid',
                    headerStyles: {fillColor: [79, 38, 131]},
                    addPageContent: function(data) {
                        doc.text("Adjudication: " + self.get("adjudicationTermToView"), 15, 15);
                    }
                });
                
            }
            doc.output("dataurlnewwindow");
            
        },

    
    departmentExport(type)
    {

        this.set('departmentsAdded', []);
        for(let i =0; i < this.get('departmentModel').get('length'); i++)
        {
            this.get('departmentsAdded').push(false);
        }
        
        this.set('chosen', type);
        Ember.$('.ui.department.modal').modal('show');
    },
    programExport(type)
    {

        this.set('programsAdded', []);
        for(let i =0; i < this.get('programModel').get('length'); i++)
        {
            this.get('programsAdded').push(false);
        }
        
        this.set('chosen', type);
        Ember.$('.ui.program.modal').modal('show');
    },
    cancelDepartment()
    {
        Ember.$('.ui.department.modal').modal('hide');
        
    },
    cancelProgram()
    {
        Ember.$('.ui.program.modal').modal('hide');
    },
    selectDepartmentToExport(id)
    {
        this.set('departmentsAdded', []);
        for(let i=0; i<this.get('departmentModel').get('length');i++)
        {
            let match = false;
            for(let j =0; j<id.length;j++)
            {
                if(i==id[j])
                {
                    match=true;
                }
            }
            this.get('departmentsAdded').push(match);
            
            
        }
        
        
    },
    selectProgramToExport(id)
    {
        this.set('programsAdded', []);
        for(let i=0; i<this.get('programModel').get('length');i++)
        {
            let match = false;
            for(let j =0; j<id.length;j++)
            {
                if(i==id[j])
                {
                    match=true;
                }
            }
            this.get('programsAdded').push(match);
            
            
        }
        
        
    },
    exportDepartment(thing)
    {
        var self=this;
        if(thing)
        {
            this.set('departmentsAdded', []);
            for(let i =0; i < this.get('departmentModel').get('length'); i++)
            {
                this.get('departmentsAdded').push(true);
            }
            
        }
        if (this.get('chosen')){
            var doc = new jsPDF('p', 'pt');
            var header = function(data) {
                doc.setFontSize(20);
                doc.setTextColor(79, 38, 131);
                doc.setFontStyle('normal');
                //doc.addImage(headerImgData, 'JPEG', data.settings.margin.left, 20, 50, 50);
                doc.text("Adjudication By Department for: "+self.get("adjudicationTermToView"), data.settings.margin.left, 50);
            };
            var first=true;
            for(var i =0; i<this.get('departmentModel').get('length'); i++)
            {
                if(first)
                {
                    if(this.get('departmentsAdded').objectAt(i))
                    {
                        first=false;
                        var res = doc.autoTableHtmlToJson(this.$('#departments').find('#'+i)[0]);
                        doc.text(40, 70, this.get('departmentModel').objectAt(i).get('name'));
                        doc.autoTable(res.columns, res.data, {margin: {top: 80}, headerStyles: {fillColor: [79, 38, 131]}, addPageContent: header});
                    }
                }
                else
                {
                    if(this.get('departmentsAdded').objectAt(i))
                    {
                        var res = doc.autoTableHtmlToJson(this.$('#departments').find('#'+i)[0]);
                        doc.text(40, doc.autoTableEndPosY()+20, this.get('departmentModel').objectAt(i).get('name'));
                        var options = {
                            headerStyles: {fillColor: [79, 38, 131]},
                            margin: {
                            top: 80
                            },
                            startY: doc.autoTableEndPosY() + 30
                        };
                        doc.autoTable(res.columns, res.data, options);

                    }
                }
            }
            Ember.$('.ui.department.modal').modal('hide');
            doc.output("dataurlnewwindow");
        }
        else 
        {
                function extractContent(value){
                var div = document.createElement('div')
                div.innerHTML=value;
                var text= div.textContent;            
                return text;
            }
            var stuff= [];
            var options = [];
            var i =-1;
            var first=false;
            var self=this;
            for(let j=0; j<this.get('departmentGroups').get('length');j++){
                if(this.get('departmentsAdded').objectAt(j)){
                var data=[];
                
                $('#departments').find('#'+j+' tr').each(function() {
                    var row=[];
                    if(first)
                    {
                    
                    row.push(extractContent($(this).find(".info").html()));  
                    row.push(extractContent($(this).find(".id").html()));  
                    
                    row.push(extractContent($(this).find(".avg").html()));   
                     
                    row.push(extractContent(extractContent($(this).find(".codes").html()).replace(/\s\s+/g, ' ')));  
                    row.push(extractContent(extractContent($(this).find(".grams").html()).replace(/\s\s+/g, ' ')));  
                    data.push(row);
                }
                else 
                {
                    row=["Student Name","Student Number", "Term Average", "Assesment Codes", "Program(s)"];
                    data.push(row);
                    first=true;
                    options.push(self.get('departmentModel').objectAt(j).get('name'));
                }
            });
            first=false;
            stuff.push(data);
                }
        }
        
        Ember.$('.ui.department.modal').modal('hide');
        this.get('myexport').export(stuff, options, "AdjudicationReportByDepartment.xlsx");
        }
    
    },
    exportProgram(thing)
    {
        var self = this;
        if(thing)
        {
            this.set('programsAdded', []);
            for(let i =0; i < this.get('programModel').get('length'); i++)
            {
                this.get('programsAdded').push(true);
            }
            
        }
        if (this.get('chosen')){
        var doc = new jsPDF('p', 'pt');
        var header = function(data) {
            doc.setFontSize(20);
            doc.setTextColor(79, 38, 131);
            doc.setFontStyle('normal');
            //doc.addImage(headerImgData, 'JPEG', data.settings.margin.left, 20, 50, 50);
            doc.text("Adjudication By Program for: "+self.get("adjudicationTermToView"), data.settings.margin.left, 50);
        };
        var first=true;
        for(var i =0; i<this.get('programModel').get('length'); i++)
        {
            if(first)
            {
                if(this.get('programsAdded').objectAt(i))
                {
                    first=false;
                    var res = doc.autoTableHtmlToJson(this.$('#programs').find('#'+i)[0]);
                    doc.text(40, 70, this.get('programModel').objectAt(i).get('name'));
                    doc.autoTable(res.columns, res.data, {margin: {top: 80}, headerStyles: {fillColor: [79, 38, 131]}, addPageContent: header});
                }
            }
            else
            {
                if(this.get('programsAdded').objectAt(i))
                {
                    var res = doc.autoTableHtmlToJson(this.$('#programs').find('#'+i)[0]);
                    doc.text(40, doc.autoTableEndPosY()+20, this.get('programModel').objectAt(i).get('name'));
                    var options = {
                        headerStyles: {fillColor: [79, 38, 131]},
                        margin: {
                        top: 80
                        },
                        startY: doc.autoTableEndPosY() + 30
                    };
                    doc.autoTable(res.columns, res.data, options);

                }
            }
        }
        Ember.$('.ui.program.modal').modal('hide');
        doc.output("dataurlnewwindow");
    }
    else 
        {
                function extractContent(value){
                var div = document.createElement('div')
                div.innerHTML=value;
                var text= div.textContent;            
                return text;
            }
            var stuff= [];
            var options = [];
            var i =-1;
            var first=false;
            var self=this;
            for(let j=0; j<this.get('programGroups').get('length');j++){
                if(this.get('programsAdded').objectAt(j)){
                var data=[];
                
                $('#programs').find('#'+j+' tr').each(function() {
                    var row=[];
                    if(first)
                    {
                    
                    row.push(extractContent($(this).find(".info").html()));  
                    row.push(extractContent($(this).find(".id").html()));  
                    
                    row.push(extractContent($(this).find(".avg").html()));   
                      
                    row.push(extractContent(extractContent($(this).find(".codes").html()).replace(/\s\s+/g, ' ')));   
                    row.push(extractContent(extractContent($(this).find(".dpts").html()).replace(/\s\s+/g, ' ')));  
                    data.push(row);
                }
                else 
                {
                    row=["Student Name","Student Number", "Term Average", "Assesment Codes","Department(s)"];
                    data.push(row);
                    first=true;
                    options.push(self.get('programModel').objectAt(j).get('name'));
                }
            });
            first=false;
            stuff.push(data);
                }
        }
        
        Ember.$('.ui.program.modal').modal('hide');
        this.get('myexport').export(stuff, options, "AdjudicationReportByProgram.xlsx");
        }
    },
    excelExport()
    {
        function extractContent(value){
            var div = document.createElement('div')
            div.innerHTML=value;
            var text= div.textContent;            
            return text;
        }
        var stuff= [];
        var first =false;
        var data=[];
        var options = ["All Students"];
        $('#studentTable tr').each(function() {
            var row=[];
            if(first)
            {
            row.push(extractContent($(this).find(".info").html()));  
            row.push(extractContent($(this).find(".id").html()));  
            row.push(extractContent($(this).find(".avg").html()));     
            row.push(extractContent(extractContent($(this).find(".codes").html()).replace(/\s\s+/g, ' ')));
            row.push(extractContent(extractContent($(this).find(".dpts").html()).replace(/\s\s+/g, ' ')));   
            row.push(extractContent(extractContent($(this).find(".grams").html()).replace(/\s\s+/g, ' ')));  
            data.push(row);
        }
        else 
        {
            row=["Student Name","Student Number", "Term Average", "Assesment Codes","Department(s)","Program(s)"];
            data.push(row);
            first=true;
        }
    });
    stuff.push(data);
        
        
   
   
   
   
    this.get('myexport').export(stuff, options, "AdjudicationReport.xlsx");
   
                
    },

        deleteAll() {
            if(confirm("Press OK to Confirm Delete") === true){
                this.get('store').findAll('adjudication').then(function(record){
                    record.content.forEach(function(rec) {
                        Ember.run.once(this, function() {
                            rec.deleteRecord();
                            rec.save();
                        });
                    }, this);
                }); 
            }
        }
    }
});


                    