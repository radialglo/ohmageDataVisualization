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

	+   '<h2 id="user_name"></h2>',
	$('<a/>').click(function(){
		toggle_visibility("table_div");
		toggle_visibility("user_vis");
	})
	.text("View Leaderboard")
	.attr("href","#"),

		//'<a href="#" onclick="toggle_visibility("table_div");toggle_visibility("user_vis")">Back</a>'

		'<div id="user_div" style="width: 500px; height: 200px;""> </div>'
	+	'<div id="res_div" style="display:none; width: 500px; height: 200px;"> </div>'
	+ '</div>' 
);




$.ohmg.login(user,password, client_type,
 function(data) {

 var optional = {
	              prompt_id_list : prompt_id_list ////prompt_id_list 
                , sort_order : sort_order
               }; 


        auth_token = data.token;
       
          
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
                    	TimeSeries.initSurveyResponse(data,queryByDate);

                    	
                    }
        );

       
    }

 );//end login

//TODO: add Observer code here





});//end document.ready






function queryByUser(){

		 var optional = {
	              prompt_id_list : prompt_id_list ////prompt_id_list 
                , sort_order : sort_order
               };

          //TODO: add LeaderBoard.getUser
         var OneUser = "ohmage.landa";

		$.ohmg.getSurveyResponse(
                      auth_token
                    , campaign_urn //campaign_urn
                    , client_type //client_type
                    , column_list //column_list:
                    , output_format //output_format
                    , OneUser //user_list
                    , optional
                    , function(obj) {

                    	console.log(obj);
                    	
                    	map.clearMarkers();
                    	map.addMarkers( map.generateMarkers(obj.data) );
                    	map.centerMapandFitMarkers(map.getBounds(obj.data) );

                    	TimeSeries.initSurveyResponse(obj,queryByDate);

                    	User.drawTable(obj,OneUser);
                    	
                    }
      );


}

function queryByDate (){

	var start_date = TimeSeries.getStartDate()
	  , end_date = TimeSeries.getEndDate();

	 var optional = {
	              prompt_id_list : prompt_id_list ////prompt_id_list 
                , sort_order : sort_order
                , start_date : start_date
                , end_date : end_date
               }; 


	$.ohmg.getSurveyResponse(
                      auth_token
                    , campaign_urn //campaign_urn
                    , client_type //client_type
                    , column_list //column_list:
                    , output_format //output_format
                    , user_list //user_list
                    , optional
                    , function(obj) {

                    	console.log(obj);
                    	
                    	map.clearMarkers();
                    	map.addMarkers( map.generateMarkers(obj.data) );
                    	map.centerMapandFitMarkers(map.getBounds(obj.data) );
                    	
                    	Leaderboard.drawTable(obj);
                    	
                    }
      );



}
