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

	/*-----------------------------------------------------------------------
	/* Private fields
	/*----------------------------------------------------------------------*/
	var facebook_graph = "https://graph.facebook.com";
	var baseCheckUrl = facebook_graph + "/me?access_token=";
	var queryStringTokenKey = "access_token";
	var extensionName = "Facebook";
	var processing = true;
	var LS_TOKEN_KEY = "SocialGap_Facebook_Token";
	var authorized = false;

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
	/* Public Method: Facebook_ChangeSettings
	/*----------------------------------------------------------------------*/
	socialGap.Facebook_ChangeSettings = function (appID, appSecret, appDomain, scopes) {
		settings.appID = appID;
		settings.appSecret = appSecret;
		settings.appDomain = appDomain;
		settings.scopes = scopes;
	};


	/*----------------------------------------------------------------------*/
	/* Public Method: Facebook_PerformLogon
	/*----------------------------------------------------------------------*/
	socialGap.Facebook_PerformLogon = function (onSuccess, onFailure) {
		if(!socialGap.isFunction(onSuccess) || !socialGap.isFunction(onFailure))
		{
			socialGap.logMsg(extensionName, "Illegal arguments. Call back functions are not defined.");
			return;
		}
		
		if(!socialGap.deviceReady)
		{
			socialGap.logMsg(extensionName, "Device is not ready.");
			return;
		}

		//If ExtendedToken is available just use it
		getStoredExtendedToken(function(isValidToken){
			if(!isValidToken)
			{
				socialGap.logMsg(extensionName, "Token not found in local storage or found invalid token. Requesting a new token.");
				localStorage.removeItem(LS_TOKEN_KEY);
				socialGap.CurrentFBToken = "";
			  	getNewExtendedToken(onSuccess, onFailure);
			}else
			{
				socialGap.logMsg(extensionName, "Valid token found in local storage.");
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
			var shortLivedToken = socialGap.extractInfoFromQueryString(event.url, queryStringTokenKey);
			if(shortLivedToken != null)
			{
				socialGap.logMsg(extensionName, "Received short-lived token. Checking validity...");
				ref.close();
				checkAndExtendToken(shortLivedToken);
			}
			else processing = false;	
		});

		ref.addEventListener("loadstop", function (event) {
			socialGap.getJsonContents(event.url, function(jsonObj){
				if(jsonObj != null)
				{
					socialGap.logMsg(extensionName, "Exception during logon: " + jsonObj.error.message);
					processing = false;
					ref.close();
					}else
			 		//Extra steps required
					processing = true;
				});
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
		if(!processing && socialGap.CurrentFBToken.length <= 0
			|| processing && !authorized && socialGap.CurrentLinkedInToken.length <= 0)
		{
			onFailure();
			return;
		}

		if(socialGap.CurrentFBToken.length > 0)
		{
			socialGap.logMsg(extensionName, "Authentication Succeeded. Returning token.");
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
		authorized = true;
		socialGap.checkToken(baseCheckUrl + shortLivedToken, function(isValidToken){
			if(isValidToken)
			{
				socialGap.logMsg(extensionName, "Retrieved token is valid. Extending...");
				extendToken(shortLivedToken);
			}
			else{ 
				socialGap.logMsg(extensionName, "Retrieved token is invalid.");
				processing = false;
			}
		});		
	}

	/** Transforms a short-lived token in a long-lived one. */
	/* TODO: optimize this function using only 1 ajax call instead of 2. */
	function extendToken(shortLivedToken)
	{
		processing = true;
		
		var apiUrl = facebook_graph + "/oauth/access_token?grant_type=fb_exchange_token&client_id="+ settings.appID +"&client_secret=" + 
						settings.appSecret + "&fb_exchange_token=" + shortLivedToken;
						
		var tokenExtractionFunction = function(stringContainingToken){
			return socialGap.extractInfoFromQueryString(stringContainingToken, queryStringTokenKey);	
		};
				
		socialGap.transformToken("GET", apiUrl, tokenExtractionFunction, function(longLivedToken){
			if(longLivedToken != null)
			{
				socialGap.checkToken(baseCheckUrl + longLivedToken, function(isValidToken){
					if(isValidToken)
					{
						socialGap.logMsg(extensionName, "Extended token received and valid. Storing token...");
						socialGap.CurrentFBToken = longLivedToken;
						socialGap.storeToken(LS_TOKEN_KEY, longLivedToken);
					}else
						socialGap.logMsg(extensionName, "Extended token received but it is invalid. Aborting...");
					processing = false;
				});
			} else {
				socialGap.logMsg(extensionName, "No extended token received. Aborting...");
				processing = false;
			}
		});		
	}
	
	/** Utility - get the stored long-lived token if any and check its validity */
	function getStoredExtendedToken(callback)
	{
		socialGap.getStoredToken(LS_TOKEN_KEY, function(token){
			if(token != null)
			{
				socialGap.CurrentFBToken = token;
				socialGap.checkToken(baseCheckUrl + token, callback);
			}else callback(false);
		});		
	}

	return socialGap;


}(SocialGap || {}));