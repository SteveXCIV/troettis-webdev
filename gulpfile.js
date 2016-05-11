/*
Gulp file, for building Bootstrap SASS

Made using this tutorial:
    http://treyhunner.com/2015/02/creating-a-custom-bootstrap-build/
*/
var gulp = require('gulp');
var sass = require('gulp-sass');

var config = {
    // point to bootstrap-sass bower component
    bootstrapDir: './bower_components/bootstrap-sass',
    // point to jquery bower component
    jsDir: './bower_components/jquery',
    // this is where we'll output built dependencies
    publicDir: './public',
};

// this task compiles all SASS files into CSS and puts them in ./public/css
gulp.task('css', function() {
    return gulp.src('./css/app.scss')
       .pipe(sass({
           includePaths: [config.bootstrapDir + '/assets/stylesheets'],
    }))
        .pipe(gulp.dest(config.publicDir + '/css'));
});

// this task moves a copy of jquery.min.js into ./public/js
gulp.task('js', function() {
    return gulp.src(config.jsDir + '/dist/jquery.min.js')
        .pipe(gulp.dest(config.publicDir + '/js'));
});

// this task moves all fonts into ./public/fonts
gulp.task('fonts', function() {
    return gulp.src(config.bootstrapDir + '/assets/fonts/**/*')
        .pipe(gulp.dest(config.publicDir + '/fonts'));
});

// this task watches for changes to custom stylesheets and re-runs the css task
gulp.task('watch', function() {
    var watch_files = [
        './css/app.scss',
    ];
    gulp.watch(watch_files, 'css');
});

// the default task copies all dependencies
gulp.task('default', ['css', 'fonts']);
