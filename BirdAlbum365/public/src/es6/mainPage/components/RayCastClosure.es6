

//------------------------------------------------------
//rayCastの支配をするクロージャ
//------------------------------------------------------

const THREE = require('THREE');

class RayCastClosure{
    constructor(NameSpace, $canvas, canWidth, canHeight){
        const socket = NameSpace.preset.socket;
        const this_roomID = NameSpace.preset.this_roomID;
        const thisDevice = NameSpace.preset.thisDevice;

        //initから
        const camera = NameSpace.init.camera;
        const planes = NameSpace.init.planes;
        
        //rayCastをオンオフするスイッチ（鳥の説明が出ている間はオフにするため）
        let rayCastSwitch = false;

        //アルバムを動かすためにタップしたのと、写真を選択するためにタップしたのかを判定するための変数
        let isClicked = false;

        const ray = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let parentObjectName = '';
        let prevPosition = '';
        let speed = 0;

        //rayCastSwitchを変更する
        this.changeRayCastSwitch = (_bool)=>{
            rayCastSwitch = _bool;
        };
        
        //canvasイベント
        $canvas.on({
            'touchstart': handleMouseDown,
            //        'mousedown': handleMouseDown,
            'touchmove': handleMouseMove,
            //        'mousemove': handleMouseMove,
            'touchend': handleMouseUp
            //        'mouseup': handleMouseUp
        });
        
        function handleMouseDown(e){
            //鳥の説明出すための判定はこれだけでじゅうぶん
            isClicked = true;
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
                    id: this_roomID,
                    parentObjectName: parentObjectName
                });
            }
        }
        
        function handleMouseMove(e){
            //鳥の説明出すための判定はこれだけでじゅうぶん
            isClicked = false;

            //以下はタップスライドのためのもの
            //何も動かしていない
            if (!prevPosition) return;
            //画像を動かす()
            mouse.x = (e.originalEvent.pageX/canWidth)*2 - 1;
            speed = (prevPosition.x - mouse.x) *0.01;
            socket.emit('tapMove',{
                id: this_roomID,
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
                    id: this_roomID,
                    parentObjectName: parentObjectName,
                    speed: speed
                });
            }());

            //鳥の解説を出すsocket
            if (isClicked){
                isClicked = false;
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
                            id: this_roomID,
                            name: target.object.name,
                            birdName: target.object.birdName,
                            pos: target.object.position
                        });
                        socket.emit('selectBird',{
                            id: this_roomID,
                            birdName: target.object.birdName
                        });
                    } else if (thisDevice === 'SM'){
                        socket.emit('selectBird',{
                            id: this_roomID,
                            birdName: target.object.birdName
                        });
                    }
                }
            }
        }
    }
}

module.exports = RayCastClosure;