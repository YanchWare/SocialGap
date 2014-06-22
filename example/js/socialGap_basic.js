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
	/* Public fields
	/*----------------------------------------------------------------------*/
    socialGap.thisIsAPublicField = "public";

	/*-----------------------------------------------------------------------
	/* Private fields
	/*----------------------------------------------------------------------*/
	var privateField = "private";

	/*-----------------------------------------------------------------------
	/* Public functions
	/*----------------------------------------------------------------------*/
	socialGap.CallThis = function()
	{
		alert("Hello from a public function!");
		thisIsAPrivateFunction();
	}

	/*-----------------------------------------------------------------------
	/* Private functions
	/*----------------------------------------------------------------------*/
	function thisIsAPrivateFunction()
	{
		alert("...which does private stuff too...");
	}

	return socialGap;

}(SocialGap || {}));