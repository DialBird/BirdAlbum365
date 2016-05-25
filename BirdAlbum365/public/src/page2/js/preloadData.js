
//------------------------------------------------------
//画像をプリロードする
//------------------------------------------------------

'use strict';


//この段階から、スマホスクロールに制限をかけておきたい
$(window).on('touchmove.noScroll', function(e) {
    e.preventDefault();
});


preloadData();

function preloadData(){
    var thisDevice = BirdAlbumProject.thisDevice;
    var PCLoader,PCManifest,loader,manifest;
    
    //PCだけ、プリロードするもの
    (function(){
        if (thisDevice === 'PC'){
            var PCManifest = [
                {id:'audioSprite', src:'/json/birdSoundsSprite.json'},
                {id:'birdData', src:'/json/birdData.json'},
            ];
            var PCLoader = new createjs.LoadQueue(false);
            PCLoader.installPlugin(createjs.Sound);
            PCLoader.loadManifest(PCManifest);
            PCLoader.addEventListener('fileload',function(data){
                if (data.item.id === 'audioSprite'){
                    createjs.Sound.alternateExtensions = ['mp3'];
                    //manifestは配列に入っている必要があるので、jsonファイルを前もって配列で囲んでおく
                    var audioSpriteManifest = data.result;
                    createjs.Sound.registerSounds(audioSpriteManifest);
                }
                if (data.item.id === 'birdData') BirdAlbumProject.birdData = data.result;
            });
        }
    }());
    
    //PC,スマホが共にロードすべきもの
    manifest = [
        {id:'empty', src:'/img/dialbird.jpg'},
        {id:'planePositions', src:'/json/planePositions.json'},
        {id:'spriteImg', src:'/build/birdImages/birdSprite.min.jpg'},
        {id:'imageSprite', src:'/json/birdSprite.json'},
//        {id:'springSpriteImg', src:'/img/springEnv/springSprite.jpg'},
//        {id:'springSpriteJSON', src:'/json/springSprite.json'},
//        {id:'summerSpriteImg', src:'/img/summerEnv/summerSprite.jpg'},
//        {id:'summerSpriteJSON', src:'/json/summerSprite.json'},
//        {id:'fallSpriteImg', src:'/img/fallEnv/fallSprite.jpg'},
//        {id:'fallSpriteJSON', src:'/json/fallSprite.json'},
//        {id:'winterSpriteImg', src:'/img/winterEnv/winterSprite.jpg'},
//        {id:'winterSpriteJSON', src:'/json/winterSprite.json'},
        {id:'springImg', src:'/img/springEnv/springEnv.min.jpg'},
        {id:'summerImg', src:'/img/summerEnv/summerEnv.min.jpg'},
        {id:'fallImg', src:'/img/fallEnv/fallEnv.min.jpg'},
        {id:'winterImg', src:'/img/winterEnv/winterEnv.min.jpg'},
    ];
    var loader = new createjs.LoadQueue(false);
    loader.addEventListener('fileload',handleFileload);
    if (thisDevice === 'SM'){
        loader.addEventListener('progress',handleProgress_for_SM);
    }else if(thisDevice === 'PC'){
        loader.addEventListener('progress',handleProgress_for_PC);
    }
    loader.addEventListener('complete',init);
    loader.loadManifest(manifest,true);
    BirdAlbumProject.loader = loader;
};

function handleFileload(data){
    var type = data.item.type;
    switch(type){
        case 'image':
            if (data.item.id === 'empty') BirdAlbumProject.emptyImg = data.result;
            if (data.item.id === 'spriteImg') BirdAlbumProject.spriteImage = data.result;
//            if (data.item.id === 'springSpriteImg') BirdAlbumProject.envSpriteImg['spring'] = data.result;
//            if (data.item.id === 'summerSpriteImg') BirdAlbumProject.envSpriteImg['summer'] = data.result;
//            if (data.item.id === 'fallSpriteImg') BirdAlbumProject.envSpriteImg['fall'] = data.result;
//            if (data.item.id === 'winterSpriteImg') BirdAlbumProject.envSpriteImg['winter'] = data.result;
            
            break;
        case 'json':
            if (data.item.id === 'planePositions') BirdAlbumProject.planePositions = data.result;
//            if (data.item.id === 'springSpriteJSON') BirdAlbumProject.envSpriteJSON['spring'] = data.result;
//            if (data.item.id === 'summerSpriteJSON') BirdAlbumProject.envSpriteJSON['summer'] = data.result;
//            if (data.item.id === 'fallSpriteJSON') BirdAlbumProject.envSpriteJSON['fall'] = data.result;
//            if (data.item.id === 'winterSpriteJSON') BirdAlbumProject.envSpriteJSON['winter'] = data.result;
            if (data.item.id === 'imageSprite') BirdAlbumProject.spriteJSON = data.result;
            break;
    }
};

//スマホで動くローディングアニメーション
function handleProgress_for_SM(e){
    var $canvas = $('#canvas');
    var $loadWindow = $('.loadWindow');
    var $loadBar = $('.loadWindow__insideLoadBar');
    var $startWindow = $('.startWindow');
    var progress = e.progress*100;
    
    //ロードバーをアニメーション
    $loadBar.css('width',progress+'%');
    
    //ロードし終わったら
    if(progress === 100){
        $loadWindow.addClass('js-hide');
        $canvas.addClass('js-show');
        $startWindow.addClass('js-show');
    }
}



//PCで動くローディングアニメーション
function handleProgress_for_PC(e){
    var progress = e.progress*100;
    
    //ロードバーをアニメーション
    $('.loadingWindow__insideLoadBar').css('width',progress+'%');
    
    //ロードし終わったら
    if(progress === 100){
        $('.loadingWindow').addClass('js-disappear');
        $('.QRCodeWindow').addClass('js-show');
//        $canvas.addClass('js-show');
//        $startWindow.addClass('js-show');
    }
}







