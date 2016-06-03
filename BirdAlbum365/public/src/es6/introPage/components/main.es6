
const $ = require('jquery');
const THREE = require('THREE');

const PlaneCircleGenerator = require('./PlaneCircleGenerator');

module.exports = (NameSpace)=>{
    startAnimation();

    function startAnimation(){
        $('.header__inner').addClass('js-show');
        setTimeout(startEmergePlanes,500);
    }

    //鳥の画像を貼ったPlaneオブジェクトを奥から出現させる
    function startEmergePlanes(){
        //クラスの呼び出し
        const PCG = new PlaneCircleGenerator(NameSpace);
        let toggle = false;
        PCG.generate(false,170);
        PCG.generate(true,140);
        PCG.generate(false,110);
        PCG.generate(true,80);
        PCG.generate(false,50);
        PCG.generate(true,20);
        function loop(){
            if (toggle){
                toggle = false;
            } else {
                toggle = true;
            }
            PCG.generate(toggle,200);
            setTimeout(loop,2000);
        }
        loop();
    }


    //windowリサイズイベントでキャンバスのサイズを変更する
    $(window).on('resize', ()=>{
        //windowのminwidthは1280
        const width = ($(window).innerWidth() <= 1280)?1280:$(window).innerWidth();

        //windowがリサイズした時に、canvasのサイズを変更する
        const renderer = NameSpace.Canvas.renderer;
        renderer.setSize(width,width*8/13);
    });

    //スクロールでthreeJSのカメラが動くようにする
    function rotateCamera(_scrollTop){
        if (NameSpace.Canvas.camera === null){return;}
        const camera = NameSpace.Canvas.camera;
        //1200という値は適当。見栄え的に決定
        const deg = (_scrollTop >= 1200)?-90:-(_scrollTop*90/1200);
        const radian = deg*Math.PI/180;
        const posX = Math.cos(radian);
        const posY = Math.sin(radian);
        camera.lookAt(new THREE.Vector3(posX,posY,0));
    }



    //------------------------------------------------------
    //section2
    //------------------------------------------------------
    //SVG読み込む
    (function(){
        $('.section2__heading').load('img/svg/section2Heading.svg svg');
    }());


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


    $(window).on('scroll', ()=>{
        const value = $(window).scrollTop();
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

