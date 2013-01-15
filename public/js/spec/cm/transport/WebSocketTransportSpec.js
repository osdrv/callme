describe( "CM.Transport.WebSocketTransport", function() {
  
  var transportOptions = {
    host: 'testhost',
    port: '12345',
    protocols: [ 'soap', 'xmpp' ],
    url: '/echoServer'
  }
  
  var transport,
      originalWebSocket;
  
  beforeEach( function() {
    
    // WebSocket STUB
    originalWebSocket = window.WebSocket;
    window.WebSocket = new Class({
      Implements: [ Events ],
      initialize: function( options ) {
        var self = this;
        window.setTimeout( function() {
          self.open();
        }, 10 );
      },
      open: function() {
        if ( CM.isFunc( this.onopen ) ) {
          this.onopen();
        }
      },
      close: function() {
        if ( CM.isFunc( this.onclose ) ) {
          this.onclose();
        }
      }
    });
    // END OF WebSocket STUB
    
    transport = new CM.Transport.WebSocketTransport(
      transportOptions
    );
  } );

  afterEach( function() {
    window.WebSocket = originalWebSocket;
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

    it( "Should create new socket instance", function() {
      expect( transport.socket ).toBeNull();
      transport.connect();
      expect( transport.socket ).not.toBeNull();
    } );

    it( "Should trigger 'connection.open.ok' on connect", function() {
      
      var flag = false;
      
      transport.on( 'connection.open.ok', function() {
        flag = true;
      } );

      runs( function() {
        transport.connect();
      } );

      waitsFor(
        function() {
          return flag
        },
        "Flag should be set to true",
        50
      );

      runs( function() {
        expect( flag ).toBeTruthy();
      } );
      
    } );

    it( "Should call callback function", function() {
      var flag = false;
      runs( function() {
        transport.connect( function() {
          flag = true;
        } );
      } );

      waitsFor(
        function() {
          return flag
        },
        "Flag should be set to true",
        50
      );

      runs( function() {
        expect( flag ).toBeTruthy();
      } );
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
      transport.on( 'connection.close.ok', function() {
        flag = true;
      } );
      // transport.socket = socket;
      transport.connect();
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