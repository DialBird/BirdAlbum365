/*ThreeEnvCreaterはinit.jsに継承
    ThreeAnimationはanimationController.jsに継承
*/





//------------------------------------------------------------------------------------------------------------
//Three.jsの世界を作成するクラス＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞＞
//------------------------------------------------------------------------------------------------------------

var ThreeEnvCreater = function(){
    //thisが使えない時(マウスイベントやfor文、requestAnimationFrameの時)用のself
    var self = this;
    
    //------------------------------------------------------
    //Threeの初期化
    //------------------------------------------------------
    
    //canvasのDOM,大きさを設定
    this.canvas = $('#canvas');
    this.canWidth = (BirdAlbumProject.thisDevice === 'PC')?800:window.innerWidth;
    this.canHeight = (BirdAlbumProject.thisDevice === 'PC')?500:window.innerHeight;
    //レンダラー（canvasの独立性を鑑みた結果、再度canvasをDOMから呼び出した方が見やすくなると判断）
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.canWidth,this.canHeight);
    this.renderer.setClearColor(0xa2dfff,1);
    $('#canvas').append(this.renderer.domElement);
    //カメラ
    this.camera = new THREE.PerspectiveCamera(45,this.canWidth/this.canHeight,1,3000);
    if(BirdAlbumProject.thisDevice === 'PC'){
        this.camera.position.set(100,0,100);
        this.camera.lookAt(new THREE.Vector3(0,0,0));
    }else if(BirdAlbumProject.thisDevice === 'SM'){
        this.camera.position.set(0,0,0);
        this.camera.lookAt(new THREE.Vector3(1,0,0));
    }
    //シーン
    this.scene = new THREE.Scene();
    //コントローラ
    if(BirdAlbumProject.thisDevice === 'PC'){
        this.control = new THREE.OrbitControls(this.camera);
        this.control.enabled = false;        //canvas内に入ったらtrue
        //            this.control.maxDistance = 120;
    }else if(BirdAlbumProject.thisDevice === 'SM'){
        this.control = new THREE.DeviceOrientationControls(this.camera);
    }
    //ライト
    this.directionalLight = new THREE.DirectionalLight(0xffffff,1);
    this.directionalLight.position.set(0,100,0);
    this.scene.add(this.directionalLight);
    this.amb = new THREE.AmbientLight(0xa5a5a5,1);
    this.scene.add(this.amb);
    
    //------------------------------------------------------
    //canvasにクリックイベントをつける
    //------------------------------------------------------
    

    /*
        canvasへのアクション（クリック、ドラッグ）イベントハンドラ設定*/
    (function(){
        var ray = new THREE.Raycaster();
        console.log(ray)
        var mouse = new THREE.Vector2();
        //アルバムを動かすためにタップしたのと、写真を選択するためにタップしたのかを判定するための変数
        var isClicked = false;
        $('#canvas').on('mouseover',handleMouseOver)
            .on('mouseout',handleMouseOut)
            .on('mousedown',handleMouseDown)
            .on('mousemove',handleMouseMove)
            .on('mouseup',handleMouseUp);
        function handleMouseOver(){
            self.control.enabled = true;
        }
        function handleMouseOut(){
            self.control.enabled = false;
        }
        function handleMouseDown(){
            isClicked = true;
        }
        function handleMouseMove(){
            isClicked = false;
        }
        function handleMouseUp(e){
            if(isClicked){
                mouse.x = (e.offsetX/self.canWidth)*2 - 1;
                mouse.y = -(e.offsetY/self.canHeight)*2 + 1;
                //mouseoverの場合は、マウスがcanvas上にある時のみに指定しないと上手くいかなくなるので注意しておくこと
                ray.setFromCamera(mouse,self.camera);
                var intersects = ray.intersectObjects(self.planes);
                console.log(self.rayCastSwitch().state())

                if(self.rayCastSwitch().state() === false){return;}     //もし鳥の説明文がでていたら、タップ（クリック）イベントを中止

                if(intersects.length > 0){
                    var target = intersects[0];
                    if(BirdAlbumProject.thisDevice === 'PC'){
                        BirdAlbumProject.socket.emit('checkData',{
                            id: BirdAlbumProject.this_roomID,
                            name: target.object.name,
                            birdID: target.object.birdID,
                            pos: target.object.position
                        })
                    }else if(BirdAlbumProject.thisDevice === 'SM'){
                        BirdAlbumProject.socket.emit('selectBird',{
                            id: BirdAlbumProject.this_roomID,
                            birdID: target.object.birdID
                        })
                    }
                }
            }
        }
    }());
    
    //------------------------------------------------------
    //オブジェクト配置
    //------------------------------------------------------
    
    /*
        環境を作る関数*/
    (function(){
        /*
            地面を配置する関数*/
        (function(){
            var groundG = new THREE.PlaneGeometry(2000,2000);
            var groundTexture = new THREE.Texture(BirdAlbumProject.loader.getResult('grass'));
            groundTexture.needsUpdate = true;
            var groundM = new THREE.MeshPhongMaterial({map: groundTexture});
            groundM.map.wrapS = THREE.RepeatWrapping;
            groundM.map.wrapT = THREE.RepeatWrapping;
            groundM.map.repeat.set(20,20);
            var ground = new THREE.Mesh(groundG,groundM);
            ground.position.y = -80;
            ground.rotation.x = -90*Math.PI/180;
            self.scene.add(ground);
        }());
        /*
            木を配置する関数*/
        (function(){
            var trees = [];
            var treeNum = 5;
            //load関連は時間がかかるので、同じ変数を使うfor文では処理が終わる前に上書きされて使えなくなるので注意
            var treeLoader = new THREE.ColladaLoader();
            treeLoader.options.convertUpAxis = true;
            //同じオブジェクトなのでtreeNumの数だけloopさせて作成する
            (function loop(){
                if(treeNum === 0){return;};
                treeLoader.load('../public/3DModels/tree1/tree.dae',function(collada){
                    var tree = collada.scene;
                    tree.scale.set(40,40,40);
                    tree.position.x = 600 - treeNum*100;
                    tree.position.y = -70;
                    self.scene.add(tree);
                    trees.push(tree);
                    treeNum--;
                    loop();
                })
            }());
        }());
    }());
    
    /*
    planesのアニメーションは、基本以下に格納しておいた、個々のplaneの初期位置に、別の位置から様々なTweenで帰ってくるという仕様にしてある.
    そこにcylinderparentの動きも加えることで、まとまったアニメーションを実現することが出来るという仕組み
    */
    
    /*
        planeオブジェクト、およびその座標を作成*/
