/**
 *
 *
 * ohmg_map demo 2
 *
 *
 */

$(document).ready(function(){

	var map = undefined;



	$.ohmg.login("cs130.07","Clean.order31","ohmage-js",
	    function(data) {
	       
	       var optional = {prompt_id_list : "urn:ohmage:special:all"};//prompt_id_list 

	          
	        $.ohmg.getSurveyResponse(
	                    data.token
	                    , "urn:campaign:ca:ucla:Demo:Snack" //campaign_urn
	                    , undefined //client_type
	                    , "urn:ohmage:special:all" //column_list:
	                    , "json-rows" //output_format
	                    , "urn:ohmage:special:all" //user_list
	                    , optional
	                    , function(data) {
	                    	map = new ohmgMap ("ohmg_map",data);
	                    	console.log(map.getMarkerInfo());

	                    	 var $btn1 = $('<button/>').text("Clear Markers")
	                    	   , $btn2 = $('<button/>').text("Add Markers");

	                    	 $btn1.click(function(){map.clearMarkers();});
	                    	 $btn2.click(function(){map.addMarkers(map.generateMarkers(data.data));});

	        				 $('body').append( $btn1, $btn2);
	                    }
	        );

           
	    }

	 );

});