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







