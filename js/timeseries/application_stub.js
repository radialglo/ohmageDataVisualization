//Javascript 
$(document).ready(function(){

  var defaultTimeout = 1500;
  
  $.ohmg.login("cs130.07","Clean.order31");
  //invokes jquery.ohmage call to get survey response, 
  // which if succeeds, will set the Survey response of the TimeSeries Graph.
  //the survey response will be sorted by timestamp.
  setTimeout(function() 
  {
    var auth_token = $.ohmg.getToken();
    var optional = {prompt_id_list : "urn:ohmage:special:all"
                    , sort_order : "timestamp,user,survey"}; //setting sort order by timestamp
                  
    $.ohmg.getSurveyResponse(
                             auth_token
                           , "urn:campaign:ca:ucla:Demo:Snack" //campaign_urn
                           , undefined //client_type ; if client is not defined it defaults to ohmage-js
                           , "urn:ohmage:special:all" //column_list:
                           , "json-rows" //output_format
                           , "urn:ohmage:special:all" //user_list
                           , optional
                           , function(surveyResponseTable){
                               TimeSeries.setSurveyResponse(surveyResponseTable);
                             });
    
  }, defaultTimeout);

});