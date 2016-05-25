'use strict';



function SkyBox(_scene){
    this.scene = _scene;
    this.envPlanes = [];
    this.envPlaneSize = 3000;
    this.envSpriteImg = BirdAlbumProject.envSpriteImg;
    this.envSpriteJSON = BirdAlbumProject.envSpriteJSON;
    
};
SkyBox.prototype = {
    create: function(){
        var envPlaneSize = this.envPlaneSize;
        var scene = this.scene;
        var envPlanes = this.envPlanes;
        var i,len = 6;
        for(var i=0;i<len;i++){
            var eG = new THREE.PlaneGeometry( envPlaneSize, envPlaneSize);
            var eM = new THREE.MeshBasicMaterial({transparent:true,opacity:1});
            var envPlane = new THREE.Mesh(eG,eM);
            if(i === 0) {envPlane.position.set(0,0,envPlaneSize/2);envPlane.rotation.set(0,-180*Math.PI/180,0);}
            if(i === 1) {envPlane.position.set(envPlaneSize/2,0,0);envPlane.rotation.set(0,-90*Math.PI/180,0);}
            if(i === 2) {envPlane.position.set(0,0,-envPlaneSize/2);envPlane.rotation.set(0,0*Math.PI/180,0);}
            if(i === 3) {envPlane.position.set(-envPlaneSize/2,0,0);envPlane.rotation.set(0,90*Math.PI/180,0);}
            if(i === 4) {envPlane.position.set(0,-envPlaneSize/2,0);envPlane.rotation.set(-90*Math.PI/180,0,Math.PI);}
            if(i === 5) {envPlane.position.set(0,envPlaneSize/2,0);envPlane.rotation.set(90*Math.PI/180,0,Math.PI);}
            scene.add(envPlane);
            envPlanes.push(envPlane);
        }
        
    },
    changeMode: function(_season){
        var season = _season;
        var envPlanes = this.envPlanes;
        var spriteImg = this.envSpriteImg[season];
        var spriteJSON = this.envSpriteJSON[season];
        var sprites = [];
        var i,len = envPlanes.length;
        for(i=0;i<len;i++){
            var data = spriteJSON['000'+(i+1)];
            var sourceX = data.x;
            var sourceY = data.y;
            var sourceWidth = data.width;
            var sourceHeight = data.height;
            var imageCanvas = document.createElement('canvas');
            var ctx = imageCanvas.getContext('2d');
            var size = 1024;
            imageCanvas.width = imageCanvas.height = size;
            ctx.drawImage(spriteImg,sourceX,sourceY,sourceWidth,sourceHeight,0,0,size,size);
            var texture = new THREE.Texture(imageCanvas);
            texture.needsUpdate = true;
            envPlanes[i].material.map = texture;
        }
    },
    fadeOut: function(){
        var envPlanes = this.envPlanes;
        var i,len = envPlanes.length;
        var tween = new TWEEN.Tween({opacity:1})
            .to({opacity:0},1000)
            .onUpdate(function(){
                for(i=0;i<len;i++){
                    envPlanes[i].material.opacity = this.opacity;
                }
            })
            .start();
    },
    fadeIn: function(){
        var envPlanes = this.envPlanes;
        var i,len = envPlanes.length;
        var tween = new TWEEN.Tween({opacity:0})
            .to({opacity:1},1000)
            .onUpdate(function(){
                for(i=0;i<len;i++){
                    envPlanes[i].material.opacity = this.opacity;
                }
            })
            .start();
    }
    
}












