google.load('visualization', '1', {packages:['table']});


var Response = {
	drawTable: function (survey) {

//setting up datatable
		var rdata = new google.visualization.DataTable();
		rdata.addColumn('string', 'Prompt');
		rdata.addColumn('string', 'Response');
		
//adding data from res into datatable

		for(var i in survey){

			if(survey[i].prompt_type == 'photo' && survey[i].prompt_response != "SKIPPED"){
				console.log(survey[i].prompt_response);
	
				var image_link = $.ohmg.url.root + "/" + $.ohmg.url.image_read;
				
				image_link+= '?id=' + survey[i].prompt_response
				image_link+= '&amp;camaign_urn=';
				image_link+= campaign_urn;
				image_link+= '&amp;auth_token=' + $.ohmg.getToken()
				image_link+= '&amp;owner=' + tname + '&amp;client=android&amp;size=small';

				rdata.addRows([[
					survey[i].prompt_text, '<img class="img-polaroid" src="' +image_link + '">'
				]]);
				
				
			}
			else {
				rdata.addRows([[
					survey[i].prompt_text, String(survey[i].prompt_response)
				]]);
			}
		}
		
        var rtable = new google.visualization.Table(document.getElementById('res_div'));
		var options = {'showRowNumber': true};
		options['width'] = 500;
		options['allowHtml'] = true;
		rtable.draw(rdata, options);
      }
	  
}