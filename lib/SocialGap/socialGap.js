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

	return socialGap;

}(SocialGap || {}));