//    (function(){
//        //作成するplaneの数
//        var planeNum = 100;
//        /*
//            画像を貼るPlaneを１００枚作成する（配列が帰ってくる）*/
//        BirdAlbumProject.threeEnvInfo.planes = (function(){
//            //格納するarray
//            var array = [];
//            //plane情報
//            var planeW = 30;
//            var planeH = 20;
//            var emptyTexture = new THREE.Texture(BirdAlbumProject.loader.getResult('empty'));
//            emptyTexture.needsUpdate = true;
//            for(i=0;i<planeNum;i++){
//                //mesh作成
//                var pG = new THREE.PlaneGeometry(planeW,planeH);
//                var pM = new THREE.MeshPhongMaterial({
//                    map: emptyTexture,
//                    side: THREE.DoubleSide,
//                    opacity: 1,             //最初は透明のままにしておく
//                    transparent: true       //planeのopacityを下げると透けるように設定
//                });
//                array[i] = new THREE.Mesh(pG,pM);
//                //planeに紐付ける情報
//                array[i].name = i;
//                self.scene.add(array[i]);
//            }
//            return array;
//        }());
//
//        //planeをcylinder以外の形に配置した時も、この配置に戻ってこれるように、配置座標を決定しておく
//        BirdAlbumProject.threeEnvInfo.cylinderPos = (function(){
//            var array = [];
//            var cylinderRadius = 120;
//            var posX,posY,posZ,rotX,rotY,rotZ,deg = 0;
//            for(var i=0;i<self.planeNum;i++){
//                //20で丁度一周するように配置
//                deg += 18*Math.PI/180;
//                posX = Math.sin(deg)*cylinderRadius;
//                posZ = Math.cos(deg)*cylinderRadius;
//                //20毎に高さが60から30づつ減っていくように
//                posY = 60 - (Math.floor(i/20)*30);
//                //円の中央を向くように回転
//                rotX = 0;
//                rotY = deg+Math.PI;
//                rotZ = 0;
//                array.push({
//                    posX: posX,
//                    posY: posY,
//                    posZ: posZ,
//                    rotX: rotX,
//                    rotY: rotY,
//                    rotZ: rotZ
//                })
//            }
//            return array;
//        }());
//    }());
    
    
    this.planeNum = 100;
    //画像を貼るPlaneを１００枚作成する（配列が帰ってくる）
    this.planes = (function(){
        //格納するarray
        var array = [];
        //plane情報
        var planeW = 30;
        var planeH = 20;
        var planeNum = self.planeNum;
        var emptyTexture = new THREE.Texture(BirdAlbumProject.loader.getResult('empty'));
        emptyTexture.needsUpdate = true;
        for(i=0;i<planeNum;i++){
            //mesh作成
            var pG = new THREE.PlaneGeometry(planeW,planeH);
            var pM = new THREE.MeshPhongMaterial({
                map: emptyTexture,
                side: THREE.DoubleSide,
                opacity: 1,             //最初は透明のままにしておく
                transparent: true       //planeのopacityを下げると透けるように設定
            });
            array[i] = new THREE.Mesh(pG,pM);
            //planeに紐付ける情報
            array[i].name = i;
            self.scene.add(array[i]);
        }
        return array;
    }());
    
    //planeをcylinder以外の形に配置した時も、この配置に戻ってこれるように、配置座標を決定しておく
    this.cylinderPos = (function(){
        var array = [];
        var cylinderRadius = 120;
        var posX,posY,posZ,rotX,rotY,rotZ,deg = 0;
        for(var i=0;i<self.planeNum;i++){
            //20で丁度一周するように配置
            deg += 18*Math.PI/180;
            posX = Math.sin(deg)*cylinderRadius;
            posZ = Math.cos(deg)*cylinderRadius;
            //20毎に高さが60から30づつ減っていくように
            posY = 60 - (Math.floor(i/20)*30);
            //円の中央を向くように回転
            rotX = 0;
            rotY = deg+Math.PI;
            rotZ = 0;
            array.push({
                posX: posX,
                posY: posY,
                posZ: posZ,
                rotX: rotX,
                rotY: rotY,
                rotZ: rotZ
            })
        }
        return array;
    }());
    
    //cylinderParents作成
    //createCylinderParentsとsettingCylinderParentsPosで共有するために置く
    this.cylinderParentNum = 5;
    this.cylinderParents = (function createCylinderParents(){
        var array = [];
        //cylinderの親オブジェクト作成(この関数を発動するたびにつくり直される)
        var cG = new THREE.BoxGeometry(0,0,0);     //見えなくてもいい
        var cM = new THREE.MeshPhongMaterial({color : 0xff0000});
        for(var i=0;i<self.cylinderParentNum;i++){
            array[i] = new THREE.Mesh(cG,cM);
            array[i].position.set(0,0,0);
            self.scene.add(array[i]);
        }
        return array;
    }());
    this.cylinderParentsInitialPosRot = (function settingCylinderParentsPos(){
        var array = [];
        for(var i=0;i<self.cylinderParentNum;i++){
            array.push({
                posX:0,
                posY:0,
                posZ:0,
                rotX:0,
                rotY:0,
                rotZ:0
            })
        }
        return array;
    }());
    
    //------------------------------------------------------
    //TAインスタンス作成
    //------------------------------------------------------
    var TA2 = new ThreeAnimation();
    
    //TA側に情報を格納する
    TA2.planes = this.planes;
    TA2.cylinderParents = this.cylinderParents;
    
    
    //------------------------------------------------------------------------------------------------------------
    //Socket通信を待機
    //------------------------------------------------------------------------------------------------------------

    //------------------------------------------------------
    //スマホで開始ボタンを押したらplaneを円柱状に配置。最初のアニメーションを実行
    //------------------------------------------------------

    BirdAlbumProject.socket.on('startDisplay',function(data){
        //planesを円柱状に配置する
        self.displayIntoCylinder(self.cylinderParents,self.planes,self.cylinderPos);
        TA2.animationMode = 'appear';
    });
    
    BirdAlbumProject.socket.on('selectBird',function(data){
        console.log(self.rayCastSwitch().state());
        self.rayCastSwitch().off();             //説明を表示中はタップ機能をオフにする
        console.log(self.rayCastSwitch().state());
        console.log('now off')
        TA2.animationMode = 'disappear';
        //PCのみで実行する
        if(BirdAlbumProject.thisDevice === 'PC'){
            var _birdName = birdImages[data.birdID].name;
            var _birdImage = birdImages[data.birdID].src;
            $('#birdName').text(_birdName);
            $('#birdImage').attr('src',_birdImage);
            $('.bird_introduction_window').removeClass('slideOutStart');
            $('.bird_introduction_window').addClass('slideInStart');
        }
    });

    BirdAlbumProject.socket.on('backToSelect',function(data){
        self.rayCastSwitch().on();;             //説明が消えるとタップ機能をオンにする
        //現れるアニメーション
        TA2.animationMode = 'appear';
        //PCのみで実行する
        if(BirdAlbumProject.thisDevice === 'PC'){
            $('.bird_introduction_window').addClass('slideOutStart');
        }
    });

    //クリックした画像の情報をPCのコンソールに出す
    BirdAlbumProject.socket.on('checkData',function(data){
        if(BirdAlbumProject.thisDevice === 'PC'){
            console.log(data);
        }
    });
    
    (function animate(){
        requestAnimationFrame(animate);
        //ThreeAnimation内のアニメーション振り分けメソッドを発動し続ける
        TA2.controlAnimations();
        TWEEN.update();
        self.control.update();
        self.renderer.render(self.scene,self.camera);
    }());
}

