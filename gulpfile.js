var gulp = require('gulp'),
    prompt = require('gulp-prompt'),
    clean = require('gulp-clean'),
    del = require('del'),
    cordova_create = require('gulp-cordova-create'),
    cordova_plugin = require('gulp-cordova-plugin'),
    runSequence = require('run-sequence'),
    log = require('gulp-log2'),
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
    if(!res.repo){
      console.log("Please add in a Repository!!");
      return;
    }
    if(!res.id){
      console.log("Please add in a project id!!");
      return;
    }
    if(!res.name){
      console.log("Please add in a Project name!!");
      return;
    }
    project.name = res.name;
    project.id = res.id;
    project.repo = res.repo;
    //Runner the task that initializes the project folder
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

//Deals with the creation of a cordova project
gulp.task('create',function(){
  var options = {
       dir: 'build',
       id: project.id,
       name: project.name ? project.name : 'rapidtarget'
   };
   gulp.src('source')
   .pipe(log('==== Beginning cordova create ===='))
   .pipe(cordova_create(options))
   .pipe(log('==== Successfully created cordova project ===='))
   .pipe(log('==== Adding cordova plugins ===='))
   .pipe(cordova_plugin(['org.apache.cordova.device ','org.apache.cordova.geolocation','org.apache.cordova.camera','https://github.com/apache/cordova-plugin-whitelist.git','org.apache.cordova.network-information','org.apache.cordova.vibration','org.apache.cordova.dialogs','cordova-plugin-splashscreen','cordova-plugin-ipad-multitasking']))
   .pipe(log('==== Plugins added Successfully ===='));
});

gulp.task('build-ios', function(){

});

gulp.task('build-android', function(){

});

gulp.task('update', function(){
  console.log('update task');
});

gulp.task('clean', function(){
  del(['source/','build/']);
});

gulp.task('default',['start']);
