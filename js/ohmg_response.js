google.load('visualization', '1', {packages:['table']});

var camp = 'urn:campaign:ca:ucla:Demo:Snack';

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
				
				//var image_link = 'https://test.ohmage.org/app/image/read';
				var image_link = $.ohmg.url.root + "/" + $.ohmg.url.image_read;
				
				image_link+= '?id=' + survey[i].prompt_response
				image_link+= '&amp;camaign_urn=';
				image_link+= camp;
				image_link+= '&amp;auth_token=' + $.ohmg.getToken()
				image_link+= '&amp;owner=' + tname + '&amp;client=android&amp;size=small';

				rdata.addRows([[
				//https://test.ohmage.org/app/image/read?id=c4710b56-93d2-4a3a-a7fc-1c6d45b04988&amp;campaign_urn=urn:campaign:ca:ucla:Demo:Advertisement&amp;auth_token=d3540b47-61bb-421a-bf7f-56961316dd0e&amp;owner=mobilize.student&amp;client=ohmage-gwt&amp;size=small" class="GHKF5YNDE0B
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
//		options['page'] = 'enable';
//		options['pageSize'] = 10;
		options['width'] = 500;
		options['allowHtml'] = true;
//		options['pagingButtonsConfiguration'] = 'auto';
		rtable.draw(rdata, options);
      }
	  
}