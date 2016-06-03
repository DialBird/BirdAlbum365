

//------------------------------------------------------
//PCとスマホを一対一で接続する仕組み
//------------------------------------------------------

const Promise = require('es6-promise').Promise;
const $ = require('jquery');

module.exports = (NameSpace)=>{
    return new Promise((resolve)=>{
        const socket = NameSpace.preset.socket;
        const thisDevice = NameSpace.preset.thisDevice;
        const this_roomID = NameSpace.preset.this_roomID;

        //PC最初にPCをログインさせて、次にスマホを同じ部屋にログインさせる
        if (thisDevice === 'PC'){
            console.log(`this ID is ${this_roomID}`);
            socket.emit('PC_login',{
                id: this_roomID
            });
        } else if (thisDevice === 'SM'){
            socket.emit('SM_login',{
                id: this_roomID
            });
        }
        
        resolve(NameSpace);
    });
};