/*********************************************************************************
 * The MIT License																 *
 *																				 *
 * Copyright (c) 2013 YanchWare ( https://www.yanchware.com  )					 *
 * by: Angelo Agatino Nicolosi - angelo.nicolosi[at]yanchware.com				 *
 * 																				 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy	 *
 * of this software and associated documentation files (the "Software"), to deal *
 * in the Software without restriction, including without limitation the rights	 *
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell	 *
 * copies of the Software, and to permit persons to whom the Software is		 *
 * furnished to do so, subject to the following conditions: 					 *
 *																				 *
 * The above copyright notice and this permission notice shall be included in	 *
 * all copies or substantial portions of the Software.							 *
 *																				 *
 ********[ Facebook plugin ]******************************************************
 *																				 *
 *	Requirements: modernizer.js													 *
 *																				 *
 *********************************************************************************/

var SocialGap = (function (socialGap) {

    var facebook_graph = "https://graph.facebook.com";
    var facebook_token = "";
    var ref;
    var ref_logout;
    var _hasLogin = false;

	/* !!! Modify the following settings !!! */
	var settings = {
		appID: "",
		appSecret: "",
		appDomain: "",
		scopes: ""
	};

	/*----------------------------------------------------------------------*/
	/* Public fields														*/
	/*----------------------------------------------------------------------*/
	socialGap.CODE_OK = 0;
	socialGap.CODE_ERROR = 1;

	/*----------------------------------------------------------------------*/
	/* Public Method: Facebook_Init											*/
	/*----------------------------------------------------------------------*/
	socialGap.Facebook_PerformLogon = function (onSuccess, onFailure) {
		if(!isFunction(onSuccess) || !isFunction(onFailure))
		{
			console.log("[SocialGap for Facebook] Illegal arguments. Call back functions are not defined.");
			return;
		}
		
		//If ExtendedToken is available just use it
		if(isExtendedTokenAvailable())
			onSuccess(getStoredExtendedToken());

		//Procedure for requiring an extended token:
		//1. create a short-lived access token
		//2. extend it to a long-lived access token
				
		//1. Creating short-lived access token
		var authorize_url = facebook_graph + "/oauth/authorize?type=user_agent&client_id=" + config.app_id + "&redirect_uri=" + 
							config.host + "/connect/login_success.html&display=touch&scope=" + config.scope;
		
		ref = window.open(authorize_url, "_blank", "location=no");
        
		//Hooking listeners
		ref.addEventListener("loadstart", function (event) {
            extendAccessToken(event.url, onSuccess, onFailure);
        });
        
		ref.addEventListener("loadstop", function (event) {
        	onFailure();
        });
        
		ref.addEventListener("loaderror", function (event) {
            ref.close();
            onFailure();
        });

        ref.addEventListener("exit", function (event) {});

    }

	/*----------------------------------------------------------------------*/
	/* Private Functions													*/
	/*----------------------------------------------------------------------*/
	
	function extendAccessToken(url, onSuccess, onFailure)
	{
		var arrayUrl = url.split("access_token=");
		if (arrayUrl.length > 0) {
			shortLivedToken = arrayUrl[1].split("&")[0];
			checkAndExtendToken(shortLivedToken, onSuccess, onFailure);
		}
	};
	
	function checkAndExtendToken(shortLivedToken, onSuccess, onFailure)
	{
		var xhr = new XMLHttpRequest();
		xhr.open("GET", facebook_graph + "/me?access_token=" + shortLivedToken, true);
		xhr.onreadystatechange = function() {
			if (xmlhttp.readyState==4 && xmlhttp.status==200)
			{
				alert('Ready to request new token');
			}
			else onFailure();
		};
		xhr.send();
	};
	
	function isFunction(functionToCheck) 
	{
		var getType = {};
		return functionToCheck && getType.toString.call(functionToCheck) == "[object Function]";
	};

	function isExtendedTokenAvailable()
	{
		//TODO: Implement get from localCache and check that token is still valid
		return false;
	};
	
	function getStoredExtendedToken()
	{
		//TODO: Implement
		return "";
	};
	
	
	
	return socialGap;


}(SocialGap || {}));