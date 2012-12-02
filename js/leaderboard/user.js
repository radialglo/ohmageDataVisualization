google.load('visualization', '1', {packages:['table']});


var User = {
	drawTable: function (arr, name) {
		var hi = [];
		var total = 0;
		var res = [];

//initialization of the res array
		for(var i = 0; i < arr.length; i++){
			res[i] ={"date": "none",
				"survey": "no",
				"loc": "no",
				"client": "no"
			};
		} 

		for(var i = 0; i < arr.length; i++){
			if (arr[i].user == name){
				res[total].date = arr[i].date
				res[total].survey = arr[i].survey_title
				res[total].loc = arr[i].timezone
				res[total].client = arr[i].client
				total++;
			}
		}

//setting up datatable
		udata = new google.visualization.DataTable();
		udata.addColumn('string', 'Time');
		udata.addColumn('string', 'Survey');
		udata.addColumn('string', 'Timezone');		
		udata.addColumn('string', 'Client');	
//adding data from res into datatable

		for(var x = 0; x < total; x++){
			udata.addRows([[
				res[x].date, res[x].survey, res[x].loc, res[x].client
			]]);
		}
		
        utable = new google.visualization.Table(document.getElementById('leader_div'));
		var options = {'showRowNumber': true};
		options['page'] = 'enable';
		options['pageSize'] = 10;
		options['pagingButtonsConfiguration'] = 'auto';
		utable.draw(udata, options);
      }
	  
}