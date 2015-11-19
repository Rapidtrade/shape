var gulp = require('gulp'),
    prompt = require('gulp-prompt'),
    clean = require('gulp-clean'),
    del = require('del'),
    cordova_create = require('gulp-cordova-create'),
    cordova_plugin = require('gulp-cordova-plugin'),
    runSequence = require('run-sequence'),
    git = require('gulp-git');
var project = { name : '', id : '', repo : ''};

gulp.task('start', function(){
  gulp.src('*')
  .pipe(prompt.prompt({
    type : 'list',
    name : 'option',
    message : 'Please select a project option',
    choices : ['new','update']
  }, function(res){
      gulp.start(res.option);
  }));
});

//This task will Run when a new project is create it intialize everything for the PreBuild Phase
gulp.task('new', function(){
  gulp.src('*')
  .pipe(
    prompt.prompt([{
      type : 'input',
      name : 'name',
      message : 'Project name'
    },{
      type : 'input',
      name : 'id',
      message : 'Project ID'
    },{
      type : 'input',
      name : 'repo',
      message : 'Github Repository'
    }
  ],function(res){
    project.name = res.name;
    project.id = res.id;
    project.repo = res.repo;
    //Runner the task that initializes the project folder
    if(!res.repo){
        console.log("Please add in a Repository!!");
        return;
    }
    gulp.start('clone');
  })
);
});

gulp.task('clone',function(){
  console.log("===== Attempting to Clone The Repository =====");
  var stream =  git.clone(project.repo,{args : 'source'},function(err){
    if(err){
       console.log(err);
     }else{
       console.log("===== Repository Successfully Cloned =====");
       gulp.start('create');
     }
  });
});

gulp.task('create',function(){
  console.log("=================== Starting the Cordova Create ===================");
  var options = {
       dir: 'build',
       id: 'com.rapidtarget',
       name: project.name ? project.name : 'rapidtarget'
   };
   gulp.src('source')
  .pipe(cordova_create(options))
  .pipe(cordova_plugin(['org.apache.cordova.device ','org.apache.cordova.geolocation','org.apache.cordova.camera']));
});

gulp.task('update', function(){
  console.log('update task');
});
gulp.task('clean', function(){
  del(['source/','build/']);
});

gulp.task('default',['start']);
