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










//------------------------------------------------------
//画像をプリロードする
//------------------------------------------------------

'use strict';


//この段階から、スマホスクロールに制限をかけておきたい
$(window).on('touchmove.noScroll', function(e) {
    e.preventDefault();
});


preloadData();

function preloadData(){
    var thisDevice = BirdAlbumProject.thisDevice;
    var PCLoader,PCManifest,loader,manifest;
    
    //PCだけ、プリロードするもの
    (function(){
        if (thisDevice === 'PC'){
            var PCManifest = [
                {id:'audioSprite', src:'/json/birdSoundsSprite.json'},
                {id:'birdData', src:'/json/birdData.json'},
            ];
            var PCLoader = new createjs.LoadQueue(false);
            PCLoader.installPlugin(createjs.Sound);
            PCLoader.loadManifest(PCManifest);
            PCLoader.addEventListener('fileload',function(data){
                if (data.item.id === 'audioSprite'){
                    createjs.Sound.alternateExtensions = ['mp3'];
                    //manifestは配列に入っている必要があるので、jsonファイルを前もって配列で囲んでおく
                    var audioSpriteManifest = data.result;
                    createjs.Sound.registerSounds(audioSpriteManifest);
                }
                if (data.item.id === 'birdData') BirdAlbumProject.birdData = data.result;
            });
        }
    }());
    
    //PC,スマホが共にロードすべきもの
    manifest = [
        {id:'empty', src:'/img/dialbird.jpg'},
        {id:'planePositions', src:'/json/planePositions.json'},
        {id:'spriteImg', src:'/build/birdImages/birdSprite.min.jpg'},
        {id:'imageSprite', src:'/json/birdSprite.json'},
//        {id:'springSpriteImg', src:'/img/springEnv/springSprite.jpg'},
//        {id:'springSpriteJSON', src:'/json/springSprite.json'},
//        {id:'summerSpriteImg', src:'/img/summerEnv/summerSprite.jpg'},
//        {id:'summerSpriteJSON', src:'/json/summerSprite.json'},
//        {id:'fallSpriteImg', src:'/img/fallEnv/fallSprite.jpg'},
//        {id:'fallSpriteJSON', src:'/json/fallSprite.json'},
//        {id:'winterSpriteImg', src:'/img/winterEnv/winterSprite.jpg'},
//        {id:'winterSpriteJSON', src:'/json/winterSprite.json'},
        {id:'springImg', src:'/img/springEnv/springEnv.min.jpg'},
        {id:'summerImg', src:'/img/summerEnv/summerEnv.min.jpg'},
        {id:'fallImg', src:'/img/fallEnv/fallEnv.min.jpg'},
        {id:'winterImg', src:'/img/winterEnv/winterEnv.min.jpg'},
    ];
    var loader = new createjs.LoadQueue(false);
    loader.addEventListener('fileload',handleFileload);
    if (thisDevice === 'SM'){
        loader.addEventListener('progress',handleProgress_for_SM);
    }else if(thisDevice === 'PC'){
        loader.addEventListener('progress',handleProgress_for_PC);
    }
    loader.addEventListener('complete',init);
    loader.loadManifest(manifest,true);
    BirdAlbumProject.loader = loader;
};

