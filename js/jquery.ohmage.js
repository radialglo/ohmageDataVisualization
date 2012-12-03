/**
 * jQuery ohmg
 * $.ohmg is used to communicate with a Ohmage server, the server methods can
 * be called directly without creating an instance
 *
 *  //See wiki for more documentation regarding Ohmage server APIs
 *  https://github.com/cens/ohmageServer/wiki/
 * (r) = required
 * (o) = optional
 *
 */

(function($) {

$.ohmg = $.ohmg || {};

var  defaultSuccess = function(data) {

        console.log(data);

        if(data.result === "failure") {
                throw("Error : " + data.errors[0]["text"]);
        }
 }
 , defaultFail = function(data) {
        console.log(data);
 };


 $.extend($.ohmg, {
  
    auth_token: undefined,
    setToken: function(token) {
        this.auth_token = token 
    },
    getToken: function() {
        return this.auth_token;
    },

    client_type: "ohmage-js",

        login: function(username,password,client_type,onSuccess,onFail){

                var $self = this, 
                setToken = function(data) {
                                //default handler for on Success
                                console.log(data);
                                $self.setToken(data.token);
                                
                };
                
                client_type = client_type || this.client_type;
                
                if(!isFunction(onSuccess)) {
                        onSuccess = setToken;
                }
                
                if(!isFunction(onFail)) {
                        onFail = defaultFail;
                }

                ajax({
                
                        url: this.url.root + "/" +   this.url.authentication
        
                        , data: {   user : username
                                    , password: password
                                    , client: client_type
                                }
                        , success: onSuccess
                        , error: onFail

                });
        },

        getCampaigns: function(auth_token,client_type,output_format,optional,onSuccess,onFail){
        /*
                (r) auth_token = A valid authentication token. May also be set using the Set-Cookie header.
                (r) client = A short description of the client making the request.
                (r) output_format = short || long || xml
                (o) campaign_urn_list = urn:campaign:CS101,urn:campaign:CS102
                (o) start_date = 2011-11-01
                (o) end_date = 2011-11-11
                (o) privacy_state = shared || private
                (o) running_state = running || stopped
                (o) user_role = author (used as a filter on the logged-in user)
                (o) class_urn_list = urn:class:class1,urn:class:class2
                (o) campaign_name_search = A whitespace-deliminated, double-quote-respected, search string which limits the results to only those campaigns whose name contains at least one of the search tokens.
                (o) campaign_description_search = A whitespace-deliminated, double-quote-respected, search string which limits the results to only those campaigns that have a description and whose description contains at least one of the search tokens.
        */
                client_type = client_type || this.client_type;

                if(!isFunction(onSuccess)) {
                        onSuccess = defaultSuccess;
                }

                if(!isFunction(onFail)) {
                        onFail = defaultFail;
                }

                var data = generateParameters(
                                   {  auth_token:  auth_token
                                    , client: client_type 
                                    , output_format: output_format
                                   },optional);

                ajax({
                
                        url: this.url.root + "/" + this.url.campaign_read
                        , data: data
                        , success: onSuccess
                        , error: onFail

                });
        },

        getSurveyResponse: function(auth_token,campaign_urn,client_type,column_list,output_format,user_list,optional,onSuccess,onFail){
                /*
                Supports Token-Based Authentication ...

                (r) auth_token = A valid authentication token from user/auth_token. May also be set using the Set-Cookie header.
                ... or User-Password Authentication

                (r) user = A username of the user attempting to login
                (r) password = A password for the above user.
                Additional Parameters

                (r) campaign_urn = A valid campaign URN for the currently logged in user.
                (r) client = The name of the software client accessing the API. //renamed as client_type for js function
                (r) column_list = One or more of the URNs in the table belown in a comma-separated list or urn:ohmage:special:all.
                (o) end_date = Must be present if start_date is present; allows querying against a date range
                (r) output_format = One of json-rows, json-columns, or csv.
                (o) pretty_print = A boolean that if true will indent JSON output.
                (o) prompt_id_list = Optional, but must be present if survey_id_list is not present. A comma separated list of prompt ids which must exist in the campaign being queried. urn:ohamge:special:all is also allowed.
                (o) privacy_state = If present, must be one of "private" or "shared". The output is dependent on the access-control rules governing the role of the logged-in user.
                (o) sort_order = Controls the SQL ORDER BY clause: a comma separated list containing user, timestamp, survey in any order.
                (o) start_date = Optional, but must be present if end_date is present: allows querying against a date range.
                (o) suppress_metadata = A boolean [true|false] to control whether the metadata section of the output will be returned.
                (o) survey_id_list = Optional, but must be present if prompt_id_list is not present. A comma separated list of survey ids which must exist in the campaign being queried. urn:ohamge:special:all is also allowed.
                (r) user_list = A comma separated list of usernames that must be valid for the campaign being queried. urn:ohmage:special:all is also allowed.
                (o) return_id = A boolean indicating whether to return the primary key of the survey for client update/delete purposes. This parameter is only available for json-rows output.
                (o) collapse = A boolean indicating whether to collapse duplicate results: this is most useful when asking the API to provide specific columns e.g., when you only want the a list of unique users to be returned. This will result in a new key in each "row" for json-rows and a new "column" in json-columns and csv output. The new "key" will be "count" and the new "column" will be "urn:ohmage:context:count".
                (o) num_to_skip = The number of survey responses to skip in reverse chronological order in which they were taken.
                (o) num_to_process = The number of survey responses to process after the skipping those to be skipped via 'num_survey_responses_to_skip'.
                (o) survey_response_id_list = A comma-separated list of survey response IDs. The results will only be of survey responses whose ID is in this list.
                */
                
                client_type = client_type || this.client_type;

                if(!isFunction(onSuccess)) {
                        onSuccess = defaultSuccess;
                }

                if(!isFunction(onFail)) {
                        onFail = defaultFail;
                }

                var data = generateParameters(
                                 {  auth_token:  auth_token
                                  , campaign_urn: campaign_urn
                                  , client: client_type
                                  , column_list: column_list
                                  , output_format: output_format
                                  , user_list:  user_list
                                 },optional);

                ajax({
                          url: this.url.root + "/" + this.url.survey_read
                        , data: data
                        , success: onSuccess
                        , error: onFail
                });
        }

        
 });// end $.ohmg


function ajax(obj,ajaxOptions) {

        var defaultAjaxOptions = {
                type: "POST"
              , dataType: "json"
              , headers:{ "Accept": "application/json"}
        };


        ajaxOptions = $.extend(ajaxOptions,defaultAjaxOptions);


        $.ajax($.extend($.extend({

        },obj),ajaxOptions));


}


$.ohmg.url = {
        
          root: "https://test.ohmage.org"
        , authentication: "app/user/auth_token"
        , campaign_read: "app/campaign/read"
        , survey_read: "app/survey_response/read"
        , image_read: "app/image/read"
}

function isFunction(func) {
        return (func && typeof(func) === "function" ) ? true : false;
}

function generateParameters(required,optional) {

        if(required && typeof(required) === "object" ) {

                return $.extend(required,optional); //if optional is undefined this will just return required


        } else {
                throw("The 'required' parameter must be an object");
        }

}


})(jQuery);
