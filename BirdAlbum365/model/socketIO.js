
const app = require('../app');
const server = require('http').Server(app);
const io = require('socket.io')(server);

const entity = require('./entity');

module.exports = ()=>{
    server.listen(app.get('port'), ()=>{
        console.log('listening!!');
    });
    
    io.on('connection', (socket)=>{
        //------------------------------------------------------
        //PC、スマホからroomに入る申請を受け取り、ランダムに選んだ鳥のデータを返す
        //------------------------------------------------------
        //PC側からroomに入る手続き
        socket.on('PC_login', (data)=>{
            const roomID = data.id;
            socket.join(roomID);
            console.log('PC: '+ roomID);
        })

        //スマホ側からroomに入る手続き
        socket.on('SM_login', (data)=>{
            const roomID = data.id;
            socket.join(roomID);
            console.log('SM: '+ roomID);
            io.sockets.in(data.id).emit('SM_login')
        });
        
        //------------------------------------------------------
        //PCとスマホの連動に使われるsocket
        //------------------------------------------------------
        //アニメーション開始
        socket.on('startDisplay', (data)=>{
            console.log('startDisplay');
            //最初の季節は春
            const season = 'spring';
            const birdNames = getBirdNames(season);
            io.sockets.in(data.id).emit('startDisplay',{
                birdNames: birdNames
            });
        });

        //スマホ側から鳥の画像にタップした時のイベント
        /*planeについているローマ字のネームタグから、日本語名も返す*/
        socket.on('selectBird', (data)=>{
            //日本語名取得
            const birdName = data.birdName;
            io.sockets.in(data.id).emit('selectBird',{
                birdName: birdName
            });
        });
        
        //PCで画像をクリックした時のイベント
        socket.on('checkData', (data)=>{
            io.sockets.in(data.id).emit('checkData',data);
        });

        //PCで季節を変えた時のイベント
        socket.on('changeSeason', (data)=>{
            const season = data.season;
            const birdNames = getBirdNames(season);
            io.sockets.in(data.id).emit('changeSeason',{
                season: season,
                birdNames: birdNames
            });
        });
        
        //タップして画像の動きを制御
        socket.on('tapStart', (data)=>{
            io.sockets.in(data.id).emit('tapStart',data);
        });

        //タップして画像の動きを制御
        socket.on('tapMove', (data)=>{
            io.sockets.in(data.id).emit('tapMove',data);
        });

        //タップして画像の動きを制御
        socket.on('tapEnd', (data)=>{
            io.sockets.in(data.id).emit('tapEnd',data);
        });

        //スマホをshakeしたら鳥をシャッフル
        socket.on('shake', (data)=>{
            const season = data.season;
            const birdNames = getBirdNames(season);
            io.sockets.in(data.id).emit('shake',{
                birdNames:birdNames
            });
        });
    });

    //------------------------------------------------------
    //ランダムに鳥のデータを選んで格納する
    //------------------------------------------------------
    function getBirdNames(_season){
        const array = [];
        const planeNum = entity.planeNum;
        const summer = entity.birdNames.summer;
        const winter = entity.birdNames.winter;
        const journey = entity.birdNames.journey;
        const resident = entity.birdNames.resident;
        let targets;
        switch (_season){
            case 'spring':
                targets = resident.concat(journey);
                break;
            case 'summer':
                targets = resident.concat(summer);
                break;
            case 'fall':
                targets = resident.concat(journey);
                break;
            case 'winter':
                targets = resident.concat(winter);
                break;
        }
        let i;
        for (i=0;i<planeNum;i++){
            const ranNum = Math.floor(Math.random()*targets.length);
            array.push(targets[ranNum]);
        }
        
        return array;
    }
};
