var LS_TOKEN_KEY = "SocialGap_LinkedIn_Token";

/* Set this correctly to perform the unit tests*/
var apiKey = '';
var secretKey = '';
var appDomain = '';
var scopes = '';

QUnit.test( "SocialGap exists", function( assert ) {
  var getType = {};
  assert.ok( SocialGap && getType.toString.call(SocialGap) == "[object Object]", "SocialGap object exists!" );
});

QUnit.test( "SocialGap Linkedin extension loading", function( assert ) {
  var getType = {};
  assert.ok( typeof SocialGap.CurrentLinkedInToken !== 'undefined', "SocialGap LinkedIn extension loaded correctly" );
  assert.ok( SocialGap.deviceReady, "Device is ready." );
});

QUnit.test( "socialGap.Linkedin_PerformLogon - Positive", function( assert ) {
  SocialGap.Linkedin_ChangeSettings(apiKey, secretKey, appDomain, scopes);

  var successCallback = function(token){
	var storageToken = localStorage.getItem(LS_TOKEN_KEY);
	var ldToken = SocialGap.CurrentLinkedInToken;
	assert.ok(typeof token !== 'undefined' && token.length > 0 && storageToken === token && token === ldToken, 'A token is returned to the caller through the success callback.');
    localStorage.removeItem(LS_TOKEN_KEY);
	SocialGap.CurrentLinkedInToken = '';
	QUnit.start();
  };

  var failureCallback = function(){
	assert.ok(false,'The failure callback should not be called at this moment.');
    localStorage.removeItem(LS_TOKEN_KEY);
	SocialGap.CurrentLinkedInToken = '';
	QUnit.start();
  };

  QUnit.stop();
  SocialGap.Linkedin_PerformLogon(successCallback, failureCallback);
});

QUnit.test( "socialGap.Linkedin_PerformLogon - Positive - Valid token stored and invalid settings", function( assert ) {
  var failureCallback = function(){
	assert.ok(false,'The failure callback should not be called at this moment.');
    localStorage.removeItem(LS_TOKEN_KEY);
	SocialGap.CurrentLinkedInToken = '';
	QUnit.start();
  };

  SocialGap.Linkedin_ChangeSettings(apiKey, secretKey, appDomain, scopes);

  QUnit.stop();
  //Perform a correct logon in order to store a valid token
  SocialGap.Linkedin_PerformLogon(function(){
	var tokenFromStorage = localStorage.getItem(LS_TOKEN_KEY);
	assert.ok(tokenFromStorage != null, 'A real token has been stored correctly.');
	QUnit.start();


	//Destroy state in order to check that is the stored token that get used.
	SocialGap.Linkedin_ChangeSettings('', '', '', '');
	
	  QUnit.stop();

	  var successCallback = function(token){
		var ldToken = SocialGap.CurrentLinkedInToken;
		assert.ok(typeof token !== 'undefined' && token != null && token === tokenFromStorage && token === ldToken);
	    localStorage.removeItem(LS_TOKEN_KEY);
		SocialGap.CurrentLinkedInToken = '';
		QUnit.start();
	  };

	  SocialGap.Linkedin_PerformLogon(successCallback, failureCallback);
	
  }, failureCallback);
  
});

QUnit.test( "socialGap.Linkedin_PerformLogon - Positive - Invalid token stored and valid settings", function( assert ) {
  var value = "GdygsuaygUYUGSAUYGDgaysdgasdyuGUYDSGUA";

  //Setting fake token. This should fail since is not a valid token.
  localStorage.setItem(LS_TOKEN_KEY, value);
  SocialGap.Linkedin_ChangeSettings(apiKey, secretKey, appDomain, scopes);

  var successCallback = function(){
	assert.ok(true, 'The success callback has been called as expected.')
	assert.ok(SocialGap.CurrentLinkedInToken.length > 0, 'Valid token is available.')
    localStorage.removeItem(LS_TOKEN_KEY);
	SocialGap.CurrentLinkedInToken = '';
	QUnit.start();
  };

  var failureCallback = function(){
	assert.ok(false,'The failure callback should not be called at this moment.');
    localStorage.removeItem(LS_TOKEN_KEY);
	SocialGap.CurrentLinkedInToken = '';
	QUnit.start();
  };

  QUnit.stop();
  SocialGap.Linkedin_PerformLogon(successCallback, failureCallback);

});

QUnit.test( "socialGap.Linkedin_PerformLogon - Negative - Invalid callbacks", function( assert ) {
  SocialGap.Linkedin_PerformLogon();
  assert.ok( SocialGap.CurrentLinkedInToken == '', "Logon not possible if callbacks are not defined" );

  SocialGap.Linkedin_PerformLogon(function(){});
  assert.ok( SocialGap.CurrentLinkedInToken == '', "Logon not possible if BOTH callbacks are not defined" );
});

QUnit.test( "socialGap.Linkedin_PerformLogon - Negative - Invalid settings", function( assert ) {
  SocialGap.Linkedin_ChangeSettings('', '', '', '');

  var successCallback = function(){
	assert.ok(false,'The success callback should not be called at this moment.');
	QUnit.start();
  };

  var failureCallback = function(){
	assert.ok(true, 'The failure callback has been called as expected.')
	assert.ok(SocialGap.CurrentLinkedInToken == '', 'No token available.')
	QUnit.start();
  };

  QUnit.stop();
  SocialGap.Linkedin_PerformLogon(successCallback, failureCallback);

});

QUnit.test( "socialGap.Linkedin_PerformLogon - Negative - Invalid token stored and invalid settings", function( assert ) {
  var value = "GdygsuaygUYUGSAUYGDgaysdgasdyuGUYDSGUA";

  //Setting fake token. This should fail since is not a valid token.
  localStorage.setItem(LS_TOKEN_KEY, value);
  SocialGap.Linkedin_ChangeSettings('', '', '', '');

  var successCallback = function(){
	assert.ok(false,'The success callback should not be called at this moment.');
    localStorage.removeItem(LS_TOKEN_KEY);
	QUnit.start();
  };

  var failureCallback = function(){
	assert.ok(true, 'The failure callback has been called as expected.')
	assert.ok(SocialGap.CurrentLinkedInToken == '', 'No token available.')
    localStorage.removeItem(LS_TOKEN_KEY);
	QUnit.start();
  };

  QUnit.stop();
  SocialGap.Linkedin_PerformLogon(successCallback, failureCallback);

});