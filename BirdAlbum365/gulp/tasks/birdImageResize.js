
//このタスクに加えて、ImageMagickを使うためにshコマンドを使っている。
//よってこのタスクはpackge.jsonのnpm runからうごかす

const gulp = require('gulp');
const imageResize = require('gulp-image-resize-ar');
const imagemin = require('gulp-imagemin');

const config = require('../config');

gulp.task('birdImageResize', ()=>{
    imageResizeFunc('summerBirds');
    imageResizeFunc('winterBirds');
    imageResizeFunc('residentBirds');
    imageResizeFunc('journeyBirds');
});


function imageResizeFunc(_folderName){
    gulp.src(config.img + '/' + _folderName + '/*.jpg')
        .pipe(imageResize({
        width: 450,
        height: 300,
        crop: true,
        upscale: false,
        gravity: 'Center',
        imageMagick: true,
    }))
        .pipe(imagemin())
        .pipe(gulp.dest(config.img.bldDir + '/birdsResized/' + _folderName));
};
