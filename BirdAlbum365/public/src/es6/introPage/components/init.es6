
//------------------------------------------------------
//ThreeJSの初期化
//------------------------------------------------------

const Promise = require('es6-promise').Promise;
const $ = require('jquery');
const THREE = require('THREE');

module.exports = (NameSpace)=>{
    return new Promise((resolve)=>{
        //requestAnimationのprefix
        (()=>{
            const requestAnimationFrame = window.requestAnimationFrame ||
                  window.mozRequestAnimationFrame ||
                  window.webkitRequestAnimationFrame ||
                  window.msRequestAnimationFrame;
            window.requestAnimationFrame = requestAnimationFrame;
        })();

        //threeJSの基礎項目
        //canvasサイズをwindowと同じサイズにする(min-widthは1280)
        const width = ($(window).innerWidth() <= 1280)?1280:$(window).innerWidth();
        const height = width*8/13;
        //レンダラー
        const renderer = new THREE.WebGLRenderer({alpha:true});
        renderer.setSize(width,height);
        renderer.shadowMap.enabled = true;
        $('#canvas').append(renderer.domElement);
        //シーン
        const scene = new THREE.Scene();
        //カメラ
        const camera = new THREE.PerspectiveCamera(60,width/height,1,1000);
        camera.position.set(0,0,0);
        camera.lookAt(new THREE.Vector3(1,0,0));
        //ライト
        const direction = new THREE.DirectionalLight('#a3a3a3');
        direction.position.set(-100,0,0);
        scene.add(direction);
        const amb = new THREE.AmbientLight('#808080');
        scene.add(amb);

        //グローバルのCanvas名前空間に代入
        NameSpace.Canvas.scene = scene;
        NameSpace.Canvas.camera = camera;
        NameSpace.Canvas.renderer = renderer;

        (function animation(){
            requestAnimationFrame(animation);
            renderer.render(scene,camera);
        }());
        
        //initへ
        resolve(NameSpace);
    });
};




