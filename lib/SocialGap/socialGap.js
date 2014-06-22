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
 *********************************************************************************/


var SocialGap = (function (socialGap) {

	/*-----------------------------------------------------------------------
	/* Private fields
	/*----------------------------------------------------------------------*/
	var logging = true;
		
	/*-----------------------------------------------------------------------
	/* Public fields
	/*----------------------------------------------------------------------*/
    socialGap.version = "01";
	socialGap.deviceReady = false;

	
	/*-----------------------------------------------------------------------
	/* Common utilities
	/*----------------------------------------------------------------------*/
	socialGap.getStoredToken = function(tokenKey, callback)
	{
		if (typeof(Modernizr) != "undefined" && Modernizr.localstorage) {
			// window.localStorage is available!
		  	var token = localStorage.getItem(tokenKey);
			callback(token);
		} else {
		  // no native support for HTML5 storage :(
		  //TODO: maybe try dojox.storage or a third-party solution
		  callback(null);
		}
	};

	socialGap.storeToken = function(tokenKey, token)
	{
		if (typeof(Modernizr) != "undefined" && Modernizr.localstorage) {
			localStorage.setItem(tokenKey, token);
		}
	};

	socialGap.isFunction = function(functionToCheck) 
	{
		var getType = {};
		return functionToCheck && getType.toString.call(functionToCheck) == "[object Function]";
	};
	
	socialGap.checkToken = function(urlWithToken, callback)
	{
		var xhr = new XMLHttpRequest();
		xhr.open("GET", urlWithToken, true);
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
	
	socialGap.logMsg = function(extensionName, msgToLog)
	{
		if(!logging)
			return;
		var d = new Date();		
		console.log("["+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+"][SocialGap - "+extensionName+"] " + msgToLog);
	};

	socialGap.extractInfoFromQueryString = function(tokenStr, elementName)
	{
		var tokenArr = tokenStr.split(elementName + "=");
		if (tokenArr.length > 1)
		{
			if(tokenArr[1].indexOf('&') > 0)
				return tokenArr[1].split("&")[0];
			else return tokenArr[1];
		}else return null;
	}
	
	socialGap.transformToken = function(httpMethod, apiUrl, tokenExtractionFunction, callback)
	{
		var xhr = new XMLHttpRequest();
		xhr.open(httpMethod, apiUrl, true);

		xhr.onreadystatechange = function() {
			if (xhr.readyState==4)
			{
				if(xhr.status!=200)
				{
					callback(null);
					return;
				}
					
				callback(tokenExtractionFunction(xhr.responseText));
			}
		};
		xhr.send();				
	}
	
	socialGap.getJsonContents = function(url, callback)
	{
		socialGap.logMsg(extensionName, "Checking if we have received an error...");
		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState==4)
			{
				socialGap.logMsg(extensionName, "Received: " + xhr.responseText);
				try {
					var obj = JSON.parse(xhr.responseText);
					callback(obj);
					return;
				}catch (e) { }
				callback(null);
			}
		};
		xhr.send();
	}
	

	return socialGap;

}(SocialGap || {}));