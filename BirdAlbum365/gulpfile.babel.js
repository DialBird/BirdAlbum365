
const gulp = require('gulp');

const requireDir = require('require-dir');
requireDir('./gulp/tasks', {recurse: true});

const config = require('./gulp/config');

gulp.task('watch', ()=>{
    gulp.watch(config.js.srcDir + '/**/*.es6', ['compileJS']);
    gulp.watch(config.css.srcDir + '/**/*.scss',['compileCSS']);
});

gulp.task('default', ['compileJS', 'compileCSS', 'watch']);




