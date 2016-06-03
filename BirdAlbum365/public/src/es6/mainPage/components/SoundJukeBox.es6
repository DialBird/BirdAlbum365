
//------------------------------------------------------
//音声を管理するクラス
//------------------------------------------------------
/*
bgmのオンオフはBGM_stateとstartBGM~stopBGMまでの４つの関数で行う
BGM_stateは外部から操作し、これが「stop」になっている間は、４つの関数は機能しなくなる
このBGM_stateに直接関与するのはheaderにあるsoundのオンオフボタンと、一番最初の開始の時だけである
*/

//soundJSとpreloadJS両方
const createjs = require('createjs');

class SoundJukeBox{
    constructor(){
        this.birdNameList = '';
        this.specificBirdSoundChannel = '';
        this.BGMchannel = '';
        this.isAvailable = false;
        this.BGM_state = 'playing';
    }
    //特定の鳥の音声だけ流す
    playSpecificBirdSound(_birdName){
        const self = this;

        //インスタンス作成
        this.specificBirdSoundChannel = createjs.Sound.createInstance(_birdName);
        this.specificBirdSoundChannel.play();

        //もしインスタンスがなければreturn
        if (this.specificBirdSoundChannel.playState !== 'playSucceeded') return false;

        //もしBGMが流れていれば、一時的に停止する
        if (this.BGM_state === 'playing') this.BGMchannel._pause();

        //流し終えたらBGMの音量を元に戻す
        //toDo: もし特定の鳥の音声を流している間にBGMをオフにした場合、一回だけpauseした時の音楽が流れてしまうことに注意
        setTimeout(()=>{
            if (self.BGM_state === 'playing'){
                self.BGMchannel._resume();
            }
        },7500);

        return true;
    }
    stopSpecificBirdSound(){
        if (this.BGM_state === 'playing'){
            this.BGMchannel._resume();
        }
        this.specificBirdSoundChannel.stop();
    }
    //app側からsoundリストを受け取って、ランダムに音楽を流す
    setBirdNames(_birdNameList){
        this.birdNameList = _birdNameList;
    }
    startBGM(){
        //もしbgmをoffにしていればreturn
        if (this.BGM_state === 'stop') return;
        
        const self = this;
        this.BGMchannel = this.createRandomInstance();
        this.BGMchannel.play();
        
        //もし音楽の再生に失敗したらやり直し（鳥によっては音源が登録されていなかったり、うまくいかなかった場合にこの関数をやり直すため）
        if (this.BGMchannel.playState !== 'playSucceeded'){
            this.startBGM();
            return;
        }
        
        //一つのインスタンスを流し終えたら次のbgmを流し始める
        this.BGMchannel.on('complete', ()=>{
            self.startBGM();
        });
    }
    stopBGM(){
        if (this.BGM_state === 'playing') return;
        this.BGMchannel.stop();
    }
    createRandomInstance(){
        const len = this.birdNameList.length;
        const ranNum = Math.floor(Math.random()*len);
        const birdName = this.birdNameList[ranNum];
        const instance = createjs.Sound.createInstance(birdName);
        return instance;
    }
}

module.exports = SoundJukeBox;



