$.ajax({
	url: "data.json"
}).done(function(data){

	template_it("#template_key_agg", data, '#key_agg')
	template_it("#template_options", data, '#options')
})

function template_it(script_id, data, div_id){
	let template = $(script_id).html();
	let compile = Handlebars.compile(template);
	let result = compile(data);
	let contentg = $(div_id).html(result);
}
