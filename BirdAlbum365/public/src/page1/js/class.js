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













