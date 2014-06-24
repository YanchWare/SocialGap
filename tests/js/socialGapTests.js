QUnit.test( "SocialGap exists", function( assert ) {
  var getType = {};
  assert.ok( SocialGap && getType.toString.call(SocialGap) == "[object Object]", "SocialGap object exists!" );
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

  localStorage.removeItem(value);
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

  localStorage.removeItem(value);
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

