describe( "CM.Transport.WebSocketTransport", function() {
  
  // WebSocket STUB
  var WebSocket;
  // END OF WebSocket STUB
  
  var transportOptions = {
    host: 'testhost',
    port: '12345',
    protocols: [ 'soap', 'xmpp' ],
    url: '/echoServer'
  }
  
  var transport;
  
  beforeEach( function() {
    
    WebSocket = new Class({
      Implements: [ Events, Options ],
      initialize: function( options ) {

      }
    });
    
    transport = new CM.Transport.WebSocketTransport(
      transportOptions
    );
  } );
  
  describe( "getConnectionUrl", function() {
      
    it( "Should be defined", function() {
      expect( transport.getConnectionUrl ).toBeDefined();
    } );
    
    it( "Should return correct string", function() {
      var url = transport.getConnectionUrl();
      expect( url ).toBe( 'ws://testhost:12345/echoServer' );
    } );
    
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
    
    it( "Should call socket.close", function() {
      var socket = new WebSocket(),
          flag = false;
      socket.close = function() {
        flag = true;
      }
      transport.socket = socket;
      transport.disconnect();
      expect( transport.socket ).toBeNull();
      expect( flag ).toBeTruthy();
    } );
    
    it( "Should fire 'connection.close.ok' event if socket is not null", function() {
      var socket = new WebSocket(),
          flag = false;
      socket.close = function() {};
      transport.on( 'connection.close.ok', function() {
        flag = true;
      } );
      transport.socket = socket;
      transport.disconnect();
      expect( flag ).toBeTruthy();
    } );
    
    it( "Should not fire 'connection.close.ok' event if socket is null", function() {
      var flag = false;
      transport.on( 'connection.close.ok', function() {
        flag = true;
      } );
      transport.disconnect();
      expect( flag ).toBeFalsy();
    } );
    
  } );
  
} );