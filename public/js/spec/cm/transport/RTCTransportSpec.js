describe( "CM.Transport.RTCTransport", function() {
  
  describe( "connect", function() {

    var transport;

    beforeEach( function() {
      transport = new CM.Transport.RTCTransport();
    } );

    it( "Should be defined", function() {
      expect( transport.connect ).toBeDefined();
    } );

    it( "Should create connection", function() {
      expect( transport.peerConnection ).toBeNull();
      transport.connect();
      expect( transport.peerConnection ).not.toBeNull();
    } );

    it( "Should call rtc.connection.connecting and rtc.connection.open handlers", function() {
      
      var i = 0;
      
      transport.on( 'rtc.connection.connecting', function() {
        i += 1;
        console.log( 'connecting' )
      } ).on( 'rtc.connection.open', function() {
        i += 10;
        console.log( 'connect' )
      } );
      runs( function() {
        transport.connect();
      } );

      waitsFor( function() {
        return i == 11;
      }, "Should increment counter", 50 );

      runs( function() {
        expect( i ).toBe( 11 );
      } );
      
    } );

    it( "Should call callback on connection success", function() {
      var i = 0;
      runs( function() {
        transport.connect( function() {
          i += 1;
        } );
      } );

      waitsFor( function() {
        return i == 1;
      }, "Should increment i", 50 );

      runs( function() {
        expect( i ).toBe( 1 );
      } );
    } );

    it( "Should call errback if no RTCPeerConnection defined", function() {
      var rtcpc = window.RTCPeerConnection,
          flag = false;
      window.RTCPeerConnection = undefined;
      transport.connect( function() {}, function() {
        flag = true;
      });
      expect( flag ).toBeTruthy();
      window.RTCPeerConnection = rtcpc;
    } );

    it( "Should call rtc.error if no RTCPeerConnection defined", function() {
      var rtcpc = window.RTCPeerConnection,
          flag = false;
      window.RTCPeerConnection = undefined;
      transport.on( 'rtc.error', function() {
        flag = true;
      } );
      transport.connect();
      expect( flag ).toBeTruthy();
      window.RTCPeerConnection = rtcpc;
    } );

    it( "Should bind onicecandidate", function() {
      var flag = false;
      transport.on( "rtc.connection.icecandidate", function() {
        flag = true;
      } );
      runs( function() {
        transport.connect( function() {
          transport.peerConnection.icecandidate({});
        } );
      } );
      waitsFor( function() {
        return flag;
      }, "Should set flag to true", 50 );
      runs( function() {
        expect( flag ).toBeTruthy();
      } );
    } );    

    xit( "Should bind onicecandidate, onaddstream and onremovestream", function() {
      var i = 0;
      CM._w( "onicecandidate onaddstream onremovestream" ).each( function( event ) {
        transport.on( "rtc.connection." + event.replace( /^on/, ''), function() {
          console.log( event )
          i += 1;
        } );
      });
      runs( function() {
        transport.connect( function() {
          transport.peerConnection.icecandidate({});
          transport.peerConnection.addstream({});
          transport.peerConnection.removestream();
        } );
      } );
      waitsFor( function() {
        return i == 3;
      }, "Should increment counter", 50 );
      runs( function() {
        expect( i ).toBe( 3 );
      } );

    } );
  } );

} );