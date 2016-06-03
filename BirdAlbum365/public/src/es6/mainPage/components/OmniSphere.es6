

const THREE = require('THREE');
const TweenLite = require('TweenLite');

class OmniSphere{
    constructor(NameSpace){
        this.loader = NameSpace.preload.loader;
        this.scene = NameSpace.init.scene;
        this.geometry = '';
    }
    createOmniSphere(){
        const self = this;
        const sphereG = new THREE.SphereGeometry(1000,32,32);
        const sphereM = new THREE.MeshBasicMaterial({transparent:true,opacity:1,side:THREE.DoubleSide});
        const sphere = new THREE.Mesh(sphereG,sphereM);
        self.scene.add(sphere);
        this.geometry = sphere;
    }
    changeMode(season){
        const texture = new THREE.Texture(this.loader.getResult(`${season}Img`));
        texture.needsUpdate = true;
        this.geometry.material.map = texture;
    }
    fadeOut(){
        TweenLite.fromTo(this.geometry.material,1,{opacity:1},{opacity:0});
    }
    fadeIn(){
        TweenLite.fromTo(this.geometry.material,1,{opacity:0},{opacity:1});
    }
}

module.exports = OmniSphere;