ThreeEnvCreater.prototype = {
    /*
        rayCast機能をONOFFするswitchRayCastEnabledを切り替えるクロージャ（外部からクリック判定を可能にするか不可能にするかを指定する時に使う）*/
    rayCastSwitch: function(){
        var rayCastEnabled = true;
        return{
            on: function(){
                rayCastEnabled = true;
                console.log('on');
            },
            off: function(){
                rayCastEnabled = false;
                console.log('off');
            },
            state: function(){
                return rayCastEnabled;
            }
        }
    },
    displayIntoCylinder: function(_cylinderParents,_planes,_planesInitialPosRot){
        //まずplanesをcylinderPosに格納した場所に配置する

        for(var i=0, len=_planes.length;i<len;i++){
            var posX = _planesInitialPosRot[i].posX;
            var posY = _planesInitialPosRot[i].posY;
            var posZ = _planesInitialPosRot[i].posZ;
            var rotX = _planesInitialPosRot[i].rotX;
            var rotY = _planesInitialPosRot[i].rotY;
            var rotZ = _planesInitialPosRot[i].rotZ;
            _planes[i].position.set(posX,posY,posZ);
            _planes[i].rotation.set(rotX,rotY,rotZ);
            
            //pDataを参照に画像を貼り付ける
//            console.log(TA.pData[i])
//            _birdID = TA.pData[i].birdID;
//            _planes[i].birdID = _birdID;
//            _birdImage = birdImages[_birdID].src;
//            _planes[i].material.map = THREE.ImageUtils.loadTexture(_birdImage);　//画像を指定（ランダム）
            
            //preloadJSバージョン
            var _birdIDNum = BirdAlbumProject.pData[i].birdID;
            _planes[i].birdID = _birdIDNum;
            var birdImage = BirdAlbumProject.loader.getResult(birdImages[_birdIDNum].id);
            var texture = new THREE.Texture(birdImage);
            texture.needsUpdate = true;
            _planes[i].material.map = texture;
            
            //５つのcylinderParents（親オブジェクト）に２０枚ずつPlaneをaddする
            var num = Math.floor(i/20);
            _cylinderParents[num].add(_planes[i]);
        }
    }
}

