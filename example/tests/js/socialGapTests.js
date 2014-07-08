QUnit.test( "SocialGap exists", function( assert ) {
  var getType = {};
  assert.ok( SocialGap && getType.toString.call(SocialGap) == "[object Object]", "SocialGap object exists!" );
});

QUnit.test( "SocialGap is ready", function( assert ) {
  assert.ok( SocialGap.deviceReady, "Device is ready." );
});

QUnit.test( "SocialGap.getStoredToken - Positive", function( assert ) {
  var passed = false;
  var key = "realToken";
  var value = "GdygsuaygUYUGSAUYGDgaysdgasdyuGUYDSGUA";
  localStorage.setItem(key, value);

  QUnit.stop();
  SocialGap.getStoredToken(key, function(obj){
	  passed = (obj != null && obj == value);
	  assert.ok( passed, "Getting a value from the localStorage works." );
	  QUnit.start();
  });

  localStorage.removeItem(key);
});

QUnit.test( "SocialGap.getStoredToken - Negative", function( assert ) {
  var passed = false;

  QUnit.stop();
  SocialGap.getStoredToken("phonyToken", function(obj){
    passed = obj == null;
    assert.ok( passed, "When a fake key is passed as a parameter the function returns null." );
    QUnit.start();
 });
});

QUnit.test( "SocialGap.storeToken - Positive", function( assert ) {
  var passed = false;
  var key = "realToken";
  var value = "GdygsuaygUYUGSAUYGDgaysdgasdyuGUYDSGUA";
  
  SocialGap.storeToken(key, value);
  var item = localStorage.getItem(key);

  QUnit.stop();
  SocialGap.getStoredToken(key, function(obj){
    passed = (item != null && item == value);
    QUnit.start();
    assert.ok( passed, "Getting a value from the localStorage works." );
  });

  localStorage.removeItem(key);
});

QUnit.test( "SocialGap.isFunction", function( assert ) {
  var test = "";
  var test0 = 213;
  var test1 = null;
  var test2 = [];
  var test3 = {};
  var test4 = function(){};
	
  assert.ok( !SocialGap.isFunction(test), "String is not a function" );
  assert.ok( !SocialGap.isFunction(test0), "Integer is not a function" );
  assert.ok( !SocialGap.isFunction(test1), "Null is not a function" );
  assert.ok( !SocialGap.isFunction(test2), "Array is not a function" );
  assert.ok( !SocialGap.isFunction(test3), "Object is not a function" );
  assert.ok( SocialGap.isFunction(test4), "Only function is a function" );
});

QUnit.test( "SocialGap.checkToken - Positive", function( assert ) {
  var passed = false;

  QUnit.stop();
  SocialGap.checkToken("https://graph.facebook.com/oauth", function(valid){
	passed = valid;
    QUnit.start();
    assert.ok( passed, "Valid when GET does return HTTP 200" );
  });
});


QUnit.test( "SocialGap.checkToken - Negative", function( assert ) {
  var passed = false;

  QUnit.stop();
  SocialGap.checkToken("https://graph.facebook.com", function(valid){
	passed = !valid;
    QUnit.start();
    assert.ok( passed, "Invalid when GET does not return HTTP 200" );
  });
});

QUnit.test( "SocialGap.extractInfoFromQueryString - Positive", function( assert ) {
  var resTest1 = "niceTokenValue";
  var keyTest1 = "token";
  var resTest2 = "niceTokenValue2";
  var keyTest2 = "token2";
  var resTest3 = "niceTokenValue3";
  var keyTest3 = "token3";

  var testQueryString = keyTest1+'='+resTest1+'&'+keyTest2+'='+resTest2+'&'+keyTest3+'='+resTest3;

  var test1 = SocialGap.extractInfoFromQueryString(testQueryString, keyTest1);
  var test2 = SocialGap.extractInfoFromQueryString(testQueryString, keyTest2);
  var test3 = SocialGap.extractInfoFromQueryString(testQueryString, keyTest3);
  assert.ok( test1 = resTest1, "Found at the beginning." );
  assert.ok( test2 = resTest2, "Found in the middle." );
  assert.ok( test3 = resTest3, "Found at the end." );
});

QUnit.test( "SocialGap.extractInfoFromQueryString - Negative", function( assert ) {
  var testQueryString = 'a=dhusahd&auhsuha=aaaa&sas=saassa';
  var keyTest = "isnotthere";
  var test = SocialGap.extractInfoFromQueryString(testQueryString, keyTest);
  assert.ok( test == null, "If not found returns null." );
});

QUnit.test( "SocialGap.transformToken - Positive", function( assert ) {
  var passed = false;
  var method = 'GET';
  var apiUrl = 'https://graph.facebook.com/oauth';
  var extFunction = function(content){
	if(content != null)
		return true;
	else return false;
  };
  var callback = function(passed){
	QUnit.start();
    assert.ok( passed, "Token transformed when return code is HTTP 200 and returned contents are not null." );
  };

  QUnit.stop();
  SocialGap.transformToken(method, apiUrl, extFunction, callback);
});

QUnit.test( "SocialGap.transformToken - Negative", function( assert ) {
  var passed = false;
  var method = 'GET';
  var apiUrl = 'https://graph.facebook.com/';
  var extFunction = function(content){
	/* Not called */
  };
  var callback = function(passed){
	QUnit.start();
    assert.ok( passed == null, "When response is not HTTP 200 it returns null." );
  };

  QUnit.stop();
  SocialGap.transformToken(method, apiUrl, extFunction, callback);
});

QUnit.test( "socialGap.getJsonContents - Positive", function( assert ) {
  var passed = false;

  QUnit.stop();
  SocialGap.getJsonContents("https://graph.facebook.com/oauth", function(jsonObj){
    QUnit.start();
    assert.ok( jsonObj != null, "Returns the JSon object..." );
    assert.ok( jsonObj.id != null, "... with all its contents." );
  });
});

QUnit.test( "socialGap.getJsonContents - Positive", function( assert ) {
  var passed = false;

  QUnit.stop();
  SocialGap.getJsonContents("https://graph.facebook.com", function(jsonObj){
    QUnit.start();
    assert.ok( jsonObj != null, "Also in case of HTTP return code != 200 the JSon object is parsed..." );
    assert.ok( jsonObj.error != null, "... with all its contents." );
  });
});


QUnit.test( "socialGap.getJsonContents - Negative", function( assert ) {
  var passed = false;

  QUnit.stop();
  SocialGap.getJsonContents("", function(jsonObj){
    QUnit.start();
    assert.ok( jsonObj == null, "In case of non valid json resource returns null." );
  });
});
