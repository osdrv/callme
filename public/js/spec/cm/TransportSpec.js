describe( "CM.Transport", function() {
  
  var transport;
  
  beforeEach( function() {
    transport = new CM.Transport;
  } );
  
  describe( "connect", function() {
    
    it( "Should be defined", function() {
      expect( transport.connect ).toBeDefined();
    } );
    
  } );
  
  describe( "disconnect", function() {
    
    it( "Should be defined", function() {
      expect( transport.disconnect ).toBeDefined();
    } );
    
  } );
  
  describe( "isConnected", function() {
    
    it( "Should be defined", function() {
      expect( transport.isConnected ).toBeDefined();
    } );
    
    it( "Should return false on startup", function() {
      expect( transport.isConnected() ).toBeFalsy();
    } );
    
  } );
  
  describe( "send", function() {
    
    it( "Should be defined", function() {
      expect( transport.send ).toBeDefined();
    } );
    
  } );
  
  describe( "receive", function() {
    
    it( "Should be defined", function() {
      expect( transport.receive ).toBeDefined();
    } );
    
  } );
  
} );