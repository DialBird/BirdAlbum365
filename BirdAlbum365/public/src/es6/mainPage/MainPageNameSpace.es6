
//require('socket.io')はサーバー用
const io = require('socket');
const $ = require('jquery');

//名前空間
const MainPageNameSpace = {
    preset: {
        //socket
        socket: io.connect(),
        //roomID
        this_roomID: $('#roomID').val(),
        //デバイス判定(PCかスマホ（SM）かを判定する)
        thisDevice: $('#thisDevice').val()
    },
    preload: {
        //鳥の日本語名や季節など
        birdData: '',
        //emptyの画像
        emptyImg: [],
        //表示する鳥のスプライト画像
        spriteImage: '',
        //planeを配置する初期位置を格納
        planePositions: '',
        //鳥のスプライト画像の位置座標
        spriteJSON: '',
        loader: ''
    },
    //EnvMap
    envSpriteImg: [],
    //init処理で積む
    init: {
        scene: '',
        camera: '',
        planes: '',
        //RayCastClosure
        RCC: '',
        //周りの景色を貼る球体オブジェクト
        omniSphere: '',
        //AnimationClosure
        AC: ''
    },
    main: {
        //現在のシーズン
        season:'spring'
    }
};