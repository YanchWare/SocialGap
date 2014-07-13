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
	/* Initialization
	/*----------------------------------------------------------------------*/
    document.addEventListener('deviceready', function(){
		socialGap.deviceReady=true;		
	}, false);

	
	/*-----------------------------------------------------------------------
	/* Common utilities
	/*----------------------------------------------------------------------*/
	
	/* Retrieve token from localStorage */
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
	
	/* Store token in local storage */
	socialGap.storeToken = function(tokenKey, token)
	{
		if (typeof(Modernizr) != "undefined" && Modernizr.localstorage) {
			localStorage.setItem(tokenKey, token);
		}
	};

	/* Check if the parameter in input is a function */
	socialGap.isFunction = function(functionToCheck) 
	{
		var getType = {};
		return functionToCheck && getType.toString.call(functionToCheck) == "[object Function]";
	};

	/* Performs a call to the social API and checks that the token used is valid */
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
		xhr.onerror = function(){
			callback(false);
		};
		xhr.send();
	}
	
	/* If logging is active it logs information to the console */
	socialGap.logMsg = function(extensionName, msgToLog)
	{
		if(!logging)
			return;
		var d = new Date();
		console.log("["+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+"][SocialGap - "+extensionName+"] " + msgToLog);
	};

	/* Extract required information from a query string */
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
	
	/* Transforms a token using the specified API call */
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
		xhr.onerror = function(){
			callback(null);
		};
		xhr.send();				
	}
	
	/* Get an object representing the data contained in the JSon string in input */
	socialGap.getJsonContents = function(url, callback)
	{
		socialGap.getContents(url, function(contents){
			if(contents == null)
			{
				callback(null);
				return;
			}
			
			try {
				var obj = JSON.parse(contents);
				callback(obj);
				return;
			}catch (e) { }

			callback(null);
		});
	}

	/* Get an object representing the data contained in the JSon string in input */
	socialGap.getContents = function(url, callback)
	{
		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState==4)
				callback(xhr.responseText);
		};

		xhr.onerror = function(){
			callback(null);
		};
		xhr.send();
	}
	

	return socialGap;

}(SocialGap || {}));