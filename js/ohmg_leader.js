google.load('visualization', '1', {packages:['table']});

var table;
var data;
var arr;


function selectHandler() {
    var selection = table.getSelection();
	var name = '';
    for (var i = 0; i < selection.length; i++) {
		var item = selection[i];
		if (item.row != null && item.column != null) {
			name = data.getFormattedValue(item.row, item.column);
		} else if (item.row != null) {
			name = data.getFormattedValue(item.row, 0);
		} else if (item.column != null) {
			name = data.getFormattedValue(0, item.column);
		}
    }
    if (name != '') {
	    $('#user_name').text(name);
		User.setName(name);
		
		console.log(name);
		document.getElementById('res_div').style.display = 'none';
		
		recalculateTimeSeries = true;
		Leaderboard.getSelectHandler()();
		
		$("#leaderboard").toggle();
		$("#user_vis").toggle();
    }
}

var Leaderboard = {
    setSelectHandler: function(selectHandler) {
	   this.selectHandler = selectHandler;
	},
	getSelectHandler : function() {
	   return this.selectHandler;
	},
	drawTable: function (surv) {
		arr = surv.data;
		var hi = [];
		var total = 0;
		var res = [];

//initialization of the res array
		for(var i = 0; i < arr.length; i++){
			res[i] ={"name": "no",
				"total": 9,
				"last": "no"
			};
		} 
//using hi as a hash array, hash in IDs arr
		for(var i = 0; i < arr.length; i++){
			if (hi[arr[i].user] >= 1)
				hi[arr[i].user] ++;  
			else{
				total++;
				hi[arr[i].user] = 1;
			}
		}
//move hashed results (ID and total count) over to res
		var i = 0;
		for (keys in hi){
			 res[i].total = hi[keys];
			 res[i].name = keys;
			 i++;
		}
//run through arr one more time to fill in the privacy and the last update entries of res
		for (var y = 0; y < total; y++){
			var x = arr.length-1;
			while(res[y].name != arr[x].user){
				x--;
			}
			res[y].last = arr[x].utc_timestamp;
		}
	

//setting up datatable
		data = new google.visualization.DataTable();
		data.addColumn('string', 'ID');
		data.addColumn('number', 'Responses');
		data.addColumn('string', 'Last Response');		
//adding data from res into datatable
		for(var x = 0; x < total; x++){
			data.addRows([[
				res[x].name, res[x].total, res[x].last
			
			]]);
		}
		
        table = new google.visualization.Table(document.getElementById('table_div'));
		var options = {'showRowNumber': true};
		options['width'] = 400;
		options['sortColumn'] = 1;
		options['sortAscending'] = false;
		table.draw(data, options);
		google.visualization.events.addListener(table, 'select', selectHandler);
      }
	  
}
