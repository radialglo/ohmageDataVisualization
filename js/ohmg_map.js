/**
 *
 * ohmg Map
 * class defintion for Ohmage Map and supporting class
 *
 */

  /* ==== ==== */
  // ohmgMap
  /* ==== ==== */

 function ohmgMap(mapID,obj) {
 //constructor for map
 
     var surveyResponses = obj.data //array containing all response data 
       , response = undefined

       , mapBounds = this.getBounds(surveyResponses)
       , center = mapBounds.getCenter()

       , options = {
             'zoom': 7,
             'center': center,
             'mapTypeId': google.maps.MapTypeId.ROADMAP
        }

       , map =  new google.maps.Map(document.getElementById(mapID), options)
       , $markerInfo = $('<div/>')

       , markers = this.generateMarkers(surveyResponses)
       , markerClusterer = new MarkerClusterer(map, markers);




     $markerInfo.attr("id","mapInfoBox");

  
     this.getMap = function() {
        return map;
     }
 

     this.getMarkerInfo = function() {
        return $markerInfo;
     }

     this.getMarkerClusterer = function() {
        return markerClusterer;
     }

     map.fitBounds(mapBounds);
     this.addMarkers(markers);

 }

 ohmgMap.prototype.generateMarkers = function(surveyResponses) {

    var markers = []
      , reponse = undefined
      , self = this;
   

    for(var i = 0 ; i < surveyResponses.length; i++ ) {

      response = surveyResponses[i];

      
      if(response.latitude && response.longitude) {
         var latLng = new google.maps.LatLng(response.latitude,
               response.longitude);
         var marker = new google.maps.Marker({'animation': google.maps.Animation.DROP,'position': latLng});
             
         //closure to encapsulate data
         (function(m,r) {
           google.maps.event.addListener(marker, 'click', function() {
                self.displayPoint(m,r);
            }) 
         })(marker,response);


         markers.push(marker);
       }

   }

    return markers;
 }


 ohmgMap.prototype.addMarkers = function(markers) {

  //@param markers - array of markers

  var markerCluster = this.getMarkerClusterer()
      self = this;

   markerCluster.addMarkers(markers);

   google.maps.event.addListener(markerCluster, 'clusterclick', function() {
      self.getMarkerInfo().hide();
   });
  
   google.maps.event.addListener(this.getMap(), 'zoom_changed', function() {
      self.getMarkerInfo().hide();
   });

 }

 ohmgMap.prototype.clearMarkers = function() {
    
    this.getMarkerClusterer().clearMarkers()

 }

 ohmgMap.prototype.displayPoint = function(marker,response) {

    this.getMarkerInfo().hide(); 

    var  self = this;


   var moveEnd = google.maps.event.addListener(this.getMap() , "idle" , function() {

      var messageOverlay = new ElementOverlay( { map: self.getMap() }, self.getMarkerInfo()[0], marker.getPosition(), response );

      messageOverlay.draw();

          

      google.maps.event.removeListener(moveEnd);

  });


  this.getMap().panTo(marker.getPosition()); 
 
 }

 ohmgMap.prototype.getBounds = function(arr) {

    //@param arr - data array from JSON of getSurveyReponses
    // returns google.maps.LatLngBounds instance

    var latlngbounds = new google.maps.LatLngBounds();

    for(var i = 0; i < arr.length; i++) {

        var latlng = new google.maps.LatLng(arr[i].latitude,arr[i].longitude);
        latlngbounds.extend(latlng);
       
    }


    return latlngbounds;

 }

 ohmgMap.prototype.centerMapandFitMarkers = function(latlngbounds) {

    this.setCenter(latlngbounds.getCenter());
    this.fitBounds(latlngbounds); 
 
 }

 /* ==== ==== */
  // ElementOverlay
 /* ==== ==== */


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
            + "<li><span>Survey:</span>" + this.response_.survey_id + "</li>"
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





 
  
