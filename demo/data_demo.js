/**
 * jQuery ohmg demo
 *
 *
 *
 *
 */

$(document).ready(function(){

        var defaultTimeout = 600; //in milliseconds

        $.ohmg.login("cs130.07","Clean.order31");

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
                                        , undefined //client_type
                                        , "urn:ohmage:special:all" //column_list:
                                        , "json-rows" //output_format
                                        , "urn:ohmage:special:all" //user_list
                                        , optional
                );

        }, defaultTimeout);


});
