$.ajax({
	url: "data.json"
}).done(function(data){
	template_it('#key_agg', 'key_agg' ,data)
	template_it('.options', 'fields_for_query' ,data)
})

function template_it(element, list, data){
	for (let i of data[list]){
		$(element).append('<option>'+i.field+'</option>')
	}
}


