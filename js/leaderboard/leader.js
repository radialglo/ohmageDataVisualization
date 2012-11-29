google.load('visualization', '1', {packages:['table']});

var Leaderboard = {

drawTable: function (surv) {
		var arr = surv.data;
var hi = [];
var total = 0;
var res = [];

//initialization of the res array
for(var i = 0; i < arr.length; i++){
res[i] ={"name": "no",
	"total": 9,
	"privacy": "no",
	"last": "no"
};
} 
//using hi as a hash array, hash IDs in arr
for(var i = 0; i < arr.length; i++){
	if (hi[arr[i].user] >= 1)
		hi[arr[i].user] ++;  
	else{
		total++;
		hi[arr[i].user] = 1;
	}
}
//move relevant entries (ID and total count) over to res
var i = 0;
for (keys in hi){
     res[i].total = hi[keys];
	 res[i].name = keys;
	 i++;
}
//run through arr one more time to fill in the privacy and the last update entries of res
for (var y = 0; y < total; y++){
	var x = 0;
	while(res[y].name != arr[x].user){
		x++;
	}
	res[y].privacy = arr[x].privacy_state;
	res[y].last = arr[x].timestamp;
}



var data = new google.visualization.DataTable();
data.addColumn('string', 'ID');
data.addColumn('number', 'Responses');
data.addColumn('string', 'Last Response');		
data.addColumn('string', 'Privacy State');	
//add data in res into the array
for(var x = 0; x < total; x++){
	data.addRows([[
		res[x].name, res[x].total, res[x].last, res[x].privacy
	
	]]);
	console.log (res[x]);
}
		
		
        var table = new google.visualization.Table(document.getElementById('table_div'));
      //  table.draw(data, {showRowNumber: true, width: '400', allowHtml:true});
		table.draw(data, {showRowNumber: true});
      }


}