
const gulp = require('gulp');
const requireDir = require('require-dir');
requireDir('./gulp/tasks', {recurse: true});
const config = require('./gulp/config.js');

gulp.task('watch', ()=>{
    gulp.watch(path.join(config.sourcedir, '**/*.es6'), ['conpile_js']);
});

gulp.task('default', ['conpile_js','watch']);
