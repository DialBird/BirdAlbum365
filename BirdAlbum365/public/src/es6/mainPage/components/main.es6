
const $ = require('jquery');
const TweenLite = require('TweenLite');
const THREE = require('THREE');

const SoundJukeBox = require('./SoundJukeBox');



module.exports = (NameSpace)=>{
    const thisDevice = NameSpace.preset.thisDevice;
    const socket = NameSpace.preset.socket;
    const thisRoomID = NameSpace.preset.thisRoomID;
    
    const loader = NameSpace.preload.loader;
    const birdData = loader.getResult('birdDataJSON');
    const spriteImage = loader.getResult('birdSpriteImg');
    const spriteJSON = loader.getResult('birdSpriteJSON');

    const planes = NameSpace.init.planes;
    const RCC = NameSpace.init.RCC;
    const omniSphere = NameSpace.init.omniSphere;
    const AC = NameSpace.init.AC;


    //PCにのみ、季節ごとに鳥たちの声を自動で流すSoundJukeBoxクラスを追加する（bgm）
    let SJB;
    if (thisDevice === 'PC'){
        SJB = new SoundJukeBox();
    }


	//------------------------------------------------------
    //PCで使うDOMのキャッシュ
	//------------------------------------------------------

    let $birdNavWindow,$birdName,$birdType,$birdImageBlock,$birdNavSoundIcon;
    if (thisDevice === 'PC'){
		//鳥の説明画面のDOM
        $birdNavWindow = $('.birdNavWindow');
        $birdName = $('.birdNavWindow__birdName');
        $birdType = $('.birdNavWindow__type');
        $birdImageBlock = $('.birdNavWindow__birdPicture');
        $birdNavSoundIcon = $('.birdNavWindow__soundIcon');
    }


    //------------------------------------------------------
    //DOMイベント
    //------------------------------------------------------

	//スマホ側
    //一番最初にボタンを押して、鳥図鑑のディスプレイを始める
    $('#start').on('touchend', ()=>{
        socket.emit('startDisplay',{
            id: thisRoomID
        });
        if (thisDevice === 'SM'){
            $('#navWrap').addClass('js-disappear');
        }
    });

	//PC側
    if (thisDevice === 'PC'){
        //headerのマウスアクション
        $('.header__menuIconWrapper').on({
            'mouseenter':()=>{
                $('.header__pullDownMenu').addClass('js-show');
            },
            'mouseleave':()=>{
                $('.header__pullDownMenu').removeClass('js-show');
            }
        });

        //bgmのサウンドをオンオフするボタン(スタートボタン押すまでは使えない)
        (()=>{
			let isBgmOn_ = true;
            $('.soundIconWrapper').on('click', ()=>{
                if (isBgmOn_){
                    isBgmOn_ = false;
                    //アイコンの見た目を変える
                    $('.soundIconWrapper').addClass('js-soundOff');
                    $('.soundIconWrapper').siblings('p').text('sound off');
					SJB.stopBGM();
                    SJB.BGM_state = 'stop';
                } else {
                    isBgmOn_ = true;
                    $('.soundIconWrapper').removeClass('js-soundOff');
                    $('.soundIconWrapper').siblings('p').text('sound on');
                    SJB.BGM_state = 'playing';
					SJB.startBGM();
                }
            });
        })();

        //季節を変更するボタン
        $('.seasonBtn').on('click', (e)=>{
            socket.emit('changeSeason',{
                id: thisRoomID,
                season: e.target.value
            });
        });

        //鳥の解説windowを引っ込めるdeleteIcon
        $('.birdNavWindow__deleteIcon').on('click', ()=>{
            $birdNavWindow.addClass('js-slideOutToLeft');
        });

    } else if (thisDevice === 'SM'){
        $('#check').on('click', ()=>{
            socket.emit('startDisplay',{
                id: thisRoomID
            });
        });
    }



    //------------------------------------------------------
    //Socketでイベント待機
    //------------------------------------------------------

    //スマホがログインしてきたらQRコードを消す
    socket.on('SM_login', ()=>{
        $('#firstIntroWindow').addClass('js-disappear');
        $('.main__mainGearIconWrapper').addClass('js-slideInFromOutside');
        $('.main__mainGearIcon').addClass('js-rotate');
    });

    //スマホで開始ボタンを押したらplaneを円柱状に配置。最初のアニメーションを実行。PCで音楽を開始
    socket.on('startDisplay', (data)=>{
		//ヘッダーを表示する
        $('#headerWrapper').css('transform','translateY(0)');
        //スマホのシェイクアクションをオンにするために、displayが始まったことを伝える。
        NameSpace.main.isDisplaying = true;
        const birdNames = data.birdNames;
        printBirdImages(birdNames);
        AC.changeAnimationMode('appear');
        RCC.changeRayCastSwitch(true);
        if (thisDevice === 'PC'){
            SJB.setBirdNames(birdNames);
            if (SJB.BGM_state === 'playing'){
                SJB.startBGM();
            }
        }
    });

    //スマホで鳥をタップしたら、PC上に説明が現れる
    socket.on('selectBird', (data)=>{
        //PCで、鳥の情報から画像を特定し、DOMの鳥解説画面にappendする
        if (thisDevice === 'PC'){
            //birdNameはローマ字で書かれている鳥の名前。様々な情報を引き出すためのkeyとして活用
            const birdName = data.birdName;

            //日本語名と種類を取得
            const JPName = birdData[birdName].JPName;
            const type = birdData[birdName].type;

            //画像を取得
            const imageCanvas = document.createElement('canvas');
            const ctx = imageCanvas.getContext('2d');
            const birdImgPos = spriteJSON[birdName];
            const sourceX = birdImgPos.x;
            const sourceY = birdImgPos.y;
            imageCanvas.width = 450;
            imageCanvas.height = 300;
            ctx.drawImage(spriteImage,sourceX,sourceY,256,256,0,0,450,300);
            const birdImage = imageCanvas;

            //鳥の解説パネルの初期化
            $birdImageBlock.html('');
            $birdNavSoundIcon.off('click');


            //DOM要素を修飾
            $birdName.text(JPName);
            $birdType.text(type);
            $birdImageBlock.append(birdImage);

            //サウンドアイコンをクリックしたら音を流す仕組み
            (()=>{
                //アイコンをピンクにするaddClassはSoundJukeBox.js内に記述している
                let isSingleSoundOn_ = false;
                let tid;
                $birdNavSoundIcon.on({
                    'click':()=>{
                        if (!isSingleSoundOn_){
                            /*まず音源があるかどうかを確認し、あれば音楽を流してスイッチをオンにする
                            そのあと約7秒間の音楽が流れるので、7秒後にスイッチをオフにする
                            BGMのボリュームは、皆クラスの方で管理
                            */
                            const result = SJB.playSpecificBirdSound(birdName);
                            if (result) {
                                isSingleSoundOn_ = true;
                                $birdNavSoundIcon.addClass('js-turnPink');
                                tid = setTimeout(()=>{
                                    isSingleSoundOn_ = false;
                                    $birdNavSoundIcon.removeClass('js-turnPink');
                                },7500);
                            } else {
                                //console.log('no sound');
                            }
                        } else {
                            //こちらは押せばオフにするの一択
                            clearTimeout(tid);
                            isSingleSoundOn_ = false;
                            $birdNavSoundIcon.removeClass('js-turnPink');
                            SJB.stopSpecificBirdSound();
                        }
                    },
                    'mouseenter':()=>{
                        $birdNavSoundIcon.addClass('js-enlarge');
                    },
                    'mouseleave':()=>{
                        $birdNavSoundIcon.removeClass('js-enlarge');
                    }
                });
            })();

			//鳥の画像をスマホでタップしたら、左側から鳥の説明画像がスライドしてきて残る。説明画像右上のデリートボタンを押すまで残る
            $birdNavWindow.removeClass('js-slideInFromLeft js-slideOutToLeft');
            $birdNavWindow.addClass('js-slideInFromLeft');
        }
    });

    //PCで季節のボタンを押したら映る鳥が変わる
    socket.on('changeSeason', (data)=>{
        const season = data.season;
        NameSpace.main.season = season;
        const birdNames = data.birdNames;
        if (thisDevice === 'PC'){
            SJB.stopBGM();
            SJB.setBirdNames(birdNames);
        }
        omniSphere.fadeOut();
        AC.changeAnimationMode('disappear');
        setTimeout(()=>{
            printBirdImages(birdNames);
            omniSphere.changeMode(season);
            omniSphere.fadeIn();
            AC.changeAnimationMode('appear');
            if (thisDevice === 'PC'){
                switch (season){
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

    //スマホでタップした時、もしも画像の上であれば、回転を停止する
    socket.on('tapStart', (data)=>{
        const parentObjectName = data.parentObjectName;
        AC.changeRotateSwitch(parentObjectName,false);
    });

    //スマホのタップスライド
    socket.on('tapMove', (data)=>{
        const parentObjectName = data.parentObjectName;
        const speed = data.speed;
        AC.rotateSpecificParent(parentObjectName,speed);
    });

    //スマホのタップ終了
    socket.on('tapEnd', (data)=>{
        const parentObjectName = data.parentObjectName;
        const speed = data.speed;
        AC.changeRotateSwitch(parentObjectName,true);
        if (speed === 0) return;
        const param = {speed:speed};
        TweenLite.to(param,1,{speed:0,onUpdate:handleUpdate});
        function handleUpdate(){
            AC.rotateSpecificParent(parentObjectName,param.speed);
        }
    });

    //スマホをシェイクした時に鳥をシャッフルする
    socket.on('shake', (data)=>{
        const birdNames = data.birdNames;
        AC.changeAnimationMode('shaffle');
        printBirdImages(birdNames);
    });

    //------------------------------------------------------
    //app.jsから鳥の名前データが送られてきたら、そのデータを元にPlaneに画像を張る。
    //------------------------------------------------------

    function printBirdImages(_birdNames){
        const len = planes.length;
        let i;
        for (i=0;i<len;i++){
            const birdName = _birdNames[i];
            const imageCanvas = document.createElement('canvas');
            const ctx = imageCanvas.getContext('2d');
            const birdImgPos = spriteJSON[birdName];
            const sourceX = birdImgPos.x;
            const sourceY = birdImgPos.y;
            const size = 256;
            imageCanvas.width = imageCanvas.height = size;
            ctx.drawImage(spriteImage,sourceX,sourceY,size,size,0,0,size,size);
            const texture = new THREE.Texture(imageCanvas);
            texture.needsUpdate = true;
            planes[i].birdName = birdName;
            planes[i].material.map = texture;
        }
    }
};
