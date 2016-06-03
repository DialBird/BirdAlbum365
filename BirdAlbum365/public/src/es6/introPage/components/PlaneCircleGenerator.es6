
const THREE = require('THREE');
const TweenLite = require('TweenLite');



//ThreeJSで、次々にplaneの輪を作ってアニメーションさせるクラス

class PlaneCircleGenerator{
    constructor(NameSpace){
        this.scene = NameSpace.Canvas.scene;
        this.birdSpriteImg = NameSpace.Preload.birdSpriteImg;
        this.birdSpriteJSON = NameSpace.Preload.birdSpriteJSON;
        this.birdNamesJSON = NameSpace.Preload.birdNamesJSON;
        this.birdNamesNum = this.birdNamesJSON.length;
        this.planeNum = 12;
    }
    generate(_bool,_startX){
        //まずplaneの円をを作成する
        const planeCircle = this.createPlaneCircle();
        //次に受け取った方向、位置から回転と移動を開始する
        this.startAnimation(planeCircle,_bool,_startX);
    }
    createPlaneCircle(){
        const cG = new THREE.CubeGeometry(0,0);
        const cM = new THREE.MeshPhongMaterial({opacity:0,transparent:true});
        const center = new THREE.Mesh(cG,cM);
        this.scene.add(center);
        let i;
        const len = this.planeNum;
        for (i=0;i<len;i++){
            const pG = new THREE.CylinderGeometry(80,80,20,64,1,true,30*i*Math.PI/180,25*Math.PI/180);
            const texture = this.getTexture();
            const pM = new THREE.MeshPhongMaterial({map:texture,side:THREE.DoubleSide,opacity:0,transparent:true});
            const plane = new THREE.Mesh(pG,pM);

            //cylinderの軸をx軸に向けるためにz軸で回転している
            plane.rotation.set(0,0,-90*Math.PI/180);
            center.add(plane);
        }
        return center;
    }
    getTexture(){
        const ranNum = Math.floor(Math.random()*this.birdNamesNum);
        const birdName = this.birdNamesJSON[ranNum];
        const source = this.birdSpriteJSON[birdName];
        const birdSpriteImg = this.birdSpriteImg;
        const sourceX = source.x;
        const sourceY = source.y;
        const sourceWidth = source.width;
        const sourceHeight = source.height;
        const imageCanvas = document.createElement('canvas');
        const ctx = imageCanvas.getContext('2d');
        const size = 256;
        imageCanvas.width = imageCanvas.height = size;
        ctx.drawImage(birdSpriteImg,sourceX,sourceY,sourceWidth,sourceHeight,0,0,size,size);
        const texture = new THREE.Texture(imageCanvas);
        texture.needsUpdate = true;
        return texture;
    }
    startAnimation(_planeCircle,_bool,_startX){
        const scene = this.scene;
        const planeCircle = _planeCircle;
        const endAngle = (_bool)?Math.PI:(-1)*Math.PI;
        const startX = _startX;
        const endX = startX - 300;
        const param = {posX:startX,rotX:0,opacity:0};
        TweenLite.to(param,30,{posX:endX,rotX:endAngle,opacity:10,onUpdate:handleUpdate,onComplete:handleComp});
        function handleUpdate(){
            planeCircle.position.x = param.posX;
            planeCircle.rotation.x = param.rotX;
            planeCircle.traverse((node)=>{
                if (node.material){
                    const _opacity = (self.opacity >= 1)?1:param.opacity;
                    node.material.opacity = _opacity;
                }
            });
        }
        function handleComp(){
            planeCircle.traverse((node)=>{
                if (node.material){
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
        }
    }
}

module.exports = PlaneCircleGenerator;





