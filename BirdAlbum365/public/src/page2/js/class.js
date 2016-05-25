'use strict';


//------------------------------------------------------
//音声を管理するクラス
//------------------------------------------------------
/*
bgmのオンオフはBGM_stateとstartBGM~stopBGMまでの４つの関数で行う
BGM_stateは外部から操作し、これが「stop」になっている間は、４つの関数は機能しなくなる
このBGM_stateに直接関与するのはheaderにあるsoundのオンオフボタンと、一番最初の開始の時だけである
*/

function SoundJukeBox(){
    this.birdNameList = '';
    this.specificBirdSoundChannel = '';
    this.BGMchannel = '';
    this.isAvailable = false;
    this.BGM_state = 'playing';

};
SoundJukeBox.prototype = {
    //特定の鳥の音声だけ流す
    playSpecificBirdSound: function(_birdName){
        var self = this;
        
        //インスタンス作成
        this.specificBirdSoundChannel = createjs.Sound.createInstance(_birdName);
        this.specificBirdSoundChannel.play();

        //もしインスタンスがなければreturn
        if(this.specificBirdSoundChannel.playState !== 'playSucceeded') return false;
        
        //もしBGMが流れていれば、一時的に停止する
        if(this.BGM_state === 'playing') this.BGMchannel._pause();
        
        //流し終えたらBGMの音量を元に戻す
        //toDo: もし特定の鳥の音声を流している間にBGMをオフにした場合、一回だけpauseした時の音楽が流れてしまうことに注意
        setTimeout(function(){
            if (self.BGM_state === 'playing'){
                self.BGMchannel._resume();
            }
        },7500);
        
        return true;
    },
    stopSpecificBirdSound: function(){
        if (this.BGM_state === 'playing'){
            this.BGMchannel._resume();
        }
        this.specificBirdSoundChannel.stop();
    },
    
    //app側からsoundリストを受け取って、ランダムに音楽を流す
    setBirdNames: function(_birdNameList){
        this.birdNameList = _birdNameList;
    },
    startBGM: function(){
        if (this.BGM_state === 'stop') return;
        var self = this;
        this.BGMchannel = this.createRandomInstance();
        this.BGMchannel.play();
        if(this.BGMchannel.playState !== 'playSucceeded'){
            return this.startBGM();
        }
        this.BGMchannel.on('complete',function(){
            self.startBGM();
        });
    },
    stopBGM: function(){
        if (this.BGM_state === 'playing') return;
        this.BGMchannel.stop();
    },
    createRandomInstance: function(){
        var len = this.birdNameList.length;
        var ranNum = Math.floor(Math.random()*len);
        var birdName = this.birdNameList[ranNum];
        var instance = createjs.Sound.createInstance(birdName);
        return instance;
    }
};


//------------------------------------------------------
//skyBoxの支配をするクラス(OmniSphereに変更)
//------------------------------------------------------
//function SkyBox(_scene){
//    this.scene = _scene;
//    this.envPlanes = [];
//    this.envPlaneSize = 3000;
//    this.envSpriteImg = BirdAlbumProject.envSpriteImg;
//    this.envSpriteJSON = BirdAlbumProject.envSpriteJSON;
//};
//SkyBox.prototype = {
//    create: function(){
//        var envPlaneSize = this.envPlaneSize;
//        var scene = this.scene;
//        var envPlanes = this.envPlanes;
//        var i,len = 6;
//        for(var i=0;i<len;i++){
//            var eG = new THREE.PlaneGeometry( envPlaneSize, envPlaneSize);
//            var eM = new THREE.MeshBasicMaterial({transparent:true,opacity:1});
//            var envPlane = new THREE.Mesh(eG,eM);
//            if(i === 0) {envPlane.position.set(0,0,envPlaneSize/2);envPlane.rotation.set(0,-180*Math.PI/180,0);}
//            if(i === 1) {envPlane.position.set(envPlaneSize/2,0,0);envPlane.rotation.set(0,-90*Math.PI/180,0);}
//            if(i === 2) {envPlane.position.set(0,0,-envPlaneSize/2);envPlane.rotation.set(0,0*Math.PI/180,0);}
//            if(i === 3) {envPlane.position.set(-envPlaneSize/2,0,0);envPlane.rotation.set(0,90*Math.PI/180,0);}
//            if(i === 4) {envPlane.position.set(0,-envPlaneSize/2,0);envPlane.rotation.set(-90*Math.PI/180,0,Math.PI);}
//            if(i === 5) {envPlane.position.set(0,envPlaneSize/2,0);envPlane.rotation.set(90*Math.PI/180,0,Math.PI);}
//            scene.add(envPlane);
//            envPlanes.push(envPlane);
//        }
//
//    },
//    changeMode: function(_season){
//        var season = _season;
//        var envPlanes = this.envPlanes;
//        var spriteImg = this.envSpriteImg[season];
//        var spriteJSON = this.envSpriteJSON[season];
//        var sprites = [];
//        var i,len = envPlanes.length;
//        for(i=0;i<len;i++){
//            var data = spriteJSON['000'+(i+1)];
//            var sourceX = data.x;
//            var sourceY = data.y;
//            var sourceWidth = data.width;
//            var sourceHeight = data.height;
//            var imageCanvas = document.createElement('canvas');
//            var ctx = imageCanvas.getContext('2d');
//            var size = 1024;
//            imageCanvas.width = imageCanvas.height = size;
//            ctx.drawImage(spriteImg,sourceX,sourceY,sourceWidth,sourceHeight,0,0,size,size);
//            var texture = new THREE.Texture(imageCanvas);
//            texture.needsUpdate = true;
//            envPlanes[i].material.map = texture;
//        }
//    },
//    fadeOut: function(){
//        var envPlanes = this.envPlanes;
//        var i,len = envPlanes.length;
//        for(i=0;i<len;i++){
//            TweenLite.fromTo(envPlanes[i].material,1,{opacity:1},{opacity:0});
//        }
//    },
//    fadeIn: function(){
//        var envPlanes = this.envPlanes;
//        var i,len = envPlanes.length;
//        for(i=0;i<len;i++){
//            TweenLite.fromTo(envPlanes[i].material,1,{opacity:0},{opacity:1});
//        }
//    }
//};


