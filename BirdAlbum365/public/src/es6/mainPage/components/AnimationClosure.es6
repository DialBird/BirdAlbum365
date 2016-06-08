

//------------------------------------------------------
//アニメーションを変える核となる変数を監視し、処理を変えるシステム。（クロージャ）
//------------------------------------------------------

const $ = require('jquery');
const TweenLite = require('TweenLite');

class AnimationClosure{
    constructor(NameSpace, cylinderParents){
        const thisDevice = NameSpace.preset.thisDevice;
        
        const cylinderPos = NameSpace.preload.planePositions;

        const planes = NameSpace.init.planes;
        const planeNum = planes.length;
        
        const cylinderParentNum = cylinderParents.length;

        //ループ用の変数
        let i;



		//------------------------------------------------------
        //DOMキャッシュ
		//------------------------------------------------------
		//PCのみ
        if (thisDevice === 'PC'){
            const $birdNavWindow = $('.birdNavWindow');
            const $birdName = $('.birdNavWindow__birdName');
            const $birdImageBlock = $('.birdNavWindow__birdPicture');
        }



		//------------------------------------------------------
        //アニメーションを変更する核となる変数。これが変わることによってアニメーションモードが変わる
		//------------------------------------------------------
		//五段のそれぞれの段において、回転しているかどうかを格納しておく（スワイプしている時は、その段だけ回転を止めるため）
        const rotateSwitchs = [true,true,true,true,true];

        //本来はdisplayModeを円柱状以外のバージョンも作った際に切り替えられるように作成。しかし今回はcylinderのみ。
        const displayMode = 'cylinder';
        const rotationSpeed = 0.05;
        let animationMode = 'off';
        


		//------------------------------------------------------
		//メソッド
		//------------------------------------------------------

        //アニメーションモードを変更する
        this.changeAnimationMode = (val)=>{
            animationMode = val;
        };

        //rotateSwitchを変更する
        this.changeRotateSwitch = (num, bool)=>{
            rotateSwitchs[num] = bool;
        };

        //特定の親オブジェクトを特定の方向に回転させる(スワイプ時に使用)
        this.rotateSpecificParent = (num, speed)=>{
            cylinderParents[num].rotation.y += speed;
        };

        //アニメーションを最初に振り分けるオブサーバー
        this.observe = ()=>{
            switch (displayMode){
                case 'cylinder':
                    this.controlCylinderAnimation();
                    break;
            }
        };

        //円柱状態に配置した際のアニメーションの振り分けを行う
        //appearなどのモードでは、関数を一回だけ発動させたいので、モードを変えた後にすぐにモードをoffにして、連続して発動するのを防ぐ
        this.controlCylinderAnimation = ()=>{
            switch (animationMode){
                case 'start':
                    break;
                case 'normal':
                    for (i=0;i<cylinderParentNum;i++){
                        if (rotateSwitchs[i] === false) continue;
                        cylinderParents[i].rotation.y += rotationSpeed*Math.PI/180*Math.pow(-1,i);
                    }
                    break;
                case 'appear':
                    this.rotateAppearAnimation();
                    animationMode = 'off';
                    break;
                case 'disappear':
                    this.rotateDisppearAnimation();
                    animationMode = 'off';
                    break;
                case 'shaffle':
                    this.shaffleAnimation();
                    animationMode = 'normal';
                    break;
                case 'off':
                    //stopAnimation
                    break;
            }
        };

        //回転しながら現れる
        this.rotateAppearAnimation = ()=>{
            const param = {y:Math.PI/360};
            for (i=0;i<cylinderParentNum;i++){
                TweenLite.fromTo(param,1,
                                 {y:Math.PI/360},
                                 {y:0,onUpdate:handleUpdate}
                                );
            }
            for (i=0;i<planeNum;i++){
                planes[i].material.depthWrite = true;
                TweenLite.fromTo(planes[i].material,1,
                                 {opacity:0},
                                 {opacity:1,onComplete:handleComp}
                                );
            }
            function handleUpdate(){
                for (i=0;i<cylinderParentNum;i++){
                    cylinderParents[i].rotation.y += Math.pow(-1,i)*param.y;
                }
            }
            function handleComp(){
                animationMode = 'normal';
            }
        };

        //回転しながら消える
        this.rotateDisppearAnimation = ()=>{
            const param = {y:0};
            for (i=0;i<cylinderParentNum;i++){
                TweenLite.fromTo(param,1,
                                 {y:0},
                                 {y:Math.PI/360, onUpdate:handleUpdate}
                                );
            }
            for (i=0;i<planeNum;i++){
                //これがないと、背景のsphereの後ろ側（白背景）が写ってしまう
                planes[i].material.depthWrite = true;
                TweenLite.fromTo(planes[i].material,1,
                                 {opacity:1},
                                 {opacity:0, onComplete:handleComp}
                                );
            }
            function handleUpdate(){
                for (i=0;i<cylinderParentNum;i++){
                    cylinderParents[i].rotation.y += Math.pow(-1,i)*param.y;
                }
            }
            function handleComp(){
                animationMode = 'off';
            }
        };

        //鳥の画像をシャッフルする
        this.shaffleAnimation = ()=>{
            for (i=0;i<planeNum;i++){
                TweenLite.fromTo(planes[i].material,Math.random(),
                                 {opacity:0},
                                 {opacity:1,delay:Math.random()*2}
                                );
            }
        };
    }
}

module.exports = AnimationClosure;
