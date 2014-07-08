QUnit.test( "SocialGap exists", function( assert ) {
  var getType = {};
  assert.ok( SocialGap && getType.toString.call(SocialGap) == "[object Object]", "SocialGap object exists!" );
});

QUnit.test( "SocialGap FB extension loading", function( assert ) {
  var getType = {};
  assert.ok( typeof SocialGap.CurrentFBToken !== 'undefined', "SocialGap FB extension loaded correctly" );
});

QUnit.test( "Perform FB Logon - Negative", function( assert ) {

  SocialGap.Facebook_PerformLogon();
  assert.ok( SocialGap.CurrentFBToken == '', "Logon not possible if callbacks are not defined" );

});