function OmniSphere(scene){
    this.loader = BirdAlbumProject.loader;
    this.scene = scene;
    this.geometry = '';
};
OmniSphere.prototype = {
    createOmniSphere: function(){
        var self = this;
        var sphereG = new THREE.SphereGeometry(1000,32,32);
        var sphereM = new THREE.MeshBasicMaterial({transparent:true,opacity:1,side:THREE.DoubleSide});
        var sphere = new THREE.Mesh(sphereG,sphereM);
        self.scene.add(sphere);
        this.geometry = sphere;
    },
    changeMode: function(season){
        var texture = new THREE.Texture(this.loader.getResult(season+'Img'));
        texture.needsUpdate = true;
        this.geometry.material.map = texture;
    },
    fadeOut: function(){
        TweenLite.fromTo(this.geometry.material,1,{opacity:1},{opacity:0});
    },
    fadeIn: function(){
        TweenLite.fromTo(this.geometry.material,1,{opacity:0},{opacity:1});
    }
};


//------------------------------------------------------
//rayCastの支配をするクロージャ
//------------------------------------------------------
function rayCastClosure(_camera,_$canvas,_canWidth,_canHeight,_planes){

    //グローバルから取ってくるもの
    var socket = BirdAlbumProject.socket;
    var this_roomID = BirdAlbumProject.this_roomID;
    var thisDevice = BirdAlbumProject.thisDevice;

    //initから
    var camera = _camera;
    var $canvas = _$canvas;
    var canWidth = _canWidth;
    var canHeight = _canHeight;
    var planes = _planes

    //rayCastをオンオフするスイッチ（鳥の説明が出ている間はオフにするため）
    var rayCastSwitch = false;

    //アルバムを動かすためにタップしたのと、写真を選択するためにタップしたのかを判定するための変数
    var isClicked = false;

    var ray = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    var parentObjectName = '';
    var prevPosition = '';
    var speed = 0;

    $canvas.on({
        'touchstart': handleMouseDown,
//        'mousedown': handleMouseDown,
        'touchmove': handleMouseMove,
//        'mousemove': handleMouseMove,
        'touchend': handleMouseUp,
//        'mouseup': handleMouseUp
    })

    //rayCastSwitchを変更する
    this.changeRayCastSwitch = function(_bool){
        rayCastSwitch = _bool;
    };

    function handleMouseDown(e){
        //鳥の説明出すための判定はこれだけでじゅうぶん
        isClicked = true;
        //以下はタップスライドのためのもの
        if(rayCastSwitch === false) return;
        speed = 0;
        mouse.x = (e.originalEvent.pageX/canWidth)*2 - 1;
        mouse.y = -(e.originalEvent.pageY/canHeight)*2 + 1;
        ray.setFromCamera(mouse,camera);
        var intersects = ray.intersectObjects(planes);
        if(intersects.length > 0){
            var target = intersects[0];
            parentObjectName = target.object.parent.name;
            prevPosition = {x:mouse.x, y:mouse.y};
            socket.emit('tapStart',{
                id: this_roomID,
                parentObjectName: parentObjectName,
            });
        }
    };

    function handleMouseMove(e){
        //鳥の説明出すための判定はこれだけでじゅうぶん
        isClicked = false;

        //以下はタップスライドのためのもの
        //何も動かしていない
        if(!prevPosition) return;
        //画像を動かす()
        mouse.x = (e.originalEvent.pageX/canWidth)*2 - 1;
        speed = (prevPosition.x - mouse.x) *0.01;
        socket.emit('tapMove',{
            id: this_roomID,
            parentObjectName: parentObjectName,
            speed: speed
        });
    }

    //Raycastを飛ばす
    function handleMouseUp(e){

        (function(){
            //止めてそのまま話す
            prevPosition = '';
            socket.emit('tapEnd',{
                id: this_roomID,
                parentObjectName: parentObjectName,
                speed: speed
            });
        }());

        //鳥の解説を出すsocket
        if(isClicked){
            isClicked = false;
            if(rayCastSwitch === false){return;}
            mouse.x = (e.originalEvent.pageX/canWidth)*2 - 1;
            mouse.y = -(e.originalEvent.pageY/canHeight)*2 + 1;
            //mouseoverの場合は、マウスがcanvas上にある時のみに指定しないと上手くいかなくなるので注意しておくこと
            ray.setFromCamera(mouse,camera);
            var intersects = ray.intersectObjects(planes);
            if(intersects.length > 0){
                var target = intersects[0];
                if(thisDevice === 'PC'){
                    socket.emit('checkData',{
                        id: this_roomID,
                        name: target.object.name,
                        birdName: target.object.birdName,
                        pos: target.object.position
                    });
                    socket.emit('selectBird',{
                        id: this_roomID,
                        birdName: target.object.birdName
                    });
                }else if(thisDevice === 'SM'){
                    socket.emit('selectBird',{
                        id: this_roomID,
                        birdName: target.object.birdName
                    })
                }
            }
        }
    }
}


