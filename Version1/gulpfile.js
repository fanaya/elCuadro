var gulp = require('gulp');
    //uglify = require('gulp-uglify');

//gulp.task('compress', function() {
//    return gulp.src('lib/*.js')
//        .pipe(uglify())
//        .pipe(gulp.dest('dist'));
//});


//gulp.task('generateJS', function() {
//    return gulp.src('source/scripts/*.js')
//        //.pipe(uglify())
//        .pipe(gulp.dest('publish/js/'));
//});

gulp.task('default', function() {
    // place code for your default task here
    return gulp.src('source/scripts/*.js')
        .pipe(gulp.dest('publish/js/'));
});