function handleFileload(data){
    var type = data.item.type;
    switch(type){
        case 'image':
            if (data.item.id === 'empty') BirdAlbumProject.emptyImg = data.result;
            if (data.item.id === 'spriteImg') BirdAlbumProject.spriteImage = data.result;
//            if (data.item.id === 'springSpriteImg') BirdAlbumProject.envSpriteImg['spring'] = data.result;
//            if (data.item.id === 'summerSpriteImg') BirdAlbumProject.envSpriteImg['summer'] = data.result;
//            if (data.item.id === 'fallSpriteImg') BirdAlbumProject.envSpriteImg['fall'] = data.result;
//            if (data.item.id === 'winterSpriteImg') BirdAlbumProject.envSpriteImg['winter'] = data.result;
            
            break;
        case 'json':
            if (data.item.id === 'planePositions') BirdAlbumProject.planePositions = data.result;
//            if (data.item.id === 'springSpriteJSON') BirdAlbumProject.envSpriteJSON['spring'] = data.result;
//            if (data.item.id === 'summerSpriteJSON') BirdAlbumProject.envSpriteJSON['summer'] = data.result;
//            if (data.item.id === 'fallSpriteJSON') BirdAlbumProject.envSpriteJSON['fall'] = data.result;
//            if (data.item.id === 'winterSpriteJSON') BirdAlbumProject.envSpriteJSON['winter'] = data.result;
            if (data.item.id === 'imageSprite') BirdAlbumProject.spriteJSON = data.result;
            break;
    }
};

//スマホで動くローディングアニメーション
function handleProgress_for_SM(e){
    var $canvas = $('#canvas');
    var $loadWindow = $('.loadWindow');
    var $loadBar = $('.loadWindow__insideLoadBar');
    var $startWindow = $('.startWindow');
    var progress = e.progress*100;
    
    //ロードバーをアニメーション
    $loadBar.css('width',progress+'%');
    
    //ロードし終わったら
    if(progress === 100){
        $loadWindow.addClass('js-hide');
        $canvas.addClass('js-show');
        $startWindow.addClass('js-show');
    }
}



//PCで動くローディングアニメーション
function handleProgress_for_PC(e){
    var progress = e.progress*100;
    
    //ロードバーをアニメーション
    $('.loadingWindow__insideLoadBar').css('width',progress+'%');
    
    //ロードし終わったら
    if(progress === 100){
        $('.loadingWindow').addClass('js-disappear');
        $('.QRCodeWindow').addClass('js-show');
//        $canvas.addClass('js-show');
//        $startWindow.addClass('js-show');
    }
}








'use strict';


//------------------------------------------------------------------------------------------------------------
//threejsのinit関数
//------------------------------------------------------------------------------------------------------------

