var socket = io.connect();

var this_roomID;     //roomIDをここでも取得

var sound_send_switch = true;  //これがtrueになっていればsoundをsocket送信

var now_mode;

$('#mode').on('change',function(){
    now_mode = $('#mode').val();
    console.log(now_mode);
})

//PC側から送られてくるroomIDを受け取る（特定のroomに発信するため）
socket.on('give_id',function(data){
    this_roomID = data;
})

var input;
var analyzer;

var mic, rec;

function setup(){
    mic = new p5.AudioIn();
    mic.start();
    
    rec = new p5.SpeechRec();
    rec.onResult = showResult;
}

$('#command_btn').on('click',function(){
    rec.start();
})

function draw(){
//    //音量取得
//    var vol = mic.getLevel();
    
//    if(now_mode == 'sound'){
//        if(vol > 0.01){
//            if(sound_send_switch){
//                sound_send_switch = false;
//                socket.emit('sound',{
//                    id: this_roomID
//                });
//                //連続でsoundを送信するのを防ぐ
//                setTimeout(function(){
//                    sound_send_switch = true;
//                },100)
//            }
//        }
//    }
}

function showResult(){
    console.log('you said '+rec.resultString);
    if(rec.resultString.indexOf('爆発') >= 0){
        socket.emit('voice',{
            id: this_roomID,
            command: 'blast'
        });
    }
    if(rec.resultString.indexOf('回転') >= 0){
        socket.emit('voice',{
            id: this_roomID,
            command: 'rotate'
        });
    }
    if(rec.resultString.indexOf('色変え') >= 0){
        socket.emit('voice',{
            id: this_roomID,
            command: 'color'
        });
    }
    if(rec.resultString.indexOf('カラス') >= 0){
        socket.emit('special',{
            id: this_roomID
        });
    }
    if(rec.resultString.indexOf('戻れ') >= 0){
        socket.emit('goback',{
            id: this_roomID
        });
    }
    
}

//テストよう
//$('#title').on('click',function(){
//    socket.emit('voice',{
//        id: this_roomID,
//        command: 'rotate'
//    });
//})