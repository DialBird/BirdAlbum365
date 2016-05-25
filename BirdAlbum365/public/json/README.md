



//planePositionsは以下の関数を実行した結果を記述している

var cylinderPos = (function(){
var array = [];
var planeNum = 100;
var cylinderRadius = 120;
var deg = 0;
for(i=0;i<planeNum;i++){
//20で丁度一周するように配置
deg += 18*Math.PI/180;
var posX = Math.sin(deg)*cylinderRadius;
var posZ = Math.cos(deg)*cylinderRadius;
//20毎に高さが60から30づつ減っていくように
var posY = 60 - (Math.floor(i/20)*30);
//円の中央を向くように回転
var rotX = 0;
var rotY = deg+Math.PI;
var rotZ = 0;
array.push({
posX: posX,
posY: posY,
posZ: posZ,
rotX: rotX,
rotY: rotY,
rotZ: rotZ
})
}
return array;
}());