
//------------------------------------------------------
//データをプリロードする
//------------------------------------------------------

const Promise = require('es6-promise').Promise;
const $ = require('jquery');
const createjs = require('createjs');


module.exports = (NameSpace)=>{
    return new Promise((resolve)=>{
        const manifest = [
            {id:'birdSpriteImg', src:'./build/img/birdSprite.min.jpg'},
            {id:'birdSpriteJSON', src:'json/birdSprite.json'},
            {id:'birdNamesJSON', src:'json/birdNames.json'}
        ];
        const loader = new createjs.LoadQueue(false);
        loader.addEventListener('fileload',handleFileload);
        loader.addEventListener('progress',handleProgress);
        loader.loadManifest(manifest);
        
        function handleFileload(data){
            const type = data.item.type;
            switch (type){
                case 'image':
                    if (data.item.id === 'birdSpriteImg') NameSpace.Preload.birdSpriteImg = data.result;
                    break;
                case 'json':
                    if (data.item.id === 'birdSpriteJSON') NameSpace.Preload.birdSpriteJSON = data.result;
                    if (data.item.id === 'birdNamesJSON') NameSpace.Preload.birdNamesJSON = data.result;
                    break;
            }
        }

        function handleProgress(e){
            const progress = e.progress*100;
            //ロード進捗状況を知らせるイラスト
            $('.header__insideLoadingBar').css('width',`${progress}%`);
            if (progress === 100){
                $('.header__loadingBlock').addClass('js-hide');
                setTimeout(()=>{
                    resolve(NameSpace);
                }, 1000);
            }
        }
    });
    
};









