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

 var map = undefined,
    $markerInfo = $('<div/>');
    $markerInfo.attr("id","mapInfoBox")
               .html("Info");




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


    map = new google.maps.Map(document.getElementById("ohmg_map"), options);

    map.fitBounds(mapBounds);

    var markers = [];
   

    for(var i = 0 ; i < surveyResponses.length; i++ ) {

      response = surveyResponses[i];

      
      if(response.latitude && response.longitude) {
         var latLng = new google.maps.LatLng(response.latitude,
               response.longitude);
         var marker = new google.maps.Marker({'animation': google.maps.Animation.DROP,'position': latLng});
             
         //closure to encapsulate data
         (function(m,r) {
           google.maps.event.addListener(marker, 'click', function() {
                displayPoint(m,r);
            }) 
         })(marker,response);


         markers.push(marker);
       }

   }

   
   var markerCluster = new MarkerClusterer(map, markers);
   google.maps.event.addListener(markerCluster, 'clusterclick', function() {
      $markerInfo.hide();
   });
  
   google.maps.event.addListener(map, 'zoom_changed', function() {
      $markerInfo.hide();
   });
   
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

//ElementOverlay inspired from http://marcgrabanski.com/article/jquery-google-maps-tutorial-basics

function displayPoint(marker,response){ 


  $markerInfo.hide(); 


   var moveEnd = google.maps.event.addListener(map, "idle" , function() {

      var messageOverlay = new ElementOverlay( { map: map }, $markerInfo[0], marker.getPosition(), response );

      messageOverlay.draw();

          

      google.maps.event.removeListener(moveEnd);

  });


  map.panTo(marker.getPosition()); 
  
}


function ElementOverlay(options, overlayedObject, point,response)   {

    this.setValues(options);

    this.div_ = overlayedObject;

    this.div_point_ = point;

    this.response_ = response;

};



ElementOverlay.prototype = new google.maps.OverlayView();



ElementOverlay.prototype.onAdd = function() {

    var pane = this.getPanes().floatPane; //panel 6 used for InfoBox

    pane.appendChild(this.div_);


    // This is how to get pixels

    var curOffset = this.getProjection().fromLatLngToDivPixel(this.div_point_);

        

    $(this.div_).text("")
      .html(  "<ul>"
            + "<li><span>User:</span>" + this.response_.user + "</li>"
            + "<li><span>Date:</span>" + this.response_.timestamp.split(" ")[0] + "</li>"
            + "<li><span>Time:</span>" + this.response_.timestamp.split(" ")[1] + "</li>"
            + "<li><span>Privacy:</span>" + this.response_.privacy_state + "</li>"
            + "</ul>" )
      .fadeIn().css({ top: (curOffset.y ), left: (curOffset.x) } )
      .click(function(){ $(this).fadeOut(); });

}



ElementOverlay.prototype.onRemove = function() {

    this.div_.parentNode.removeChild(this.div_);

}

ElementOverlay.prototype.draw = function() {}
