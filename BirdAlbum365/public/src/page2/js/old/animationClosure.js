'use strict';



//------------------------------------------------------
//アニメーションを変える核となる変数を監視し、処理を変えるシステム。（クロージャ）
//------------------------------------------------------
function animationClosure(_planes,_cylinderParents,_skyBox){
    
    //------------------------------------------------------
    //ローカル変数の設定
    //------------------------------------------------------
    
    //グローバルから参照にする変数
    var thisDevice = BirdAlbumProject.thisDevice;
    var cylinderPos = BirdAlbumProject.planePositions;

    var planes = _planes;
    var planeNum = planes.length;
    var cylinderParents = _cylinderParents;
    var cylinderParentNum = cylinderParents.length;
    var skyBox = _skyBox;
    
    //PCのみ使うDOMキャッシュ
    if(thisDevice === 'PC'){
        var $birdNavWindow = $('.birdNavWindow');
        var $birdName = $('.birdNavWindow__birdName');
        var $birdImageBlock = $('.birdNavWindow__birdPicture');
    }
    
    //ループ用の変数
    var i;
    
    //アニメーションを変更する核となる変数。これが変わることによってアニメーションモードが変わる
    var displayMode = 'cylinder';
    var animationMode = 'off';
    var rotationSpeed = 0.05;
    var rotateSwitchs = [true,true,true,true,true]
    
    //アニメーションモードを変更する
    this.changeAnimationMode = function(_animationMode){
        animationMode = _animationMode;
    };
    
    //rotateSwitchを変更する
    this.changeRotateSwitch = function(_num,_bool){
        rotateSwitchs[_num] = _bool;
    };
    
    //特定の親オブジェクトを特定の方向に回転させる
    this.rotateSpecificParent = function(_num,_speed){
        cylinderParents[_num].rotation.y += _speed;
    }
    
    //アニメーションを最初に振り分けるオブサーバー
    this.observe = function(){
        switch(displayMode){
            case 'cylinder':
                this.controlCylinderAnimation();
                break;
        }
    };
    
    //円柱状態に配置した際のアニメーションの振り分けを行う
    //appearなどのモードでは、関数を一回だけ発動させたいので、モードを変えた後にすぐにモードをoffにして、連続して発動するのを防ぐ
    this.controlCylinderAnimation = function(){
        switch(animationMode){
            case 'start':
                break;
            case 'normal':
                for(i=0;i<cylinderParentNum;i++){
                    if (rotateSwitchs[i] === false) continue;
                    cylinderParents[i].rotation.y += rotationSpeed*Math.PI/180*Math.pow(-1,i);
                }
                break;
            case 'appear':
                this.rotateAppearAnimation(cylinderParents,planes);
                animationMode = 'off';
                break;
            case 'disappear':
                this.rotateDisppearAnimation(cylinderParents,planes);
                animationMode = 'off';
                break;
            case 'off':
                //stopAnimation
                break;
        }
    };
    
    //回転しながら現れる
    this.rotateAppearAnimation = function(){
        var _param = {rotationY: 1*Math.PI/180, alpha:0};
        var _tween = new TWEEN.Tween(_param)
        .to({rotationY: 0, alpha:1},1000)
        .onUpdate(function(){
            for(i=0;i<cylinderParentNum;i++){
                var _rotateDir = Math.pow(-1,i);
                cylinderParents[i].rotation.y += _rotateDir*this.rotationY;
            }
            for(i=0;i<planeNum;i++){
                planes[i].material.opacity = this.alpha;
            }
        })
        .onComplete(function(){
            animationMode = 'normal';
        })
        .start();
    };
    
    //回転しながら消える
    this.rotateDisppearAnimation = function(){
        var _param = {rotationY: 0, alpha:1};
        var _tween = new TWEEN.Tween(_param)
        .to({rotationY: 1*Math.PI/180, alpha:0},1000)
        .onUpdate(function(){
            //
            for(i=0;i<cylinderParentNum;i++){
                var _rotateDir = Math.pow(-1,i);
                cylinderParents[i].rotation.y += _rotateDir*this.rotationY;
            }
            //
            for(i=0;i<planeNum;i++){
                planes[i].material.opacity = this.alpha;
            }
        })
        .onComplete(function(){
            animationMode = 'off';
        })
        .start();
    };
};

