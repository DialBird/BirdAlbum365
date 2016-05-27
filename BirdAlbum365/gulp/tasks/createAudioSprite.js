
const gulp = require('gulp');
const audiosprite = require('gulp-audiosprite');

const config = require('../config');

gulp.task('createAudioSprite',function(){
    gulp.src(config.audio.srcDir)
        .pipe(audiosprite({
            output: 'birdSoundsSprite',
            export: 'ogg',
            format: 'createjs',
            bitrate: '64'
        }))
        .pipe(config.audio.bldDir));
});