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