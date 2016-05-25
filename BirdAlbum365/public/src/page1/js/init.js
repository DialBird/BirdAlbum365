'use strict';


/*
ThreeJSの初期化
*/
function init(){
    
    //requestAnimationのprefix
    (function() {
        var requestAnimationFrame = window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.msRequestAnimationFrame;
        window.requestAnimationFrame = requestAnimationFrame;
    })();
    
    //threeJSの基礎項目
    //canvasサイズをwindowと同じサイズにする(min-widthは1280)
    var width = ($(window).innerWidth() <= 1280)?1280:$(window).innerWidth();
    var height = width*8/13;
    //レンダラー
    var renderer = new THREE.WebGLRenderer({alpha:true});
    renderer.setSize(width,height);
    renderer.shadowMap.enabled = true;
    $('#canvas').append(renderer.domElement);
    //シーン
    var scene = new THREE.Scene();
    //カメラ
    var camera = new THREE.PerspectiveCamera(60,width/height,1,1000);
    camera.position.set(0,0,0);
    camera.lookAt(new THREE.Vector3(1,0,0));
    //ライト
    var direction = new THREE.DirectionalLight('#a3a3a3');
    direction.position.set(-100,0,0);
    scene.add(direction);
    var amb = new THREE.AmbientLight('#808080');
    scene.add(amb);
    
    //グローバルのCanvas名前空間に代入
    WebPage.Canvas.scene = scene;
    WebPage.Canvas.camera = camera;
    WebPage.Canvas.renderer = renderer;
    
    //main開始
    main();
    
    (function animation(){
        requestAnimationFrame(animation);
        renderer.render(scene,camera);
    }());
};



















