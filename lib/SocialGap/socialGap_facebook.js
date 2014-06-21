/*********************************************************************************
 * The MIT License																 
 *																				 
 * Copyright (c) 2013 YanchWare ( https://www.yanchware.com  )					 
 * by: Angelo Agatino Nicolosi - angelo.nicolosi[at]yanchware.com				 
 * 																				 
 * Permission is hereby granted, free of charge, to any person obtaining a copy	 
 * of this software and associated documentation files (the "Software"), to deal 
 * in the Software without restriction, including without limitation the rights	 
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell	 
 * copies of the Software, and to permit persons to whom the Software is		 
 * furnished to do so, subject to the following conditions: 					 
 *																				 
 * The above copyright notice and this permission notice shall be included in	 
 * all copies or substantial portions of the Software.							 
 *																				 
 ********[ Facebook plugin ]******************************************************
 *																				 
 *	Requirements: modernizer.js													 
 *																				 
 *********************************************************************************/

var SocialGap = (function (socialGap) {

	var facebook_graph = "https://graph.facebook.com";
	var processing = true;
	var LS_TOKEN_KEY = "SocialGap_Facebook_Token";

	/* !!! Modify the following settings !!! */
	var settings = {
		appID: "",
		appSecret: "",
		appDomain: "",
		scopes: ""
	};

	/*----------------------------------------------------------------------*/
	/* Public fields
	/*----------------------------------------------------------------------*/
	socialGap.CurrentFBToken = "";

	/*----------------------------------------------------------------------*/
	/* Public Method: Facebook_PerformLogon
	/*----------------------------------------------------------------------*/
	socialGap.Facebook_PerformLogon = function (onSuccess, onFailure) {
		if(!isFunction(onSuccess) || !isFunction(onFailure))
		{
			console.log("[SocialGap for Facebook] Illegal arguments. Call back functions are not defined.");
			return;
		}
		
		if(!socialGap.deviceReady)
		{
			console.log("[SocialGap for Facebook] Device is not ready.");
			return;
		}

		//If ExtendedToken is available just use it
		getStoredExtendedToken(function(isValidToken){
			if(!isValidToken)
			{
				localStorage.removeItem(LS_TOKEN_KEY);
				socialGap.CurrentFBToken = "";
			  	getNewExtendedToken(onSuccess, onFailure);
			}else
			{
				onSuccess(socialGap.CurrentFBToken);
			}
		});
	}
	
	function getNewExtendedToken(onSuccess, onFailure)
	{
		//Procedure for requiring an extended token:
		//1. create a short-lived access token
		//2. extend it to a long-lived access token. This step SHOULD be implemented on the server and not here in the client.
		//For production usage, perform this call from your servers. More information: https://developers.facebook.com/docs/facebook-login/access-tokens

		//1. Creating short-lived access token
		var authorize_url = facebook_graph + "/oauth/authorize?type=user_agent&client_id=" + settings.appID + "&redirect_uri=" + 
							settings.appDomain + "/connect/login_success.html&display=touch&scope=" + settings.scopes;

		ref = window.open(authorize_url, "_blank", "location=no");

		//Hooking listeners
		ref.addEventListener("loadstart", function (event) {
			var shortLivedToken = extractTokenFromString(event.url);
			if(shortLivedToken != null)
				checkAndExtendToken(shortLivedToken);	
			else processing = false;	
		});

		ref.addEventListener("loadstop", function (event) {
			ref.close();
		});

		ref.addEventListener("loaderror", function (event) {
			ref.close();
			onFailure();
		});

		ref.addEventListener("exit", function (event) {
			checkOutput(onSuccess, onFailure);
		});

	}

	/*----------------------------------------------------------------------*/
	/* Private Functions
	/*----------------------------------------------------------------------*/

	/** Wait for completition of the async calls against the facebook Graph API */	
	function checkOutput(onSuccess, onFailure)
	{
		if(!processing && socialGap.CurrentFBToken.length <= 0)
		{
			onFailure();
			return;
		}

		if(socialGap.CurrentFBToken.length > 0)
		{
			onSuccess(socialGap.CurrentFBToken);
			return;
		}

		window.setTimeout(function(){
			checkOutput(onSuccess, onFailure);
		}, 100);
	}

	/** Checks a token and if it is valid extends its time to live */
	function checkAndExtendToken(shortLivedToken)
	{
		processing = true;
		checkToken(shortLivedToken, function(isValidToken){
			if(isValidToken)
				extendToken(shortLivedToken);
			else processing = false;
		});		
	};

	/** Checks the validity of the token in input */
	function checkToken(token, callback)
	{
		var xhr = new XMLHttpRequest();
		xhr.open("GET", facebook_graph + "/me?access_token=" + token, true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState==4)
			{
				if(xhr.status!=200)
				{
					callback(false);
					return;
				}

				//The token works!
				callback(true);				
			}
		};
		xhr.send();
	}

	/** Transforms a short-lived token in a long-lived one. */
	function extendToken(shortLivedToken)
	{
		processing = true;
		var xhr = new XMLHttpRequest();
		xhr.open("GET", facebook_graph + "/oauth/access_token?grant_type=fb_exchange_token&client_id="+ settings.appID +"&client_secret=" + 
						settings.appSecret + "&fb_exchange_token=" + shortLivedToken, true);

		xhr.onreadystatechange = function() {
			if (xhr.readyState==4)
			{
				if(xhr.status!=200)
				{
					processing = false;
					return;
				}
					
				processing = true;
				var longLivedToken = extractTokenFromString(xhr.responseText);
				if(longLivedToken != null)
				{
					checkToken(longLivedToken, function(isValidToken){
						if(isValidToken)
						{
							socialGap.CurrentFBToken = longLivedToken;
							storeExtendedToken(longLivedToken);
						}	else processing = false;
					});
				} else processing = false;
			}
		};
		xhr.send();				
	}

	/** Utility - extracts token from the input string */
	function extractTokenFromString(tokenStr)
	{
		var tokenArr = tokenStr.split("access_token=");
		if (tokenArr.length > 1 && tokenArr[1].indexOf('&') >= 0 ) {
			return tokenArr[1].split("&")[0];
		}else return null;
	};

	/** Utility - checks if the element in input is a function */
	function isFunction(functionToCheck) 
	{
		var getType = {};
		return functionToCheck && getType.toString.call(functionToCheck) == "[object Function]";
	};
	
	/** Utility - get the stored long-lived token if any and check its validity */
	function getStoredExtendedToken(callback)
	{
		if (typeof(Modernizr) != "undefined" && Modernizr.localstorage) {
			// window.localStorage is available!
		  	var token = localStorage.getItem(LS_TOKEN_KEY);
		  	if(token != null)
			{
				socialGap.CurrentFBToken = token;
				checkToken(token, callback);
			}
			else callback(false);
		} else {
		  // no native support for HTML5 storage :(
		  //TODO: maybe try dojox.storage or a third-party solution
		  callback(false);
		}
	};

	/** Utility - store new long-lived token in localStorage */
	function storeExtendedToken(longLivedToken)
	{
		if (typeof(Modernizr) != "undefined" && Modernizr.localstorage) {
			localStorage.setItem(LS_TOKEN_KEY, longLivedToken);
		}
	};


	return socialGap;


}(SocialGap || {}));