//------------------------------------------------------------------------------------------------------------
//Three.jsのアニメーションを実行するクラス
//------------------------------------------------------------------------------------------------------------

var ThreeAnimation = function(){
    //ThreeEnvCreater内でplane情報とcylinderParents情報を格納
    this.planes = '';
    this.cylinderParents = '';
    this.normalRotationSpeed = 0.05;

    //Animation関数をふり分けるためのメンバ変数。
    //基本的にThreeEnvCreaterクラスの中のrenderメソッド内で、このクラス内のcontrolAnimations関数を呼び出し続け、
    //外部から以下の変数を変えることで、この関数の処理を変えるという手法をとる。

    //配置の状態を示す
    this.displayMode = 'cylinder';

    //アニメーションの状態を示す
    this.animationMode = 'off';
}
ThreeAnimation.prototype = {
    controlAnimations: function(){
        switch(this.displayMode){
            case 'cylinder':
                this.controlCylinderAnimation();
                break;
            case 'flat':
                this.controlFlatAnimation();
                break;
        }
    },
    controlCylinderAnimation: function(){
        switch(this.animationMode){
            case 'start':
                break;
            case 'normal':
                //回転をゆっくりと継続する
                for(var i=0;i<this.cylinderParents.length;i++){
                    this.cylinderParents[i].rotation.y += this.normalRotationSpeed*Math.PI/180*Math.pow(-1,i);
                }
                break;
            case 'appear':
                //appearになった後、すぐにoffにすることで、関数をなんども実行するのを防ぐようにする
                this.rotateAppearAnimation(this.cylinderParents,this.planes);
                this.animationMode = 'off';
                break;
            case 'disappear':
                //disappearになった後、すぐにoffにすることで、関数をなんども実行するのを防いでくれる
                this.rotateDisppearAnimation(this.cylinderParents,this.planes);
                this.animationMode = 'off';
                break;
            case 'off':
                //nothing
                break;
        }
    },
    rotateAppearAnimation: function(_cylinderParents,_planes){
        var self = this;
        var _param = {rotationY: 1*Math.PI/180, alpha:0};
        var _tween = new TWEEN.Tween(_param)
        .to({rotationY: 0, alpha:1},1000)
        .onUpdate(function(){
            for(var i=0;i<_cylinderParents.length;i++){
                var _rotateDir = Math.pow(-1,i);
                _cylinderParents[i].rotation.y += _rotateDir*this.rotationY;
            }
            for(var i=0;i<_planes.length;i++){
                _planes[i].material.opacity = this.alpha;
            }
        })
        .onComplete(function(){
            self.animationMode = 'normal';
        }).start();
    },
    rotateDisppearAnimation: function(_cylinderParents,_planes){
        var self = this;
        var _param = {rotationY: 0, alpha:1};
        var _tween = new TWEEN.Tween(_param)
        .to({rotationY: 1*Math.PI/180, alpha:0},1000)
        .onUpdate(function(){
            for(var i=0;i<_cylinderParents.length;i++){
                var _rotateDir = Math.pow(-1,i);
                _cylinderParents[i].rotation.y += _rotateDir*this.rotationY;
            }
            for(var i=0;i<_planes.length;i++){
                _planes[i].material.opacity = this.alpha;
            }
        })
        .onComplete(function(){
            self.animationMode = 'off';
        }).start();
    }
}
















