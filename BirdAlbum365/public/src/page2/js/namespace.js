'use strict';

//------------------------------------------------------------------------------------------------------------
//BirdAlbumProject名前空間宣言
//------------------------------------------------------------------------------------------------------------

var BirdAlbumProject = BirdAlbumProject || {};
BirdAlbumProject = {
    //socket
    socket: io.connect(),
    //roomID
    this_roomID: $('#roomID').val(),
    //デバイス判定(PCかスマホ（SM）かを判定する)
    thisDevice: $('#thisDevice').val(),
    //planeを配置する初期位置を格納
    planePositions: '',
    //鳥の日本語名や季節など
    birdData: '',
    //スプライト画像
    spriteImage: '',
    //スプライト画像の位置座標
    spriteJSON: '',
    //EnvMap
    envSpriteImg: [],
    envSpriteJSON: [],
    //emptyの画像
    emptyImg: [],
    //現在のシーズン
    season:'spring',
    //loader
    loader:''
};