function init(){
    //グローバルから参照する変数
    var socket = BirdAlbumProject.socket;
    var this_roomID = BirdAlbumProject.this_roomID;
    var thisDevice = BirdAlbumProject.thisDevice;
    var textureLoader = BirdAlbumProject.textureLoader;
    var cylinderPos = BirdAlbumProject.planePositions;
    
    //ThreeJSの初期化に必要な要素
    var planeNum = 100;
    var planeWidth = 30;
    var planeHeight = 20;
    var $canvas = $('#canvas');
    var cylinderParentNum = 5;
    
    //ループ用変数
    var i;
    
    //statsを設定
    var stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = "fixed";
    stats.domElement.style.right    = "5px";
    stats.domElement.style.top      = "5px";
    stats.domElement.style.zIndex      = 100;
    document.body.appendChild(stats.domElement);
    
    //------------------------------------------------------
    //threeJSの基盤となる要素
    //------------------------------------------------------
    //canvasのDOM,大きさを設定
    var canWidth = window.innerWidth;
    var canHeight = window.innerHeight;
    //レンダラー（canvasの独立性を鑑みた結果、再度canvasをDOMから呼び出した方が見やすくなると判断）
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(canWidth,canHeight);
    renderer.setClearColor('#ffffff',1);
    $canvas.append(renderer.domElement);
    //カメラ
    var camera = new THREE.PerspectiveCamera(45,canWidth/canHeight,1,4000);
    if(thisDevice === 'PC'){
        camera.position.set(300,300,300);
        camera.lookAt(new THREE.Vector3(0,0,0));
    }else if(thisDevice === 'SM'){
        camera.position.set(0,0,0);
        camera.lookAt(new THREE.Vector3(1,0,0));
    }
    //シーン
    var scene = new THREE.Scene();
    //コントローラ
    if(thisDevice === 'PC'){
        var control = new THREE.OrbitControls(camera);
        control.enableZoom = false;
//        control.enabled = false;
    }else if(thisDevice === 'SM'){
        var control = new THREE.DeviceOrientationControls(camera);
    }
    //ライト
    var directionalLight = new THREE.DirectionalLight(0xffffff,1);
    directionalLight.position.set(0,100,0);
    scene.add(directionalLight);
    var amb = new THREE.AmbientLight(0xa5a5a5,1);
    scene.add(amb);
    
    
    //------------------------------------------------------
    //リサイズ時にcanvasを変形させる
    //------------------------------------------------------
    $(window).on('resize',function(){
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    });
    
    //------------------------------------------------------
    //Planeオブジェクト作成、配置
    //------------------------------------------------------
    /*流れ：planeオブジェクトを枚数分作り、その後同じ数位置情報だけ格納した配列を作る。
    次に親オブジェクトを作り、特定の数だけplaneオブジェクトを子にしていく
    */

    //画像を貼るPlaneを１００枚作成する
    var planes = (function(){
        //格納するarray
        var array = [];
        var emptyImg = BirdAlbumProject.emptyImg;
        var texture = new THREE.Texture(emptyImg);
        texture.needsUpdate = true;
        for(i=0;i<planeNum;i++){
            //mesh作成
            var pG = new THREE.PlaneGeometry(planeWidth,planeHeight);
            var pM = new THREE.MeshPhongMaterial({
                map: texture,
                side: THREE.DoubleSide,
                opacity: 0,             //最初は透明のままにしておく
                transparent: true,       //planeのopacityを下げると透けるように設定
                depthWrite:false
            });
            array[i] = new THREE.Mesh(pG,pM);
            //planeに紐付ける情報
            array[i].name = i;
            scene.add(array[i]);
        }
        return array;
    }());
    
    //Planeの親オブジェクト作成(nameは特定の段のみを回転させる時に、オブジェクトを特定するために使う)
    var cylinderParents = (function(){
        var array = [];
        var cG = new THREE.BoxGeometry(0,0,0);     //見えなくてもいい
        var cM = new THREE.MeshPhongMaterial({color : 0xff0000});
        for(i=0;i<cylinderParentNum;i++){
            var parentObject = new THREE.Mesh(cG,cM);
            parentObject.position.set(0,0,0);
            parentObject.name = i;
            scene.add(parentObject);
            array.push(parentObject);
        }
        return array;
    }());
    
    //Planeを円柱上に配置し、高さごとに親オブジェクトにadd
    (function(){
        //planeを配置する
        for(i=0;i<planeNum;i++){
            var posX = cylinderPos[i].posX;
            var posY = cylinderPos[i].posY;
            var posZ = cylinderPos[i].posZ;
            var rotX = cylinderPos[i].rotX;
            var rotY = cylinderPos[i].rotY;
            var rotZ = cylinderPos[i].rotZ;
            planes[i].position.set(posX,posY,posZ);
            planes[i].rotation.set(rotX,rotY,rotZ);
        }
        //親オブジェクトにadd
        for(i=0;i<planeNum;i++){
            var num = Math.floor(i/20);
            cylinderParents[num].add(planes[i]);
        }
    }());
    
//    var helper = new THREE.AxisHelper(1000);
//    scene.add(helper);
    
    
    
    //------------------------------------------------------
    //スマホをシェイクした時に信号を発信する
    //------------------------------------------------------
    if(thisDevice === 'SM'){
        var season = BirdAlbumProject.season;
        $(document).ready(function() {
            $(this).gShake(function() {
                socket.emit('shake',{
                    id: this_roomID,
                    season:season
                })
            });
        });

    }
    
    
    
    //------------------------------------------------------
    //canvasのクリックイベント（RayCast）を支配するクロージャ
    //------------------------------------------------------
    var RCC = new rayCastClosure(camera,$canvas,canWidth,canHeight,planes);
    
    
    //------------------------------------------------------
    //EnvMapを管理するクラス（最初は春）
    //------------------------------------------------------
//    var skyBox = new SkyBox(scene);
//    skyBox.create();
//    skyBox.changeMode('spring');
    
    var omniSphere = new OmniSphere(scene);
    omniSphere.createOmniSphere();
    omniSphere.changeMode('spring');
    
    
    //------------------------------------------------------
    //アニメーションを支配するクロージャ
    //------------------------------------------------------
    var AC = new animationClosure(planes,cylinderParents);
    
    
    //------------------------------------------------------
    //メイン関数開始
    //------------------------------------------------------
    main(planes,omniSphere,AC,RCC);
    
    
    //------------------------------------------------------
    //アニメーション開始
    //------------------------------------------------------
    (function animate(){
        requestAnimationFrame(animate);
        AC.observe();
        control.update();
        stats.update();
        renderer.render(scene,camera);
    }());
};








