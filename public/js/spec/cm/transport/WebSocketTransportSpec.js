describe( "CM.Transport.WebSocketTransport", function() {

  var TEST_WS_MSG = "{\"object\":{ \
    \"fieldInt\": 123, \
    \"fieldFloat\": 1.5, \
    \"fieldBool\": false, \
    \"fieldNil\": null, \
    \"fieldString\": \"hello world!\", \
    \"fieldArray\": [1,2,3,4,5], \
    \"fieldObject\": {\"a\": \"b\", \"c\": \"d\"} \
  }}",
  TEST_OBJ = { a: 'b', c: 'd' };

  var transportOptions = {
    host: 'testhost',
    port: '12345',
    protocols: [ 'soap', 'xmpp' ],
    url: '/echoServer'
  }

  var transport;

  beforeEach( function() {
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

    it( "Should create new socket instance", function() {
      expect( transport.socket ).toBeNull();
      transport.connect();
      expect( transport.socket ).not.toBeNull();
    } );

    it( "Should trigger 'ws.open.ok' on connect", function() {

      var flag = false;

      transport.on( 'ws.open.ok', function() {
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

    it( "Should fire 'ws.close.ok' event if socket is not null", function() {
      var socket = new WebSocket(),
          flag = false;
      transport.on( 'ws.close.ok', function() {
        flag = true;
      } );
      // transport.socket = socket;
      transport.connect();
      transport.disconnect();
      expect( flag ).toBeTruthy();
    } );

    it( "Should not fire 'ws.close.ok' event if socket is null", function() {
      var flag = false;
      transport.on( 'ws.close.ok', function() {
        flag = true;
      } );
      transport.disconnect();
      expect( flag ).toBeFalsy();
    } );

  } );

  describe( "message", function() {

    it( "Should trigger 'ws.message' event", function() {
      var flag = false;
      transport.on( "ws.message", function( message ) {
        flag = true;
      } );
      runs( function() {
        transport.connect( function() {
          transport.socket.message( TEST_WS_MSG );
        } );
      } );

      waitsFor( function() {
        return flag;
      }, "Should change flag", 50 );

      runs( function() {
        expect( flag ).toBeTruthy();
      } );
    } );

    it( "Should parse JSON message", function() {
      var parsed_message, flag = false;
      transport.on( "ws.message", function( message ) {
        flag = true;
        parsed_message = message;
      } );
      runs( function() {
        transport.connect( function() {
          transport.socket.message( TEST_WS_MSG );
        } );
      } );

      waitsFor( function() {
        return flag;
      }, "Should change flag", 50 );

      runs( function() {
        expect( typeof( parsed_message ) ).not.toBe( "string" );
        expect( typeof( parsed_message ) ).toBe( "object" );
        expect( parsed_message.object ).toBeDefined();
        expect( parsed_message.object.fieldInt ).toBeDefined();
        expect( parsed_message.object.fieldInt ).toBe( 123 );
        expect( parsed_message.object.fieldFloat ).toBeDefined();
        expect( parsed_message.object.fieldFloat ).toBe( 1.5 );
        expect( parsed_message.object.fieldBool ).toBeDefined();
        expect( parsed_message.object.fieldBool ).toBe( false );
        expect( parsed_message.object.fieldNil ).toBeDefined();
        expect( parsed_message.object.fieldNil ).toBeNull();
        expect( parsed_message.object.fieldString ).toBeDefined();
        expect( parsed_message.object.fieldString ).toBe( 'hello world!' );
        expect( parsed_message.object.fieldArray ).toBeDefined();
        expect( parsed_message.object.fieldArray.length ).toBe( 5 );
        expect( parsed_message.object.fieldObject ).toBeDefined();
        expect( parsed_message.object.fieldObject.a ).toBeDefined();
        expect( parsed_message.object.fieldObject.a ).toBe( 'b' );
        expect( parsed_message.object.fieldObject.c ).toBeDefined();
        expect( parsed_message.object.fieldObject.c ).toBe( 'd' );
      } );
    } );

  } );

  describe( 'send', function() {

    it( "Should be defined", function() {
      expect( transport.send ).toBeDefined();
    } );

    it( "Should throw exceion if not connected yet", function() {
      expect( function() {
        transport.send( TEST_OBJ );
      } ).toThrow();
    } );

    it( "Should call socket.send", function() {
      var message = TEST_OBJ,
          flag = false;
      var socket = {
        send: function( msg ) {
          flag = true;
        }
      }
      transport.socket = socket;
      transport.is_connected = true;
      transport.send( message );
      expect( flag ).toBeTruthy();
    } );

    it( "Shoould encode message as JSON", function() {
      var message = TEST_OBJ,
          sendMessage;
      var socket = {
        send: function( msg ) {
          sendMessage = msg;
        }
      }
      transport.socket = socket;
      transport.is_connected = true;
      transport.send( message );
      expect( sendMessage ).toBe( JSON.encode( message ) );
    } );

  } );

} );