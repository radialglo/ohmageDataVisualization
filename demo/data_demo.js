/**
 * jQuery ohmg demo
 *
 *
 *
 *
 */

$(document).ready(function(){

        var defaultTimeout = 1500; //in milliseconds

        // by default success handler is set for login if none is supplied
        //$.ohmg.login("cs130.07","Clean.order31");

        $.ohmg.login("cs130.07","Clean.order31","ohmage-js",
                //Success Handler which sets the authorization token and gets the Campaigns
                function(data){
                        console.log("Successful Login");
                        console.log(data);
                        $.ohmg.setToken(data.token);
                        $.ohmg.getCampaigns(data.token,"ohmage-js","long");
                });


        setTimeout(function(){

                //wait until authentication is complete before getting token

                var auth_token = $.ohmg.getToken();

                $.ohmg.getCampaigns(auth_token,"ohmage-js","long");
        
        }, defaultTimeout);

        setTimeout(function(){
                //wait until authentication is complete before getting token

                var auth_token = $.ohmg.getToken()
                  , optional = {prompt_id_list : "urn:ohmage:special:all"};//prompt_id_list
                  
                $.ohmg.getSurveyResponse(
                                          auth_token
                                        , "urn:campaign:ca:ucla:Demo:Snack" //campaign_urn
                                        , undefined //client_type ; if client is not defined it defaults to ohmage-js
                                        , "urn:ohmage:special:all" //column_list:
                                        , "json-rows" //output_format
                                        , "urn:ohmage:special:all" //user_list
                                        , optional
                );

        }, defaultTimeout);


});
