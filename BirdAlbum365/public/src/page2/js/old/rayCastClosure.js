'use strict';


function rayCastClosure(_camera,_$canvas,_canWidth,_canHeight,_planes){
    
    //グローバルから取ってくるもの
    var socket = BirdAlbumProject.socket;
    var this_roomID = BirdAlbumProject.this_roomID;
    var thisDevice = BirdAlbumProject.thisDevice;

    //initから
    var camera = _camera;
    var $canvas = _$canvas;
    var canWidth = _canWidth;
    var canHeight = _canHeight;
    var planes = _planes
    
    //rayCastをオンオフするスイッチ（鳥の説明が出ている間はオフにするため）
    var rayCastSwitch = false;

    //アルバムを動かすためにタップしたのと、写真を選択するためにタップしたのかを判定するための変数
    var isClicked = false;
    
    var ray = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    var parentObjectName = '';
    var prevPosition = '';
    var speed = 0;
    
    $canvas.on({
        'touchstart': handleMouseDown,
        'mousedown': handleMouseDown,
        'touchmove': handleMouseMove,
        'mousemove': handleMouseMove,
        'touchend': handleMouseUp,
        'mouseup': handleMouseUp
    })
    
    //rayCastSwitchを変更する
    this.changeRayCastSwitch = function(_bool){
        rayCastSwitch = _bool;
    };
    
    function handleMouseDown(e){
        //鳥の説明出すための判定はこれだけでじゅうぶん
        isClicked = true;
        //以下はタップスライドのためのもの
        if(rayCastSwitch === false) return;
        speed = 0;
        mouse.x = (e.originalEvent.pageX/canWidth)*2 - 1;
        mouse.y = -(e.originalEvent.pageY/canHeight)*2 + 1;
        ray.setFromCamera(mouse,camera);
        var intersects = ray.intersectObjects(planes);
        if(intersects.length > 0){
            var target = intersects[0];
//            if(thisDevice === 'SM'){
                parentObjectName = target.object.parent.name;
                prevPosition = {x:mouse.x, y:mouse.y};
                socket.emit('tapStart',{
                    id: this_roomID,
                    parentObjectName: parentObjectName,
                });
//            }
        }
    };
    
    function handleMouseMove(e){
        //鳥の説明出すための判定はこれだけでじゅうぶん
        isClicked = false;
        
        //以下はタップスライドのためのもの
        //何も動かしていない
        if(!prevPosition) return;
        //画像を動かす()
        mouse.x = (e.originalEvent.pageX/canWidth)*2 - 1;
        speed = (prevPosition.x - mouse.x) *0.05;
//        if(thisDevice === 'SM'){
            socket.emit('tapMove',{
                id: this_roomID,
                parentObjectName: parentObjectName,
                speed: speed
            });
//        }
    }
    
    //Raycastを飛ばす
    function handleMouseUp(e){
        
        (function(){
            //止めてそのまま話す
            prevPosition = '';
//            if(thisDevice === 'SM'){
                socket.emit('tapEnd',{
                    id: this_roomID,
                    parentObjectName: parentObjectName,
                    speed: speed
                });
//            }
        }());
        
        //鳥の解説を出すsocket
        if(isClicked){
            isClicked = false;
            if(rayCastSwitch === false){return;}
            mouse.x = (e.originalEvent.pageX/canWidth)*2 - 1;
            mouse.y = -(e.originalEvent.pageY/canHeight)*2 + 1;
            //mouseoverの場合は、マウスがcanvas上にある時のみに指定しないと上手くいかなくなるので注意しておくこと
            ray.setFromCamera(mouse,camera);
            var intersects = ray.intersectObjects(planes);
            if(intersects.length > 0){
                var target = intersects[0];
                if(thisDevice === 'PC'){
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
                }else if(thisDevice === 'SM'){
                    socket.emit('selectBird',{
                        id: this_roomID,
                        birdName: target.object.birdName
                    })
                }
            }
        }
    }
}