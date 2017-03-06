let config = require('../config/config');
let async = require('async');
let F = new require('../app_function/work_function.js');
let WebSocketServer = new require('ws');
let webSocketServer = new WebSocketServer.Server({port:config.websocket_port});

function send_status(status, desc){
        return JSON.stringify({"status":status, desc:desc})
}

webSocketServer.on('connection', function(ws) {

	ws.send(send_status("connect", "connect to server"));
	ws.on('message', function(message){
		
		let array_to_request = JSON.parse(message);

		//формирование объекта с датой
		let date_json = F.date_json(array_to_request.date_from, array_to_request.date_to, config.correction_time);
		//формирование объекта с агрегацией
		let agg_json = F.agg_json(array_to_request.key_agg, config.aggs_size);
		//формирование первого, ключевого запроса
		let base_query = {	
			"query" : {"bool" : {"must" : []} },
			"aggs"  : agg_json
		};
		let first_query = F.first_query(date_json, agg_json, config.index, base_query);
		let list = [];
		list.push(first_query);
		//формирование остальных запросов по отдельным полям
		for(let i of array_to_request.fields){
			list.push(F.second_queries(date_json, agg_json, config.index, base_query, i));
		}		
		//go query;
		async.series(list, function(err, res){
			if (err) console.log(err)
			else{
				console.log(res)
				let answer = F.merge(res);
				console.log(answer)
				let new_table = F.new_table(answer);
				console.log(new_table);
				ws.send(send_status("new_table", new_table));
			}
		})	
	})

});

