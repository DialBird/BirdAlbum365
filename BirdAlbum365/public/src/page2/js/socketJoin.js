

//------------------------------------------------------
//PCとスマホを一対一で接続する仕組み
//------------------------------------------------------

//------------------------------------------------------
//roomにJoinさせる
//------------------------------------------------------
(function(){
    var socket = BirdAlbumProject.socket;
    var thisDevice = BirdAlbumProject.thisDevice;
    var this_roomID = BirdAlbumProject.this_roomID;
    
    if(thisDevice === 'PC'){
        socket.emit('PC_login',{
            id: this_roomID
        });
    }else if(thisDevice === 'SM'){
        socket.emit('SM_login',{
            id: this_roomID
        });
    }
}());

//------------------------------------------------------
//PC側はスマホに向けてQRコードを作成
//------------------------------------------------------
(function(){
    var thisDevice = BirdAlbumProject.thisDevice;
    var this_roomID = BirdAlbumProject.this_roomID;
    var thisDevice = BirdAlbumProject.thisDevice;
    console.log(this_roomID);
    if(thisDevice === 'PC'){
//        $('#QRCode').qrcode('http://172.17.11.56:3000/smartphone?id='+this_roomID);        //アクセス先のURLを指定
        $('#QRCode').qrcode('birdalbum356.herokuapp.com/smartphone?id='+this_roomID);        //アクセス先のURLを指定
    };
}());
