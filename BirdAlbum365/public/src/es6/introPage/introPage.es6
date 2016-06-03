
//プロセスモジュール
const preloadData = require('./components/preloadData');
const init = require('./components/init');
const main = require('./components/main');

//名前空間
const NameSpace = {
    Preload:{
        birdSpriteImg: '',
        birdSpriteJSON: '',
        birdNamesJSON: ''
    },
    Canvas:{
        scene:'',
        camera:'',
        renderer:''
    }
};


//プロセス
preloadData(NameSpace)
    .then(init)
    .then(main);
