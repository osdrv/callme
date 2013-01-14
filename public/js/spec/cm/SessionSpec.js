describe( "CM.Session", function() {
  describe( "initialize", function() {
    
    it( "Should fail without ssid", function() {
      expect( function() {
        var session = new CM.Session();
      } ).toThrow();
    } );
    
    it( "Should not fail with ssid but without params", function() {
      expect( function() {
        var session = new CM.Session( "Test session ID" );
      } ).not.toThrow();
    } );
    
  } );
} );