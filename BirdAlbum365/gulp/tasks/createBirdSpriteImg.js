
const gulp = require('gulp');
const spritesmith = require('gulp.spritesmith');

const config = require('../config');

gulp.task('createBirdSpriteImg', ()=>{
//    gulp.src(path.join(birdImg_dist,'birdsDistorted/**/*.jpg'))
    gulp.src(config.img.bldDir + '/birdsDistorted/**/*.jpg')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.json',
            padding:10
        }))
        .pipe(config.img.bldDir);
});