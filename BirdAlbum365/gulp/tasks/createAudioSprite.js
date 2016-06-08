
const gulp = require('gulp');
const audiosprite = require('gulp-audiosprite');

const config = require('../config');

gulp.task('createAudioSprite',()=>{
    gulp.src(`${ config.audio.srcDir}/*mp3`)
        .pipe(audiosprite({
            output: 'birdSoundsSprite',
            export: 'ogg',
            format: 'createjs',
            bitrate: '64'
        }))
        .pipe(gulp.dest(config.audio.bldDir));
});
