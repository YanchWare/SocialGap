var LS_TOKEN_KEY = "SocialGap_LinkedIn_Token";

QUnit.test( "SocialGap exists", function( assert ) {
  var getType = {};
  assert.ok( SocialGap && getType.toString.call(SocialGap) == "[object Object]", "SocialGap object exists!" );
});

QUnit.test( "SocialGap Linkedin extension loading", function( assert ) {
  var getType = {};
  assert.ok( typeof SocialGap.CurrentLinkedInToken !== 'undefined', "SocialGap LinkedIn extension loaded correctly" );
  assert.ok( SocialGap.deviceReady, "Device is ready." );
});
