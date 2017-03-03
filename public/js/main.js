$.ajax({
	url: "data.json"
}).done(function(data){
	let template = $("#template").html();
	let compile = Handlebars.compile(template);
	let result = compile(data);
	let content = $('#options').html(result);
})
