/**
 *
 *
 * ohmg_map demo
 *
 *
 */

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
                    , getSurveyInfo
		);
     }

 );


 function getSurveyInfo(obj) {
 
    console.log(obj);//JSON obj containing result status, data , meta dat
    
    var surveyResponses = obj.data //array containing all response data 
      , response = undefined;


    
    var mapBounds = getBounds(surveyResponses)
      , center = mapBounds.getCenter();

    var options = {
          'zoom': 7,
          'center': center,
          'mapTypeId': google.maps.MapTypeId.ROADMAP
    };


    var map = new google.maps.Map(document.getElementById("ohmg_map"), options);

    map.fitBounds(mapBounds);

    var markers = [];


	for(var i = 0 ; i < surveyResponses.length; i++ ) {

      response = surveyResponses[i];

   	  //$('body').append("<p>"+ JSON.stringify(response) + "</p><br/>");
     
      //console.log("latitude: " + response.latitude + " longititude: " + response.longitude);
      
      if(response.latitude && response.longitude) {
         var latLng = new google.maps.LatLng(response.latitude,
               response.longitude);
         var marker = new google.maps.Marker({'position': latLng});
             markers.push(marker);
       }
   }

   var markerCluster = new MarkerClusterer(map, markers);
   
}


function getBounds(arr) {
    //@param arr - data array from JSON of getSurveyReponses
    // returns google.maps.LatLngBounds instance

    var latlngbounds = new google.maps.LatLngBounds();

    for(var i = 0; i < arr.length; i++) {

        var latlng = new google.maps.LatLng(arr[i].latitude,arr[i].longitude);
        latlngbounds.extend(latlng);
       
    }

    return latlngbounds;

}

function centerMapAndFitMarkers(map,latlngbounds) {

    map.setCenter(latlngbounds.getCenter());
    map.fitBounds(latlngbounds); 

}



/*
function computeCenter(arr) {

    var lat = 0, lng = 0, count = 0;

    for(var i = 0; i < arr.length; i++) {

        if(arr[i].latitude && arr[i].longitude) {

            lat += arr[i].latitude;
            lng += arr[i].longitude;
            count +=1;
        }
    }

   return  {
         latitude : lat/count
       , longitude: lng/count
   
   };


} */
