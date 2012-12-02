google.load('visualization', '1', {packages:['table']});



var Response = {
	drawTable: function (survey) {

//setting up datatable
		var rdata = new google.visualization.DataTable();
		rdata.addColumn('string', 'Prompt');
		rdata.addColumn('string', 'Response');
		
//adding data from res into datatable

		for(var i in survey){
		console.log(survey[i].prompt_text);
			rdata.addRows([[
				survey[i].prompt_text, String(survey[i].prompt_response)
			]]);
		}
		
        var rtable = new google.visualization.Table(document.getElementById('res_div'));
		var options = {'showRowNumber': true};
		options['page'] = 'enable';
		options['pageSize'] = 10;
		options['width'] = 500;
		options['pagingButtonsConfiguration'] = 'auto';
		rtable.draw(rdata, options);
      }
	  
}