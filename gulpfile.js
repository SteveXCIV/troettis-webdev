/*
Gulp file, for building Bootstrap SASS

Made using this tutorial:
    http://treyhunner.com/2015/02/creating-a-custom-bootstrap-build/
*/
var gulp = require('gulp');
var sass = require('gulp-sass');
var errPipe = require('pipe-error-stop');

var config = {
    // point to bootstrap-sass bower component
    bootstrapDir: './bower_components/bootstrap-sass',
    // point to jquery bower component
    jQueryDir: './bower_components/jquery',
    wizMarkdownDir: './bower_components/wiz-markdown/wizMarkdown',
    // this is where we'll output built dependencies
    publicDir: './public',
    // the file(s) to build to the public directory
    sassFile: './css/!(_)*.scss',
};

function handleError(e) {
    console.log(e.message);
}

// this task compiles all SASS files into CSS and puts them in ./public/css
gulp.task('scss', function() {
    return gulp.src(config.sassFile)
       .pipe(sass({
           includePaths: [config.bootstrapDir + '/assets/stylesheets'],
    }))
        .pipe(errPipe({
            errorCallback: handleError,
        }))
        .pipe(gulp.dest(config.publicDir + '/css'));
});

// this task moves a copy of bootstrap.min.js into ./public/js
gulp.task('js', function() {
    return gulp.src([
            config.wizMarkdownDir + '/wizMarkdown.min.js',
        ])
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
        './css/**/*.scss',
    ];
    gulp.watch(watch_files, ['scss']);
});

// the default task copies all dependencies
gulp.task('default', ['scss', 'js', 'fonts']);
