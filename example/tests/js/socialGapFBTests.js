var LS_TOKEN_KEY = "SocialGap_Facebook_Token";

QUnit.test( "SocialGap exists", function( assert ) {
  var getType = {};
  assert.ok( SocialGap && getType.toString.call(SocialGap) == "[object Object]", "SocialGap object exists!" );
});

QUnit.test( "SocialGap FB extension loading", function( assert ) {
  var getType = {};
  assert.ok( typeof SocialGap.CurrentFBToken !== 'undefined', "SocialGap FB extension loaded correctly" );
  assert.ok( SocialGap.deviceReady, "Device is ready." );
});

QUnit.test( "socialGap.Facebook_PerformLogon - Negative - Invalid callbacks", function( assert ) {
  SocialGap.Facebook_PerformLogon();
  assert.ok( SocialGap.CurrentFBToken == '', "Logon not possible if callbacks are not defined" );

  SocialGap.Facebook_PerformLogon(function(){});
  assert.ok( SocialGap.CurrentFBToken == '', "Logon not possible if BOTH callbacks are not defined" );
});

QUnit.test( "socialGap.Facebook_PerformLogon - Negative - Invalid token stored", function( assert ) {
  var passed = false;
  var value = "GdygsuaygUYUGSAUYGDgaysdgasdyuGUYDSGUA";

  //Setting fake token. This should fail since is not a valid token.
  localStorage.setItem(LS_TOKEN_KEY, value);

  var successCallback = function(){
	assert.ok(false,'The success callback should not be called at this moment.');
	QUnit.start();
  };

  var failureCallback = function(){
	assert.ok(true, 'The failure callback has been called as expected.')
	QUnit.start();
  };

  QUnit.stop();
  SocialGap.Facebook_PerformLogon(successCallback, failureCallback);

  localStorage.removeItem(LS_TOKEN_KEY);
});
