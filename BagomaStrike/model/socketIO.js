
const app = require('../app');
const server = require('http').Server(app);
const io = require('socket.io')(server);

module.exports = ()=>{
    server.listen(app.get('port'), ()=>{
        console.log('listening!!');
    });
    
    io.on('connection', (socket)=>{

    });
	
};
