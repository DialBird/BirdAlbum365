'use strict';


//------------------------------------------------------
//データをプリロードする
//------------------------------------------------------
preloadData();

function preloadData(){
    
    var manifest = [
        {id:'birdSpriteImg', src:'build/birdImages/birdSprite.min.jpg'},
        {id:'birdSpriteJSON', src:'json/birdSprite.json'},
        {id:'birdNamesJSON', src:'json/birdNames.json'}
    ];
    var loader = new createjs.LoadQueue(false);
    loader.addEventListener('fileload',handleFileload);
    loader.addEventListener('progress',handleProgress);
    loader.loadManifest(manifest);
};

function handleFileload(data){
    var type = data.item.type;
    switch(type){
        case 'image':
            if (data.item.id === 'birdSpriteImg') WebPage.Preload.birdSpriteImg = data.result;
            break;
        case 'json':
            if (data.item.id === 'birdSpriteJSON') WebPage.Preload.birdSpriteJSON = data.result;
            if (data.item.id === 'birdNamesJSON') WebPage.Preload.birdNamesJSON = data.result;
            break;
    }
};

//スマホのみで動くローディングアニメーション
function handleProgress(e){
    var progress = e.progress*100;
    //ロード進捗状況を知らせるイラスト
    $('.header__insideLoadingBar').css('width',progress+'%');
    if (progress === 100){
        $('.header__loadingBlock').addClass('js-hide');
        setTimeout(init,1000);
    }
}







