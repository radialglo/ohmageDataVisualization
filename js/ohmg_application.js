/**
 *
 * ohmg_application.js
 *
 *
 *
 */

var user = "cs130.07"
  , password = "Clean.order31"
  , auth_token = undefined;

var campaign_urn = "urn:campaign:ca:ucla:Demo:Snack" //campaign_urn
  , client_type  = "ohmage-js" //client_type
  , column_list  = "urn:ohmage:special:all" //column_list:
  , output_format = "json-rows" //output_format
  , user_list = "urn:ohmage:special:all"; //user_list


var prompt_id_list = "urn:ohmage:special:all" 
  , sort_order = "timestamp,user,survey";

var map = undefined; 

var recalculateTimeSeries = true;

$(document).ready(function(){

$('body').append(

   $('<div/>').attr("id","chart_div")
              .css({"width": "800px", "height": "180px"}),
   
   $('<p/>').text("Start: ")
           .append(
   	  			$('<input/>').attr({"type":"text","id":"dp_start"})
   			),

   $('<p/>').text("End: ")
      		.append(
	  			$('<input/>').attr({"type":"text","id":"dp_end"})
			),

	
   $('<div/>').attr("id","ohmg_map"),



    '<div id="table_div" style="display:block;width: 500px; height: 400px;""></div>'

	+ '<div id="user_vis" style="display:none">' 

	/*+   '<h2 id="user_name"></h2>'/*,
	$('<a/>').click(function(){

		alert("Hello");

		//toggle_visibility("table_div");
		//toggle_visibility("user_vis");

		$("#table_div").toggle();
		$("#user_vis").toggle();

		//$('#user_vis').hide();
	})
	.text("View Leaderboard")
	.attr("href","#"),*/

		//'<a href="#" onclick="toggle_visibility("table_div");toggle_visibility("user_vis")">Back</a>'

	+	'<div id="user_div" style="width: 500px; height: 200px;""> </div>'
	+	'<div id="res_div" style="display:none; width: 500px; height: 200px;"> </div>'
	+ '</div>' 
);

    $("#user_vis").prepend(
		$('<a/>').click(function(e){

			//alert("Hello");

			//toggle_visibility("table_div");
			//toggle_visibility("user_vis");

			$("#table_div").toggle();
			$("#user_vis").toggle();

			User.setNameAll();
			recalculateTimeSeries = true;
			queryByDate();


			return false;

		})
		.text("View Leaderboard")
		.attr("href","#"),
		'<h2 id="user_name"></h2>'
    );




$.ohmg.login(user,password, client_type,
 function(data) {

		var optional = {
			              prompt_id_list : prompt_id_list ////prompt_id_list 
		                , sort_order : sort_order
		               }; 


        auth_token = data.token;
        $.ohmg.setToken(auth_token);

        $.ohmg.getCampaigns(auth_token,client_type,"long",undefined,function(obj){

        	var campaigns = obj.metadata.items, 
        	    $select  = $('<select/>');

        	for(var i = 0; i < campaigns.length ; i++) {
        		$select.append($('<option/>').val(campaigns[i]).text(campaigns[i]));
        	}

        	$select.val(campaigns[0]).prependTo('body');

        	$select.change(function(){

        		campaign_urn =  $(this).find(":selected").val();

            $("#table_div").css({"display":"block"});
            $("#user_vis").css({"display":"none"});


            User.setNameAll();
            recalculateTimeSeries = true;
        		queryByDate();

        	})

        	$.ohmg.getSurveyResponse(
                    data.token
                    , campaign_urn //campaign_urn
                    , client_type //client_type
                    , column_list //column_list:
                    , output_format //output_format
                    , user_list //user_list
                    , optional
                    , function(data) {

                    	map = new ohmgMap ("ohmg_map",data);
                    	Leaderboard.drawTable(data);
                    	Leaderboard.setSelectHandler(queryByDate);
                    	TimeSeries.initSurveyResponse(data,queryByDate);

                    	
                    }
          );


        })

       
    }

 );//end login

//TODO: add Observer code here





});//end document.ready


function queryByDate (){

	 user_list = User.getName();

	var start_date = TimeSeries.getStartDate()
	  , end_date = TimeSeries.getEndDate();



	 var optional = {
	              prompt_id_list : prompt_id_list ////prompt_id_list 
                , sort_order : sort_order
               
               }; 

     if(!recalculateTimeSeries){//user_list !== User.allString() ) {
     	  optional.start_date = start_date;
        optional.end_date = end_date;
     }
     

   


	$.ohmg.getSurveyResponse(
                      auth_token
                    , campaign_urn //campaign_urn
                    , client_type //client_type
                    , column_list //column_list:
                    , output_format //output_format
                    , user_list //user_list
                    , optional
                    , function(obj) {

                    	//console.log(obj);
                    	//console.log(user_list);

                        var markers =  map.generateMarkers(obj.data) ;

                    	map.clearMarkers();
                    	map.addMarkers( markers );


                    	if(markers.length > 0 ) {
                    		map.centerMapandFitMarkers(map.getBounds(obj.data) );
                    	}

                    	

                    	if(user_list === User.allString()) {


                    		Leaderboard.drawTable(obj);

                    	} else {

                    		User.drawTable(obj.data,user_list);
                    	}

                    	if(recalculateTimeSeries) {

                    		TimeSeries.initSurveyResponse(obj,queryByDate);
                        }
                    	recalculateTimeSeries = false;
                    }
      );



}
