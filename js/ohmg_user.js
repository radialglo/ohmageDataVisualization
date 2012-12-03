google.load('visualization', '1', {packages:['table']});

var utable;
var udata;
var tarr;
var tname;

function uselectHandler() {
    var selection = utable.getSelection();
	var time_stamp = '';
    for (var i = 0; i < selection.length; i++) {
		var item = selection[i];
		if (item.row != null && item.column != null) {
			time_stamp = udata.getFormattedValue(item.row, item.column);
		} else if (item.row != null) {
			time_stamp = udata.getFormattedValue(item.row, 0);
		} else if (item.column != null) {
			time_stamp = udata.getFormattedValue(0, item.column);
		}
    }
    if (time_stamp != '') {
		for (var i = 0; i < tarr.length; i++){
			if (tarr[i].user == tname && tarr[i].utc_timestamp == time_stamp){
				document.getElementById('res_div').style.display = 'block';
				Response.drawTable(tarr[i].responses);
			}
		}
//		toggle_visibility('user_div');
//		toggle_visibility('table_div');
    }
}



var User = {
	user_name : "urn:ohmage:special:all",

	setNameAll: function() {
		this.user_name =  this.allString();
	},
	allString: function() {
		return "urn:ohmage:special:all";
	},

	setName : function(user_name) {
	   this.user_name = user_name;
	},
	getName : function() {
	  return this.user_name;
	},
	drawTable: function (arr, name) {

		//set name to all so Campaign Manager Can go back


		tarr = arr;
		tname = name;
		
		var hi = [];
		var total = 0;
		var res = [];

//initialization of the res array
		for(var i = 0; i < arr.length; i++){
			res[i] ={"date": "none",
				"survey": "no",
				"loc": "no",
				"client": "no",
				"privacy": "no"
			};
		} 

		for(var i = 0; i < arr.length; i++){
			if (arr[i].user == name){
				res[total].date = arr[i].utc_timestamp
				res[total].survey = arr[i].survey_title
				res[total].loc = arr[i].timezone
				res[total].client = arr[i].client
				res[total].privacy = arr[i].privacy_state
				total++;
			}
		}

//setting up datatable
		udata = new google.visualization.DataTable();
		udata.addColumn('string', 'Time');
		udata.addColumn('string', 'Survey');
		udata.addColumn('string', 'Timezone');		
		udata.addColumn('string', 'Client');
		udata.addColumn('string', 'Privacy');
		udata.addColumn('string', '');		
//adding data from res into datatable

		for(var x = 0; x < total; x++){
			udata.addRows([[
				res[x].date, res[x].survey, res[x].loc, res[x].client, res[x].privacy, '<span>Insert Search Icon</span>'
			]]);
		}
		
        utable = new google.visualization.Table(document.getElementById('user_div'));
		var options = {'showRowNumber': true};
//		options['page'] = 'enable';
//		options['pageSize'] = 10;
		options['width'] = 500;
		options['allowHtml'] = true;
//		options['pagingButtonsConfiguration'] = 'auto';
		utable.draw(udata, options);
		google.visualization.events.addListener(utable, 'select', uselectHandler);
      }
	  
}