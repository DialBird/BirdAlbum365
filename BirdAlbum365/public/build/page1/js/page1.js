'use strict';


//------------------------------------------------------
//nameSpace
//------------------------------------------------------

var WebPage = {
    Preload:{
        birdSpriteImg: '',
        birdSpriteJSON: '',
        birdNamesJSON: '',
    },
    Canvas:{
        scene:'',
        camera:'',
        renderer:''
    }
};

//for文用のi
var i;
'use strict';


//ThreeJSで、次々にplaneの輪を作ってアニメーションさせるクラス
function PlaneCircleGenerator(){
    this.scene = WebPage.Canvas.scene;
    this.birdSpriteImg = WebPage.Preload.birdSpriteImg;
    this.birdSpriteJSON = WebPage.Preload.birdSpriteJSON;
    this.birdNamesJSON = WebPage.Preload.birdNamesJSON;
    this.birdNamesNum = this.birdNamesJSON.length;
    this.planeNum = 12;
};
PlaneCircleGenerator.prototype = {
    generate: function(_bool,_startX){
        //まずplaneの円をを作成する
        var planeCircle = this.createPlaneCircle();
        //次に受け取った方向、位置から回転と移動を開始する
        this.startAnimation(planeCircle,_bool,_startX);
    },
    createPlaneCircle: function(){
        var cG = new THREE.CubeGeometry(0,0);
        var cM = new THREE.MeshPhongMaterial({opacity:0,transparent:true});
        var center = new THREE.Mesh(cG,cM);
        this.scene.add(center);
        var i,len = this.planeNum;
        for (i=0;i<len;i++){
            var pG = new THREE.CylinderGeometry(80,80,20,64,1,true,30*i*Math.PI/180,25*Math.PI/180);
            var texture = this.getTexture();
            var pM = new THREE.MeshPhongMaterial({map:texture,side:THREE.DoubleSide,opacity:0,transparent:true});
            var plane = new THREE.Mesh(pG,pM);
            
            //cylinderの軸をx軸に向けるためにz軸で回転している
            plane.rotation.set(0,0,-90*Math.PI/180);
            center.add(plane);
        }
        return center;
    },
    getTexture: function(){
        var ranNum = Math.floor(Math.random()*this.birdNamesNum);
        var birdName = this.birdNamesJSON[ranNum];
        var source = this.birdSpriteJSON[birdName];
        var birdSpriteImg = this.birdSpriteImg;
        var sourceX = source.x;
        var sourceY = source.y;
        var sourceWidth = source.width;
        var sourceHeight = source.height;
        var imageCanvas = document.createElement('canvas');
        var ctx = imageCanvas.getContext('2d');
        var size = 256;
        imageCanvas.width = imageCanvas.height = size;
        ctx.drawImage(birdSpriteImg,sourceX,sourceY,sourceWidth,sourceHeight,0,0,size,size);
        var texture = new THREE.Texture(imageCanvas);
        texture.needsUpdate = true;
        return texture;
    },
    startAnimation: function(_planeCircle,_bool,_startX){
        var scene = this.scene;
        var planeCircle = _planeCircle;
        var endAngle = (_bool)?Math.PI:(-1)*Math.PI;
        var startX = _startX;
        var endX = startX - 300;
        var param = {posX:startX,rotX:0,opacity:0};
        TweenLite.to(param,30,{posX:endX,rotX:endAngle,opacity:10,onUpdate:handleUpdate,onComplete:handleComp});
        function handleUpdate(){
            planeCircle.position.x = param.posX;
            planeCircle.rotation.x = param.rotX;
            planeCircle.traverse(function(node){
                if(node.material){
                    var _opacity = (self.opacity >= 1)?1:param.opacity;
                    node.material.opacity = _opacity;
                }
            });
        };
        function handleComp(){
            planeCircle.traverse(function(node){
                if(node.material){
                    scene.remove(node);
                    node.geometry.dispose();
                    node.material.dispose();
                }
            });
            scene.remove(planeCircle);
            planeCircle.geometry.dispose();
            planeCircle.material.dispose();
//            //toDo: テクスチャをなくすには？
//            for(i in textures){
//                textures[i].dispose();
//            }
        };
    }
};














'use strict';


//------------------------------------------------------
//データをプリロードする
//------------------------------------------------------
preloadData();

function preloadData(){
    
    var manifest = [
        {id:'birdSpriteImg', src:'build/birdImages/birdSprite.min.jpg'},
        {id:'birdSpriteJSON', src:'json/birdSprite.json'},
        {id:'birdNamesJSON', src:'json/birdNames.json'}
    ];
    var loader = new createjs.LoadQueue(false);
    loader.addEventListener('fileload',handleFileload);
    loader.addEventListener('progress',handleProgress);
    loader.loadManifest(manifest);
};

function handleFileload(data){
    var type = data.item.type;
    switch(type){
        case 'image':
            if (data.item.id === 'birdSpriteImg') WebPage.Preload.birdSpriteImg = data.result;
            break;
        case 'json':
            if (data.item.id === 'birdSpriteJSON') WebPage.Preload.birdSpriteJSON = data.result;
            if (data.item.id === 'birdNamesJSON') WebPage.Preload.birdNamesJSON = data.result;
            break;
    }
};

//スマホのみで動くローディングアニメーション
function handleProgress(e){
    var progress = e.progress*100;
    //ロード進捗状況を知らせるイラスト
    $('.header__insideLoadingBar').css('width',progress+'%');
    if (progress === 100){
        $('.header__loadingBlock').addClass('js-hide');
        setTimeout(init,1000);
    }
}








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




















