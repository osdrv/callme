describe( "CM.User", function() {
  var userdata = {
        name: "Test User"
      },
      user,
      TEST_SSID = "Test session ID";
  
  beforeEach( function() {
    user = new CM.User( { userdata: userdata } );
  } );
  
  describe( "createSession", function() {
    
    it( "Should be defined", function() {
      expect( user.createSession ).toBeDefined();
    } );
    
  } );
  
  describe( "destroySession", function() {
    it( "Should be defined", function() {
      expect( user.destroySession ).toBeDefined();
    } );
  } );
  
  describe( "getSession", function() {
    it( "Should be defined", function() {
      expect( user.getSession ).toBeDefined();
    } );
  } );
  
  describe( "createSession", function() {
    it( "Should be defined", function() {
      expect( user.createSession ).toBeDefined();
    } );
    
    it( "Should create session instance", function() {
      expect( user.getSession() ).toBeNull();
      expect( function() {
        user.createSession( TEST_SSID );
      } ).not.toThrow();
    } );

    it( "Should call callback with context of session", function() {
      var context,
          flag = false;
      
      runs( function() {
        user.createSession( TEST_SSID, function() {
          flag = true;
          context = this;
        } );
      } );
      
      waitsFor( function() {
        return flag;
      }, 50 );

      runs( function() {
        expect( flag ).toBeTruthy();
        expect( context instanceof CM.Session ).toBeTruthy();
      } );
    } )
  } );

  describe( "callTo", function() {
    it( "Should be defined", function() {
      expect( user.callTo ).toBeDefined();
    } );
  } );

  describe( "startWebCam", function() {
    it( "Should be defined", function() {
      expect( user.startWebCam ).toBeDefined();
    } );
  } );

  describe( "stopWebCam", function() {
    it( "Should be defined", function() {
      expect( user.stopWebCam ).toBeDefined();
    } );
  } );
} );