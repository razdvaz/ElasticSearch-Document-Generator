let request = require('request');
let clone = require('clone');

function get_normal_date(date){
  return date.split('.').reverse().join('-');  
}

function check_array_undefined(array){
    for (let i of array){
        if (!i) return true
    }
    return false
}

function gen_template_fields (config_fields) {
	let obj = {};
	let array = [];
	obj.key_agg = config_fields.key_agg;
	for(let i in config_fields.fields_for_query){
		let obj = {};
		obj.html_desc = config_fields.fields_for_query[i].html_desc;
		obj.field = config_fields.fields_for_query[i].field;
		array.push(obj);
	}
	obj.fields_for_query = array
	return obj;
}

function date_json(date_from, date_to, correction_time){
	//console.log(date_from)
	//console.log(date_to)
	//console.log(correction_time)
	let d_from = new Date(get_normal_date(date_from));
    let d_from_ms = d_from.getTime() - correction_time;

    let d_to = new Date(get_normal_date(date_to));
    let d_to_ms = d_to.getTime() - correction_time;
	
	return {"range": {
               "@timestamp": {
                    "from": d_from_ms,
                    "to": d_to_ms
                    	    }
                      }
            }    
}

function agg_json(key_agg, size){
	return  {
				"group" : {
					"terms" : { "field" : key_agg, "size" : size}
				}
			}		  			
}

function first_query(date_json, agg_json, url, base_query){
	return function(callback){
		console.log('agg_json');
		console.log(agg_json);
		let base_q = clone(base_query);
		base_q.query.bool.must.push(date_json);
		base_q.aggs = agg_json;
		console.log(JSON.stringify(base_q));
        simple_agg(url, base_q, next, 'key');

        function next(res){
        	let answer = {"key_agg" : [agg_json.group.terms.field], "field": [agg_json.group.terms.field], "res" : res}
        	callback(null, answer);
        }
	}
}

function second_queries(date_json, agg_json, url, base_query, field){

	return function(callback){
		console.log(field)
		let base_q = clone(base_query);
		base_q.query.bool.must.push({"match" : { [field.field] : field.value } });
		base_q.query.bool.must.push(date_json);
		base_q.aggs = agg_json;
		console.log('======!!!!!!==========');
		console.log(JSON.stringify(base_q));
        simple_agg(url, base_q, next);

        function next(res){
        	//console.log(res);
        	let answer = {"field" : [field.field]+'-'+[field.value], "res" : res}
          callback(null, answer);
        }
	}
}

function params_for_request(url, query){
	return {
	        url:url, 
	        method: "POST",
	        json: true,
	        headers: { "content-type": "application/json",},
	        json : query
	      }
}

function simple_agg(url, query, callback, key){ 
  request( params_for_request(url, query),

  function(err, response, body){
    if (err) console.log(err);
    else {

      var result_aggs = body.aggregations.group.buckets;

      if (result_aggs.length > 0){
          if (key){
            callback(result_aggs.map(function(el){return el.key}))
          }
          else {
            callback(result_aggs); 
          }
        }
      else {
        var result_aggs = [{key:0, doc_count:0}];
        if (key){
           callback([0]);
        }
        else {
           callback(result_aggs); 
        }

      }
    }
  })
}

function merge(input){
	let obj_table = [];
	console.log('---------------------------')
	

	function a(key, array){
		for (let i of array){
			if (key == i.key){
				console.log(array.field);
				console.log(key);
				console.log(i.doc_count);	
				console.log('------------');	
			} 

		}
	}

}


    

        






module.exports.get_normal_date = get_normal_date;
module.exports.check_array_undefined = check_array_undefined;
module.exports.gen_template_fields = gen_template_fields;
module.exports.date_json = date_json;
module.exports.agg_json = agg_json;
module.exports.first_query = first_query;
module.exports.second_queries = second_queries;
module.exports.merge = merge;