'use strict';



function main(){
    
    //------------------------------------------------------
    //header関連
    //------------------------------------------------------
    
    startAnimation();
    
    //冒頭のタイトルアニメーション開始
//    function startAnimation(){
//        //計2.4秒のアニメーションが入る
//        $('.header__titleLogo path').addClass('js-titleEmerge');
//        setTimeout(function(){
//            $('.header__titleLogo').addClass('js-expandFromCenter');
//            $('.header__text').addClass('js-fadeInFromTop');
//        },2000);
//        //2.4秒のアニメーションが終わったらthreejsアニメーション開始
//        setTimeout(startEmergePlanes,2500);
//    };
    
    
    function startAnimation(){
        $('.header__inner').addClass('js-show');
        setTimeout(startEmergePlanes,500);
    }
    
    //鳥の画像を貼ったPlaneオブジェクトを奥から出現させる
    function startEmergePlanes(){
        //クラスの呼び出し
        var PCG = new PlaneCircleGenerator();
        var toggle = false;
        PCG.generate(false,170);
        PCG.generate(true,140);
        PCG.generate(false,110);
        PCG.generate(true,80);
        PCG.generate(false,50);
        PCG.generate(true,20);
        function loop(){
            if(toggle){
                toggle = false;
            }else{
                toggle = true;
            }
            PCG.generate(toggle,200);
            setTimeout(loop,2000);
        };
        loop();
    };
    
    
    //windowリサイズイベントでキャンバスのサイズを変更する
    $(window).on('resize',function(){
        //windowのminwidthは1280
        var width = ($(window).innerWidth() <= 1280)?1280:$(window).innerWidth();

        //windowがリサイズした時に、canvasのサイズを変更する
        var renderer = WebPage.Canvas.renderer;
        renderer.setSize(width,width*8/13);
    });

    //スクロールでthreeJSのカメラが動くようにする
    function rotateCamera(_scrollTop){
        if(WebPage.Canvas.camera === null){return;}
        var camera = WebPage.Canvas.camera;
        //1200という値は適当。見栄え的に決定
        var deg = (_scrollTop >= 1200)?-90:-(_scrollTop*90/1200);
        var radian = deg*Math.PI/180;
        var posX = Math.cos(radian);
        var posY = Math.sin(radian);
        camera.lookAt(new THREE.Vector3(posX,posY,0));
    };
    
    
    //------------------------------------------------------
    //section1
    //------------------------------------------------------
    
    
    
    //------------------------------------------------------
    //section2
    //------------------------------------------------------
    //SVG読み込む
    (function(){
        $('.section2__heading').load('img/svg/section2Heading.svg svg');
    }());
    
    
    //カルーセルの設定をする
//    (function(){
//        //キャッシュ
//        var carouselWrap = $('.section2__carouselWrap'),
//            mainColumn = $('.section2__mainColumn'),
//            leftArrow = $('.leftArrow'),
//            dots = $('.slick-dots');
//
//        //カルーセルイベント
//        carouselWrap.on({
//            init: function(e,slick,current,next){
//                mainColumn.addClass('js-fadeIn');
//            },
//            setPosition: function(){
//                dots.css('bottom','0');
//            },
//            beforeChange: function(e,slick,current,next){
//                leftArrow.addClass('js-disappear');
//                mainColumn.removeClass('js-fadeIn');
//            },
//            afterChange: function(e,slick,current,next){
//                mainColumn.addClass('js-fadeIn');
//            }
//        });
//        carouselWrap.slick({
//            speed:300,
//            arrows:true,
//            dots:true,
//            infinite:false,
//            prevArrow:'<img src="img/svg/birdFoot.svg" class="leftArrow arrow">',
//            nextArrow:'<img src="img/svg/birdFoot.svg" class="rightArrow arrow">',
//        });
//    }());
    
    
    //------------------------------------------------------
    //footer
    //------------------------------------------------------
    //SVG読み込む
    (function(){
//        $('.footer__heading').load('img/svg/footerHeading.svg svg');
    }());
    
    //リンク貼り
    $('.footer__button').on('click',function(){
        location.href = $(this).attr('data-url');
    });
    
    
    
    //------------------------------------------------------
    //スクロールイベント
    //------------------------------------------------------
    
    console.log(s);

    $(window).on('scroll',function(){
        var value = $(window).scrollTop();
        var height1 = 1000;
//        var section1Top = $('#section1Wrapper').offset().top;
//        var section2Top = $('#section2Wrapper').offset().top;
//
//        //headerのthreejsのカメラを回転させる()
        rotateCamera(value);
//
//        //右上の値変更
        $('.calcTop').text(value);
//
//        //タイトルロゴがスクロールに応じて上がっていく
        $('.header__inner').css('top', 324 - value);

        //セクションごとのアニメーションを支配
//        if(value >= section1Top-500){
//            $('.section1').addClass('js-slideInFromLeft');
//            setTimeout(function(){
//                $('.section1__heading').addClass('js-fadeInFromButtom');
//                $('.section1__image1').addClass('js-fadeInFromButtom');
//                $('.section1__text').addClass('js-fadeInFromButtom');
//            },600);
//        }
//        if(value >= section2Top-500){
//            $('.section2__sideColumn').addClass('js-slideOutToLeft');
//            setTimeout(function(){
//                $('.section2__heading').addClass('js-fadeInFromButtom');
//            },600);
//        }
        
        
    });
};