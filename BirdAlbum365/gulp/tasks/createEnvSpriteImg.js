
const gulp = require('gulp');
const spritesmith = require('gulp.spritesmith');

const config = require('../config');

gulp.task('createEnvSpriteImg',function(){
    createSprite('spring');
    createSprite('summer');
    createSprite('fall');
    createSprite('winter');
    function createSprite(_season){
//        gulp.src(path.join('public/img/'+_season+'Env/*.png'))
        gulp.src(config.img.src + '/' + _season + '/Env/*.png')
            .pipe(spritesmith({
            imgName: _season+'Sprite.png',
            cssName: _season+'Sprite.json',
            padding:10
        }))
        .pipe(gulp.dest(config.img.bldDir + '/' + _season + '/Env'));
//        .pipe(gulp.dest('public/img/'+_season+'Env'));
    };
});