'use strict';



function SoundJukeBox(_$birdNavSoundIcon){
    this.birdNameList = '';
    this.specificBirdSoundChannel = '';
    this.BGMchannel = '';
    this.BGM_state = 'stop';
    this.specificBirdSoundChannel_state = 'stop';

    //CSSをアニメーションする対象
    this.$birdNavSoundIcon = _$birdNavSoundIcon;

};
SoundJukeBox.prototype = {
    playSpecificBirdSound: function(_birdName){
        var self = this;
        this.specificBirdSoundChannel_state = 'playing';
        this.pauseBGM();
        this.$birdNavSoundIcon.addClass('js-turnPink');
        this.specificBirdSoundChannel = createjs.Sound.createInstance(_birdName);
        this.specificBirdSoundChannel.play();
        if(this.specificBirdSoundChannel.playState !== 'playSucceeded'){
            self.specificBirdSoundChannel_state = 'stop';
            self.$birdNavSoundIcon.removeClass('js-turnPink');
            self.resumeBGM();
            return;
        }
        this.specificBirdSoundChannel.on('complete',function(){
            self.specificBirdSoundChannel_state = 'stop';
            self.$birdNavSoundIcon.removeClass('js-turnPink');
            self.resumeBGM();
        });
    },
    stopSpecificBirdSound: function(){
        this.specificBirdSoundChannel_state = 'stop';
        this.$birdNavSoundIcon.removeClass('js-turnPink');
        this.resumeBGM();
        this.specificBirdSoundChannel.stop();
    },
    setBirdNames: function(_birdNameList){
        this.birdNameList = _birdNameList;
    },
    startBGM: function(){
        var self = this;
        this.BGM_state = 'playing';
        this.BGMchannel = this.createRandomInstance();
        this.BGMchannel.play();
        if(this.BGMchannel.playState !== 'playSucceeded'){
            return this.startBGM();
        }
        this.BGMchannel.on('complete',function(){
            self.startBGM();
        });
    },
    pauseBGM: function(){
        this.BGMchannel._pause();
        this.BGM_state = 'pause';
    },
    resumeBGM: function(){
        this.BGMchannel._resume();
        this.BGM_state = 'playing';
    },
    stopBGM: function(){
        this.BGMchannel.stop();
        this.BGM_state = 'stop';
    },
    createRandomInstance: function(){
        var len = this.birdNameList.length;
        var ranNum = _.random(len - 1);
        var birdName = this.birdNameList[ranNum];
        var instance = createjs.Sound.createInstance(birdName);
        return instance;
    }
};