//------------------------------------------------------
//アニメーションを変える核となる変数を監視し、処理を変えるシステム。（クロージャ）
//------------------------------------------------------
function animationClosure(_planes,_cylinderParents){

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
                this.rotateAppearAnimation();
                animationMode = 'off';
                break;
            case 'disappear':
                this.rotateDisppearAnimation();
                animationMode = 'off';
                break;
            case 'shaffle':
                this.shaffleAnimation();
                animationMode = 'normal';
                break;
            case 'off':
                //stopAnimation
                break;
        }
    };

    //回転しながら現れる
    this.rotateAppearAnimation = function(){
        for (i=0;i<cylinderParentNum;i++){
            var param = {y:Math.PI/720};
            TweenLite.fromTo(param,1,
                             {y:Math.PI/720},
                             {y:0,onUpdate:handleUpdate}
                            );
        }
        for (i=0;i<planeNum;i++){
            planes[i].material.depthWrite = true;
            TweenLite.fromTo(planes[i].material,1,
                             {opacity:0},
                             {opacity:1,onComplete:handleComp}
                            );
        }
        function handleUpdate(){
            for (i=0;i<cylinderParentNum;i++){
                cylinderParents[i].rotation.y += Math.pow(-1,i)*param.y;
            }
        }
        function handleComp(){
            animationMode = 'normal';
        }
    };

    //回転しながら消える
    this.rotateDisppearAnimation = function(){
        for (i=0;i<cylinderParentNum;i++){
            var param = {y:0};
            TweenLite.fromTo(param,1,
                             {y:0},
                             {y:Math.PI/720,onUpdate:handleUpdate}
                            );
        }
        for (i=0;i<planeNum;i++){
            //これがないと、背景のsphereの後ろ側（白背景）が写ってしまう
            planes[i].material.depthWrite = true;
            TweenLite.fromTo(planes[i].material,1,
                             {opacity:1},
                             {opacity:0,onComplete:function(){animationMode = 'off';}}
                            );
        }
        function handleUpdate(){
            for (i=0;i<cylinderParentNum;i++){
                cylinderParents[i].rotation.y += Math.pow(-1,i)*param.y;
            }
        }
    };
    
    //鳥の画像をシャッフルする
    this.shaffleAnimation = function(){
        for(i=0;i<planeNum;i++){
            TweenLite.fromTo(planes[i].material,Math.random(),
                             {opacity:0},
                             {opacity:1,delay:Math.random()*2}
                              );
        }
    }
    
};








