describe( "CM.Session", function() {

  var SSID = "Test session ID";

  describe( "initialize", function() {

    it( "Should fail without ssid", function() {
      expect( function() {
        var session = new CM.Session();
      } ).toThrow();
    } );

    it( "Should not fail with ssid but without params", function() {
      expect( function() {
        var session = new CM.Session( SSID );
      } ).not.toThrow();
    } );

  } );

  describe( "connect", function() {

    var session;

    beforeEach( function() {
      session = new CM.Session( SSID );
    } );

    it( "Should be defined", function() {
      expect( session.connect ).toBeDefined();
    } );

    it( "Should create connection", function() {
      var flag = false;
      expect( session.isConnected() ).toBeFalsy();
      
      runs( function() {
        session.connect( function() {
          flag = true;
        } );
      } );
      
      waitsFor( function() {
        return flag;
      }, "Should change flag", 50 );

      runs( function() {
        expect( session.isConnected() ).toBeTruthy();
      } );
      
    } );

  } );

  describe( "destroy", function() {

    var session;

    beforeEach( function() {
      session = new CM.Session( SSID );
    } );

    it( "Should be defined", function() {
      expect( session.destroy ).toBeDefined();
    } );

    it( "Should set transport to null", function() {
      expect( session.transport ).not.toBeNull();
      session.destroy();
      expect( session.transport ).toBeNull();
    } );

  } );

  describe( "offerTo", function() {
    
    var session;

    beforeEach( function() {
      session = new CM.Session( SSID );
    } );

    it( "Should be defined", function() {
      expect( session.offerTo ).toBeDefined();
    } );
  } );

  describe( "offerCandidate", function() {

    var session;

    beforeEach( function() {
      session = new CM.Session( SSID );
    } );

    it( "Should be defined", function() {
      expect( session.offerCandidate ).toBeDefined();
    } );

    it( "Should send message via transport", function() {
      var flag = false,
          val = null,
          ssid = null;
      session.transport.send = function( data ) {
        flag = true;
        ssid = data.uuid;
        val = data.candidate.a;
      }
      session.offerCandidate( { a: "b" } );
      expect( flag ).toBeTruthy();
      expect( val ).toBe( "b" );
      expect( ssid ).toBe( SSID );
    } );
  } );

  describe( "getLocalStream", function() {
    
    var session;

    beforeEach( function() {
      session = new CM.Session( SSID );
    } );

    it( "Should be defined", function() {
      expect( session.getLocalStream ).toBeDefined();
    } );

    it( "Should return local stream instance if user approved getUserMedia dialog", function() {
      runs( function() {
        
      } );
    } );
  } );

} );