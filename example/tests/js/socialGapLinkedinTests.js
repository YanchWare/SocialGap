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

QUnit.test( "socialGap.Linkedin_PerformLogon - Negative - Invalid callbacks", function( assert ) {
  SocialGap.Linkedin_PerformLogon();
  assert.ok( SocialGap.CurrentLinkedInToken == '', "Logon not possible if callbacks are not defined" );

  SocialGap.Linkedin_PerformLogon(function(){});
  assert.ok( SocialGap.CurrentLinkedInToken == '', "Logon not possible if BOTH callbacks are not defined" );
});
