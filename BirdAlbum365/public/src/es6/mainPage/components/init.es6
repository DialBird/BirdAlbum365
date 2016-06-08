
//------------------------------------------------------------------------------------------------------------
//threejsのinit関数
//------------------------------------------------------------------------------------------------------------

const Promise = require('es6-promise').Promise;
const $ = require('jquery');
const THREE = require('THREE');
const Stats = require('Stats');

const RayCastClosure = require('./RayCastClosure');
const OmniSphere = require('./OmniSphere');
const AnimationClosure = require('./AnimationClosure');

module.exports = (NameSpace)=>{
    return new Promise((resolve)=>{
        const socket = NameSpace.preset.socket;
        const thisRoomID = NameSpace.preset.thisRoomID;
        const thisDevice = NameSpace.preset.thisDevice;
        
        const loader = NameSpace.preload.loader;
        const cylinderPos = loader.getResult('planePositionsJSON');
        const emptyImg = loader.getResult('emptyImg');

        //ThreeJSの初期化に必要な要素
        const planeNum = 100;
        const planeWidth = 30;
        const planeHeight = 20;
        const $canvas = $('#canvas');
        const cylinderParentNum = 5;

        //ループ用変数
        let i;

        //statsを設定
        const stats = new Stats();
        stats.setMode(0);
        stats.domElement.style.position = "fixed";
        stats.domElement.style.right = "5px";
        stats.domElement.style.top = "5px";
        stats.domElement.style.zIndex = 100;
        if (NameSpace.preset.statsOn){
            document.body.appendChild(stats.domElement);
        }

        //------------------------------------------------------
        //threeJSの基盤となる要素
        //------------------------------------------------------
        //canvasのDOM,大きさを設定
        const canWidth = window.innerWidth;
        const canHeight = window.innerHeight;
        //レンダラー（canvasの独立性を鑑みた結果、再度canvasをDOMから呼び出した方が見やすくなると判断）
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(canWidth,canHeight);
        renderer.setClearColor('#ffffff',1);
        $canvas.append(renderer.domElement);
        //カメラ
        const camera = new THREE.PerspectiveCamera(45,canWidth/canHeight,1,4000);
        if (thisDevice === 'PC'){
            camera.position.set(300,300,300);
            camera.lookAt(new THREE.Vector3(0,0,0));
            NameSpace.init.camera = camera;
        } else if (thisDevice === 'SM'){
            camera.position.set(0,0,0);
            camera.lookAt(new THREE.Vector3(1,0,0));
            NameSpace.init.camera = camera;
        }
        //シーン
        const scene = new THREE.Scene();
        NameSpace.init.scene = scene;
        //コントローラ
        let control = "";
        if (thisDevice === 'PC'){
            control = new THREE.OrbitControls(camera);
            control.enableZoom = false;
            //        control.enabled = false;
        } else if (thisDevice === 'SM'){
            control = new THREE.DeviceOrientationControls(camera);
        }
        //ライト
        const directionalLight = new THREE.DirectionalLight(0xffffff,1);
        directionalLight.position.set(0,100,0);
        scene.add(directionalLight);
        const amb = new THREE.AmbientLight(0xa5a5a5,1);
        scene.add(amb);


        //------------------------------------------------------
        //リサイズ時にcanvasを変形させる
        //------------------------------------------------------
        $(window).on('resize', ()=>{
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
        const planes = (()=>{
            //格納するarray
            const array = [];
            const texture = new THREE.Texture(emptyImg);
            texture.needsUpdate = true;
            for (i=0;i<planeNum;i++){
                //mesh作成
                const pG = new THREE.PlaneGeometry(planeWidth,planeHeight);
                const pM = new THREE.MeshPhongMaterial({
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
        })();
        
        NameSpace.init.planes = planes;

        //Planeの親オブジェクト作成(nameは特定の段のみを回転させる時に、オブジェクトを特定するために使う)
        const cylinderParents = (()=>{
            const array = [];
            const cG = new THREE.BoxGeometry(1,1,1);     //見えなくてもいい
            const cM = new THREE.MeshPhongMaterial({color : 0xff0000, transparent:true, opacity:0, depthWrite:false});
            for (i=0;i<cylinderParentNum;i++){
                const parentObject = new THREE.Mesh(cG,cM);
                parentObject.position.set(0,0,0);
                parentObject.name = i;
                scene.add(parentObject);
                array.push(parentObject);
            }
            return array;
        })();

        //Planeを円柱上に配置し、高さごとに親オブジェクトにadd
        (()=>{
            //planeを配置する
            for (i=0;i<planeNum;i++){
                const posX = cylinderPos[i].posX;
                const posY = cylinderPos[i].posY;
                const posZ = cylinderPos[i].posZ;
                const rotX = cylinderPos[i].rotX;
                const rotY = cylinderPos[i].rotY;
                const rotZ = cylinderPos[i].rotZ;
                planes[i].position.set(posX,posY,posZ);
                planes[i].rotation.set(rotX,rotY,rotZ);
            }
            //親オブジェクトにadd
            for (i=0;i<planeNum;i++){
                const num = Math.floor(i/20);
                cylinderParents[num].add(planes[i]);
            }
        })();
        
        const omniSphere = new OmniSphere(NameSpace);
        omniSphere.createOmniSphere();
        omniSphere.changeMode('spring');
        NameSpace.init.omniSphere = omniSphere;
        
        //------------------------------------------------------
        //canvasのクリックイベント（RayCast）を支配するクロージャ
        //------------------------------------------------------
        const RCC = new RayCastClosure(NameSpace,$canvas,canWidth,canHeight);
        NameSpace.init.RCC = RCC;

        
        //------------------------------------------------------
        //アニメーションを支配するクロージャ
        //------------------------------------------------------
        const AC = new AnimationClosure(NameSpace, cylinderParents);
        NameSpace.init.AC = AC;
        
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
        
        //------------------------------------------------------
        //メイン関数開始
        //------------------------------------------------------
        resolve(NameSpace);
    });
};