'use strict';



function main(_planes,_omniSphere,_AC,_RCC){
    
    var thisDevice = BirdAlbumProject.thisDevice;
    var socket = BirdAlbumProject.socket;
    var this_roomID = BirdAlbumProject.this_roomID;
    
    var planes = _planes;
    var AC = _AC;
    var omniSphere = _omniSphere;
    var RCC = _RCC;

    //PCで使うDOMのキャッシュ
    if(thisDevice === 'PC'){
        var $birdNavWindow = $('.birdNavWindow');
        var $birdName = $('.birdNavWindow__birdName');
        var $birdType = $('.birdNavWindow__type');
        var $birdImageBlock = $('.birdNavWindow__birdPicture');
        var $birdNavSoundIcon = $('.birdNavWindow__soundIcon');
    }
    

    //季節ごとに鳥たちの声を自動で流すクラス（bgm）
    if(thisDevice === 'PC'){
        var SJB = new SoundJukeBox();
    };
    
    
    
    //------------------------------------------------------
    //DOMイベント
    //------------------------------------------------------
    
    //アニメーション開始ボタン
    $('#start').on('click',function(){
        socket.emit('startDisplay',{
            id: this_roomID
        });
        if(thisDevice === 'SM'){
            $('#navWrap').addClass('js-disappear');
        }
    });
    
    
    if(BirdAlbumProject.thisDevice === 'PC'){
        
        //headerのマウスアクション
        $('.header__menuIconWrapper').on({
            'mouseenter':function(){
                $('.header__pullDownMenu').addClass('js-show');
            },
            'mouseleave':function(){
                $('.header__pullDownMenu').removeClass('js-show');
            }
        });
        
        //bgmのサウンドをオンオフするボタン(スタートボタン押すまでは使えない)
        (function(){
            var isPlaying = true;
            $('.soundIconWrapper').on('click',function(){
                if(isPlaying){
                    isPlaying = false;
                    //アイコンの見た目を変える
                    $(this).addClass('js-soundOff');
                    $(this).siblings('p').text('sound off');
                    SJB.BGM_state = 'stop';
                    if(SJB.isAvailable){
                        SJB.stopBGM();
                    }
                }else{
                    isPlaying = true;
                    $(this).removeClass('js-soundOff');
                    $(this).siblings('p').text('sound on');
                    SJB.BGM_state = 'playing';
                    if(SJB.isAvailable){
                        SJB.startBGM();
                    }
                }
            });
        }());
        
        //季節を変更するボタン
        $('.seasonBtn').on('click',function(e){
            BirdAlbumProject.season = e.target.value;
            socket.emit('changeSeason',{
                id: this_roomID,
                season: e.target.value
            })
        });
        
        //鳥の解説windowを引っ込めるdeleteIcon
        $('.birdNavWindow__deleteIcon').on('click',function(){
            $birdNavWindow.addClass('js-slideOutToLeft');
        });
        
    }else if(BirdAlbumProject.thisDevice === 'SM'){
        $('#check').on('click',function(){
            BirdAlbumProject.socket.emit('startDisplay',{
                id: this_roomID
            })
        });
    }
    
    
    //------------------------------------------------------
    //SVG画像を読み込み（アニメーション）
    //------------------------------------------------------

    if(thisDevice === 'PC'){
        $('.birdNavWindow__soundIcon').load('img/svg/soundOnIcon.svg svg');
        $('.birdNavWindow__deleteIcon').load('img/svg/deleteIcon.svg svg');
    }
    
    
    //------------------------------------------------------
    //Socketでイベント待機
    //------------------------------------------------------
    
    //スマホがログインしてきたらQRコードを消す
    socket.on('SM_login',function(){
        $('#firstIntroWindow').addClass('js-disappear');
        $('#headerWrapper').css('transform','translateY(0)');
        $('.main__mainGearIconWrapper').addClass('js-slideInFromOutside');
        $('.main__mainGearIcon').addClass('js-rotate');
    })

    //スマホで開始ボタンを押したらplaneを円柱状に配置。最初のアニメーションを実行
    socket.on('startDisplay',function(data){
        var birdNames = data.birdNames;
        printBirdImages(birdNames);
        AC.changeAnimationMode('appear');
        RCC.changeRayCastSwitch(true);
        if(thisDevice === 'PC'){
            SJB.isAvailable = true;
            SJB.setBirdNames(birdNames);
            if(SJB.BGM_state === 'playing'){
                SJB.startBGM();
            }
        }
    });

    //スマホで鳥をタップしたら、PC上に説明が現れる
    socket.on('selectBird',function(data){
        //PCで、鳥の情報から画像を特定し、DOMの鳥解説画面にappendする
        if(thisDevice === 'PC'){
            //birdNameはローマ字で書かれている鳥の名前。様々な情報を引き出すためのkeyとして活用
            var birdName = data.birdName;
            
            //日本語名と種類を取得
            var JPName = BirdAlbumProject.birdData[birdName].JPName;
            var type = BirdAlbumProject.birdData[birdName].type;
            
            //画像を取得
            var imageCanvas = document.createElement('canvas');
            var ctx = imageCanvas.getContext('2d');
            var birdImgPos = BirdAlbumProject.spriteJSON[birdName];
            var sourceX = birdImgPos.x;
            var sourceY = birdImgPos.y;
            imageCanvas.width = 450;
            imageCanvas.height = 300;
            ctx.drawImage(BirdAlbumProject.spriteImage,sourceX,sourceY,256,256,0,0,450,300);
            var birdImage = imageCanvas;
            
            //鳥の解説パネルの初期化
            $birdImageBlock.html('');
            $birdNavSoundIcon.off('click');
            
            
            //DOM要素を修飾
            $birdName.text(JPName);
            $birdType.text(type);
            $birdImageBlock.append(birdImage);
            
            //サウンドアイコンをクリックしたら音を流す仕組み
            (function(){
                //クリックイベントを新しく作る
                //アイコンをピンクにするaddClassはSoundJukeBox.js内に記述している
                var isPlaying = false;
                var tid;
                $birdNavSoundIcon.on({
                    'click':function(){
                        if (!isPlaying){
                            /*まず音源があるかどうかを確認し、あれば音楽を流してスイッチをオンにする
                            そのあと約7秒間の音楽が流れるので、7秒後にスイッチをオフにする
                            BGMのボリュームは、皆クラスの方で管理
                            */
                            var result = SJB.playSpecificBirdSound(birdName);
                            if (result) {
                                isPlaying = true;
                                $birdNavSoundIcon.addClass('js-turnPink');
                                tid = setTimeout(function(){
                                    isPlaying = false;
                                    $birdNavSoundIcon.removeClass('js-turnPink');
                                },7500);
                            } else{
                                console.log('no');
                            }
                        }else{
                            //こちらは押せばオフにするの一択
                            clearTimeout(tid);
                            isPlaying = false;
                            $birdNavSoundIcon.removeClass('js-turnPink');
                            SJB.stopSpecificBirdSound();
                        }
                    },
                    'mouseenter':function(){
                        $birdNavSoundIcon.addClass('js-enlarge');
                    },
                    'mouseleave':function(){
                        $birdNavSoundIcon.removeClass('js-enlarge');
                    }
                });
            }());

            $birdNavWindow.removeClass('js-slideInFromLeft js-slideOutToLeft');
            $birdNavWindow.addClass('js-slideInFromLeft');
        }
    });


    //クリックした画像の情報をPCのコンソールに出す
//    socket.on('checkData',function(data){
//        if(thisDevice === 'PC'){
////            console.log(data);
//        }
//    });

    //PCで季節のボタンを押したら映る鳥が変わる
    socket.on('changeSeason',function(data){
        var season = data.season;
        var birdNames = data.birdNames;
        if(thisDevice === 'PC'){
            SJB.stopBGM();
            SJB.setBirdNames(birdNames);
        }
        omniSphere.fadeOut();
        AC.changeAnimationMode('disappear');
        setTimeout(function(){
            printBirdImages(birdNames);
            omniSphere.changeMode(season);
            omniSphere.fadeIn();
            AC.changeAnimationMode('appear');
            if(thisDevice === 'PC'){
                switch(season){
                    case 'spring':
                        $('.main__seasonTeller').text('春');
                        break;
                    case 'summer':
                        $('.main__seasonTeller').text('夏');
                        break;
                    case 'fall':
                        $('.main__seasonTeller').text('秋');
                        break;
                    case 'winter':
                        $('.main__seasonTeller').text('冬');
                        break;
                }
                
                //こちらは季節が変わっても、音楽マークがオフならばならない
                SJB.startBGM();
            }
        },1000);
    });
    
    //スマホのタップ開始
    socket.on('tapStart',function(data){
        var parentObjectName = data.parentObjectName;
        AC.changeRotateSwitch(parentObjectName,false);
    });
    
    //スマホのタップスライド
    socket.on('tapMove',function(data){
        var parentObjectName = data.parentObjectName;
        var speed = data.speed;
        AC.rotateSpecificParent(parentObjectName,speed);
    });
    
    //スマホのタップ終了
    socket.on('tapEnd',function(data){
        var parentObjectName = data.parentObjectName;
        var speed = data.speed;
        AC.changeRotateSwitch(parentObjectName,true);
        if(speed === 0) return;
        var param = {speed:speed};
        TweenLite.to(param,1,{speed:0,onUpdate:handleUpdate});
        function handleUpdate(){
            AC.rotateSpecificParent(parentObjectName,param.speed);
        }
    });
    
    //スマホをシェイクした時に鳥をシャッフルする
    socket.on('shake',function(data){
        var birdNames = data.birdNames;
        AC.changeAnimationMode('shaffle');
        printBirdImages(birdNames);
    });
    
    //------------------------------------------------------
    //app.jsから鳥の名前データが送られてきたら、そのデータを元にPlaneに画像を張る。
    //------------------------------------------------------

    function printBirdImages(_birdNames){
        var len = planes.length;
        for(var i=0;i<len;i++){
            var birdName = _birdNames[i];
            var imageCanvas = document.createElement('canvas');
            var ctx = imageCanvas.getContext('2d');
            var birdImgPos = BirdAlbumProject.spriteJSON[birdName];
            var sourceX = birdImgPos.x;
            var sourceY = birdImgPos.y;
            var size = 256;
            imageCanvas.width = imageCanvas.height = size;
            ctx.drawImage(BirdAlbumProject.spriteImage,sourceX,sourceY,size,size,0,0,size,size);
            var texture = new THREE.Texture(imageCanvas);
            texture.needsUpdate = true;
            planes[i].birdName = birdName;
            planes[i].material.map = texture;
        }
    }
};


