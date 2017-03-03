let config = require('../config/config');

let F = new require('../app_function/work_function.js');
let WebSocketServer = new require('ws');
let webSocketServer = new WebSocketServer.Server({port:config.websocket_port});

function send_status(status, desc){
        return JSON.stringify({"status":status, desc:desc})
}

webSocketServer.on('connection', function(ws) {

	ws.send(send_status("connect", "connect to server"));

});
