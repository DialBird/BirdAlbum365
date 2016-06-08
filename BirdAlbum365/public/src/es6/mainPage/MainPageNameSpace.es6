
//require('socket.io')はサーバー用
const io = require('socket');
const $ = require('jquery');

//名前空間(グローバル変数を格納）
const MainPageNameSpace = {
	//jadeファイルから読み込む
    preset: {
        //socket
        socket: io.connect(),
        //roomID
        this_roomID: $('#roomID').val(),
        //デバイス判定(PCかスマホ（SM）かを判定する)
        thisDevice: $('#thisDevice').val()
    },
	//preloadData.es6ファイルで格納
    preload: {
		//preloadした画像やJSONファイルなどを格納
        loader: ''
    },
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
