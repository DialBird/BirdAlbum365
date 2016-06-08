

//------------------------------------------------------
//rayCastの支配をするクロージャ
//------------------------------------------------------

const THREE = require('THREE');

class RayCastClosure{
    constructor(NameSpace, $canvas, canWidth, canHeight){
        const socket = NameSpace.preset.socket;
        const thisRoomID = NameSpace.preset.thisRoomID;
        const thisDevice = NameSpace.preset.thisDevice;

        const camera = NameSpace.init.camera;
        const planes = NameSpace.init.planes;


		//マウスの位置座標を取得して、レイキャスト判定をするのに必要な変数
        const ray = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        

        //スクリーンをタップした後、スライドすればスワイプアクションして認識し、スライドせずに話した時は時には説明画像を出すようにする
        let isScreenTapped = false;


		//画像をスライドアクションした時に、スライドする方向へ画像を動かせるように、画像が属している親オブジェクトを取得し、その親オブジェクトをスライドした方向にスライドした分だけ動かすために使う変数
        let parentObjectName = '';
        let prevPosition = '';
        let speed = 0;

        //rayCastをオンオフするスイッチ（鳥の説明が出ている間はオフにするため）
        let rayCastSwitch = false;


		//------------------------------------------------------
		//メソッド
		//------------------------------------------------------

        //rayCastSwitchを変更する(main関数で、鳥の画像が映し出されるまで、raycastを無効にする)
		this.changeRayCastSwitch = (_bool)=>{
			rayCastSwitch = _bool;
		};


        //canvasイベント
        $canvas.on({
            'touchstart': handleMouseDown,
            'touchmove': handleMouseMove,
            'touchend': handleMouseUp
        });
        
        function handleMouseDown(e){
            //鳥の説明出すための判定はこれだけでじゅうぶん
            isScreenTapped = true;
            //以下はタップスライドのためのもの
            if (rayCastSwitch === false) return;
            speed = 0;
            mouse.x = (e.originalEvent.pageX/canWidth)*2 - 1;
            mouse.y = -(e.originalEvent.pageY/canHeight)*2 + 1;
            ray.setFromCamera(mouse,camera);
            const intersects = ray.intersectObjects(planes);
            if (intersects.length > 0){
                const target = intersects[0];
                parentObjectName = target.object.parent.name;
                prevPosition = {x:mouse.x, y:mouse.y};
                socket.emit('tapStart',{
                    id: thisRoomID,
                    parentObjectName: parentObjectName
                });
            }
        }
        
        function handleMouseMove(e){
            //鳥の説明出すための判定はこれだけでじゅうぶん
            isScreenTapped = false;

            //以下はタップスライドのためのもの
            //何も動かしていない
            if (!prevPosition) return;
            //画像を動かす()
            mouse.x = (e.originalEvent.pageX/canWidth)*2 - 1;
            speed = (prevPosition.x - mouse.x) *0.01;
            socket.emit('tapMove',{
                id: thisRoomID,
                parentObjectName: parentObjectName,
                speed: speed
            });
        }

        //Raycastを飛ばす
        function handleMouseUp(e){
            (function(){
                //止めてそのまま話す
                prevPosition = '';
                socket.emit('tapEnd',{
                    id: thisRoomID,
                    parentObjectName: parentObjectName,
                    speed: speed
                });
            }());

            //鳥の解説を出すsocket
            if (isScreenTapped){
                isScreenTapped = false;
                if (rayCastSwitch === false){return;}
                mouse.x = (e.originalEvent.pageX/canWidth)*2 - 1;
                mouse.y = -(e.originalEvent.pageY/canHeight)*2 + 1;
                //mouseoverの場合は、マウスがcanvas上にある時のみに指定しないと上手くいかなくなるので注意しておくこと
                ray.setFromCamera(mouse,camera);
                const intersects = ray.intersectObjects(planes);
                if (intersects.length > 0){
                    const target = intersects[0];
                    if (thisDevice === 'PC'){
                        socket.emit('checkData',{
                            id: thisRoomID,
                            name: target.object.name,
                            birdName: target.object.birdName,
                            pos: target.object.position
                        });
                        socket.emit('selectBird',{
                            id: thisRoomID,
                            birdName: target.object.birdName
                        });
                    } else if (thisDevice === 'SM'){
                        socket.emit('selectBird',{
                            id: thisRoomID,
                            birdName: target.object.birdName
                        });
                    }
                }
            }
        }
    }
}

module.exports = RayCastClosure;
