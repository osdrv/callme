describe( "CM.User", function() {
  var userdata = {
    name: "Test User"
  },
  user;
  
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
        user.createSession( "Test session ID" );
      } ).not.toThrow();
    } );
  } );
} );