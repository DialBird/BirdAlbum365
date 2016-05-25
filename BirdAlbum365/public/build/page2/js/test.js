'use strict';



$(window).on('resize',function(){
    console.log($('#canvas').height());
})
console.log('afds');

$(window).on('load',init);

//------------------------------------------------------------------------------------------------------------
//ローカル変数の設定
//------------------------------------------------------------------------------------------------------------

var $canvas = $('#canvas');
var i;
var camera,renderer;

//------------------------------------------------------------------------------------------------------------
//threeJS初期化
//------------------------------------------------------------------------------------------------------------

function init(){
    //canvasのDOM,大きさを設定
    var canWidth = window.innerWidth;
    var canHeight = window.innerHeight;
    //レンダラー（canvasの独立性を鑑みた結果、再度canvasをDOMから呼び出した方が見やすくなると判断）
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(canWidth,canHeight);
    renderer.setClearColor(0xa2dfff,1);
    $canvas.append(renderer.domElement);
    //カメラ
    camera = new THREE.PerspectiveCamera(45,canWidth/canHeight,1,3000);
    camera.position.set(100,0,100);
    camera.lookAt(new THREE.Vector3(0,0,0));
    //シーン
    var scene = new THREE.Scene();
    //コントローラ
    var control = new THREE.OrbitControls(camera);
    console.dir(control);
    control.enableZoom = false;        //canvas内に入ったらtrue
    //ライト
    var directionalLight = new THREE.DirectionalLight(0xffffff,1);
    directionalLight.position.set(0,100,0);
    scene.add(directionalLight);
    var amb = new THREE.AmbientLight(0xa5a5a5,1);
    scene.add(amb);


    //------------------------------------------------------
    //風景オブジェクト作成、配置
    //------------------------------------------------------

    /*
        地面を配置する関数*/
    (function(){
        var groundG = new THREE.PlaneGeometry(2000,2000);
        var groundM = new THREE.MeshPhongMaterial({color: '#ff8686'});
        var ground = new THREE.Mesh(groundG,groundM);
        ground.position.y = -80;
        ground.rotation.x = -90*Math.PI/180;
        scene.add(ground);
    }());
//
//    //------------------------------------------------------
//    //Planeオブジェクト作成
//    //------------------------------------------------------
//
//    /*
//    planesのアニメーションは、基本以下に格納しておいた、個々のplaneの初期位置に、別の位置から様々なTweenで帰ってくるという仕様にしてある.
//    そこにcylinderparentの動きも加えることで、まとまったアニメーションを実現することが出来るという仕組み
//    */
//    /*
//        画像を貼るPlaneを１００枚作成する（配列が帰ってくる）*/
//    var planes = (function(){
//        //格納するarray
//        var array = [];
//        emptyTexture.needsUpdate = true;
//        for(i=0;i<planeNum;i++){
//            //mesh作成
//            var pG = new THREE.PlaneGeometry(planeWidth,planeHeight);
//            var pM = new THREE.MeshPhongMaterial({
//                map: emptyTexture,
//                side: THREE.DoubleSide,
//                opacity: 0,             //最初は透明のままにしておく
//                transparent: true       //planeのopacityを下げると透けるように設定
//            });
//            array[i] = new THREE.Mesh(pG,pM);
//            //planeに紐付ける情報
//            array[i].name = i;
//            scene.add(array[i]);
//        }
//        return array;
//    }());

    //------------------------------------------------------
    //アニメーション開始
    //------------------------------------------------------

    (function animate(){
        requestAnimationFrame(animate);
        //ThreeAnimation内のアニメーション振り分けメソッドを発動し続ける
        control.update();
        renderer.render(scene,camera);
    }());
};

$(window).on('resize',function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
})







