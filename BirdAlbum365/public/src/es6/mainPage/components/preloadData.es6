
//------------------------------------------------------
//画像をプリロードする
//------------------------------------------------------

const Promise = require('es6-promise').Promise;
const $ = require('jquery');
const createjs = require('createjs');

module.exports = (NameSpace)=>{
    return new Promise((resolve)=>{
        const thisDevice = NameSpace.preset.thisDevice;

        //PCだけ、音楽をプリロード
        if (thisDevice === 'PC'){
            const PCLoader = new createjs.LoadQueue(false);
            PCLoader.installPlugin(createjs.Sound);
            PCLoader.loadFile({id:'audioSprite', src:'./json/birdSoundsSprite.json'});
            PCLoader.addEventListener('fileload', (data)=>{
                if (data.item.id === 'audioSprite'){
                    createjs.Sound.alternateExtensions = ['mp3'];
                    //manifestは配列に入っている必要があるので、jsonファイルを前もって配列で囲んでおく
                    const audioSpriteManifest = data.result;
                    createjs.Sound.registerSounds(audioSpriteManifest);
                }
            });
        }

        //PC,スマホが共にロードすべきもの
        const manifest = [
            {id:'emptyImg', src:'./img/dialbird.jpg'},
            {id:'planePositionsJSON', src:'./json/planePositions.json'},
            {id:'birdDataJSON', src:'./json/birdData.json'},
            {id:'birdSpriteImg', src:'./build/img/birdSprite.min.jpg'},
            {id:'birdSpriteJSON', src:'./json/birdSprite.json'},
            {id:'springImg', src:'./img/springEnv/springEnv.min.jpg'},
            {id:'summerImg', src:'./img/summerEnv/summerEnv.min.jpg'},
            {id:'fallImg', src:'./img/fallEnv/fallEnv.min.jpg'},
            {id:'winterImg', src:'./img/winterEnv/winterEnv.min.jpg'}
        ];
        const loader = new createjs.LoadQueue(false);
        loader.loadManifest(manifest);
        
        if (thisDevice === 'SM'){
            loader.addEventListener('progress',handleProgress_for_SM);
        } else if (thisDevice === 'PC'){
            loader.addEventListener('progress',handleProgress_for_PC);
        }
        
        loader.addEventListener('complete', ()=>{
            //Envマップを取得するために登録する
            NameSpace.preload.loader = loader;
            resolve(NameSpace);
        });

        
        //スマホで動くローディングアニメーション
        function handleProgress_for_SM(e){
            const $canvas = $('#canvas');
            const $loadWindow = $('.loadWindow');
            const $loadBar = $('.loadWindow__insideLoadBar');
            const $startWindow = $('.startWindow');
            const progress = e.progress*100;

            //ロードバーをアニメーション
            $loadBar.css('width',`${progress}%`);

            //ロードし終わったら
            if (progress === 100){
                $loadWindow.addClass('js-hide');
                $canvas.addClass('js-show');
                $startWindow.addClass('js-show');
            }
        }

        //PCで動くローディングアニメーション
        function handleProgress_for_PC(e){
            const progress = e.progress*100;

            //ロードバーをアニメーション
            $('.loadingWindow__insideLoadBar').css('width',`${progress}%`);

            //ロードし終わったら
            if (progress === 100){
                $('.loadingWindow').addClass('js-disappear');
                $('.QRCodeWindow').addClass('js-show');
            }
        }
    });
};