//------------------------------------------------------
//平面状態に並べる
//------------------------------------------------------

//function displayIntoPlane(){
//    //５０枚あるplaneから25枚をランダムに重複しないように選ぶ
//    var _randomPlanes = selectRandomPlanes(planes,25);
//    function selectRandomPlanes(planes,_num){
//        var _selectedNum = [];          //選ばれた番号を詰める
//        var _selectedPlanes = [];       //選ばれた番号を元にplaneをえらんで格納
//        var _selectedCount = _selectedPlanes.length;   //選ばれたplaneの数
//        //_numの数だけ回す
//        for(var i=0;i<_num;i++){
//            //０〜（planeの枚数−１）の数のうちからランダムに剪定
//            var _candidate = Math.floor(Math.random()*planes.length);
//            for(var j=0;j<_selectedCount;j++){
//                if(_candidate === _selectedNum[j]){
//                    _candidate = Math.floor(Math.random()*_num);
//                    j--;
//                }
//            }
//            _selectedNum.push(_candidate);
//            _selectedPlanes.push(planes[_candidate]);
//            _selectedCount = _selectedPlanes.length;
//        }
//        return _selectedPlanes;
//    }
//    //25つの場所をランダムに選んだplaneたちに割りあてる
//    for(var i=0;i<25;i++){
//        var _target = lineUpIntoPlanePositions[i];
//        var _tween = new TWEEN.Tween(_randomPlanes[i].position)
//        .to(_target,1000)
//        .easing(TWEEN.Easing.Elastic.In)
//        .start();
//    }
//}



//------------------------------------------------------------------------------------------------------------
//セッティングに使用する関数
//------------------------------------------------------------------------------------------------------------

//------------------------------------------------------
//最初にlineUpIntoPlanePositionsに対し、位置を決定しておく
//------------------------------------------------------
//一面に並べる時に使う位置座標をまとめておく
//var lineUpIntoPlanePositions = createLineUpIntoPlanePositions();

//var planesBetweenW = 30,            //一面に並べた時の横の間隔
//    planesBetweenH = 30;            //一面に並べた時の縦の間隔
//function createLineUpIntoPlanePositions(){
//    var _array = [];
//    var _posX,_posY;
//    for(var i=0;i<5;i++){
//        _posY = 2*(planesBetweenH + planeH) - i*(planesBetweenH + planeH);
//        for(var j=0;j<5;j++){
//            _posX = 2*(planesBetweenW + planeW) - j*(planesBetweenW + planeW);
//            _array.push({x: _posX, y: _posY, z: 0});
//        }
//    }
//    return _array;
//}