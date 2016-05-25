

var app = require('../app');
var namespace = require('./namespace');

var server = require('http').Server(app);
var io = require('socket.io')(server);
var __ = require('underscore');

function skio(){
    server.listen(app.get('port'), function() {
        console.log('listening!!!');
    });

    io.on('connection', function(socket){
        //------------------------------------------------------
        //PC、スマホからroomに入る申請を受け取り、ランダムに選んだ鳥のデータを返す
        //------------------------------------------------------
        //PC側からroomに入る手続き
        socket.on('PC_login',function(data){
            var roomID = data.id;
            socket.join(roomID);
            console.log('PC: '+ roomID);
        })
        
        //スマホ側からroomに入る手続き
        socket.on('SM_login',function(data){
            var roomID = data.id;
            socket.join(roomID);
            console.log('SM: '+ roomID);
            io.sockets.in(data.id).emit('SM_login')
        });
        

        //------------------------------------------------------
        //PCとスマホの連動に使われるsocket
        //------------------------------------------------------
        //アニメーション開始
        socket.on('startDisplay',function(data){
            var season = 'spring';
            var birdNames = giveBirdNames(season);
            io.sockets.in(data.id).emit('startDisplay',{
                birdNames: birdNames
            });
        });
        
        //スマホ側から鳥の画像にタップした時のイベント
        /*planeについているローマ字のネームタグから、日本語名も返す*/
        socket.on('selectBird',function(data){
            //日本語名取得
            var birdName = data.birdName;
            io.sockets.in(data.id).emit('selectBird',{
                birdName: birdName
            });
        });
        
        //PCで画像をクリックした時のイベント
        socket.on('checkData',function(data){
            io.sockets.in(data.id).emit('checkData',data);
        });
        
        //PCで季節を変えた時のイベント
        socket.on('changeSeason',function(data){
            var season = data.season;
            var birdNames = giveBirdNames(season);
            io.sockets.in(data.id).emit('changeSeason',{
                season: season,
                birdNames: birdNames
            });
        });
        
        //タップして画像の動きを制御
        socket.on('tapStart',function(data){
            io.sockets.in(data.id).emit('tapStart',data);
        });
        
        //タップして画像の動きを制御
        socket.on('tapMove',function(data){
            io.sockets.in(data.id).emit('tapMove',data);
        });
        
        //タップして画像の動きを制御
        socket.on('tapEnd',function(data){
            io.sockets.in(data.id).emit('tapEnd',data);
        });
        
        //スマホをshakeしたら鳥をシャッフル
        socket.on('shake',function(data){
            var season = data.season;
            var birdNames = giveBirdNames(season);
            io.sockets.in(data.id).emit('shake',{
                birdNames:birdNames
            });
        })
    });
    
    
    //------------------------------------------------------
    //ランダムに鳥のデータを選んで格納する
    //------------------------------------------------------
    function giveBirdNames(_season){
        var array = [];
        var planeNum = namespace.planeNum;
        var summer = namespace.birdNames.summer;
        var winter = namespace.birdNames.winter;
        var journey = namespace.birdNames.journey;
        var resident = namespace.birdNames.resident;
        switch(_season){
            case 'spring':
                var targets = resident.concat(journey);
                break;
            case 'summer':
                var targets = resident.concat(summer);
                break;
            case 'fall':
                var targets = resident.concat(journey);
                break;
            case 'winter':
                var targets = resident.concat(winter);
                break;
        }
        var len = targets.length;
        __.times(planeNum,function(){
            var ranNum = __.random(len - 1);
            array.push(targets[ranNum]);
        });
        return array;
    }
}

module.exports = skio;