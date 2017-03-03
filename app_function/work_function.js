
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

module.exports.get_normal_date = get_normal_date;
module.exports.check_array_undefined = check_array_undefined;
module.exports.gen_template_fields = gen_template_fields;