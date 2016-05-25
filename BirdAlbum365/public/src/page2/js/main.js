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


