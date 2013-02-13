describe( "CM.Transport.RTCTransport", function() {

  var transport;

  beforeEach( function() {
    transport = new CM.Transport.RTCTransport({
      offerCandidate: function() {}
    });
  } );

  describe( "connect", function() {

    it( "Should be defined", function() {
      expect( transport.connect ).toBeDefined();
    } );

    it( "Should create connection", function() {
      expect( transport.peerConnection ).toBeNull();
      transport.connect();
      expect( transport.peerConnection ).not.toBeNull();
    } );

    it( "Should call rtc.connection.connecting and rtc.connection.open handlers", function() {
      
      var i = "";
      
      transport.on( 'rtc.connection.connecting', function() {
        i += "connecting";
      } ).on( 'rtc.connection.open', function() {
        i += "connect";
      } );
      runs( function() {
        transport.connect();
      } );

      waitsFor( function() {
        return i == "connectingconnect";
      }, "Should increment counter", 50 );

      runs( function() {
        expect( i ).toBe( "connectingconnect" );
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
          transport.peerConnection.icecandidate({ candidate: {} });
        } );
      } );
      waitsFor( function() {
        return flag;
      }, "Should set flag to true", 50 );
      runs( function() {
        expect( flag ).toBeTruthy();
      } );
    } );

    it( "Should bind onaddstream", function() {
      var flag = false;
      transport.on( "rtc.connection.addstream", function() {
        flag = true;
      } );
      runs( function() {
        transport.connect( function() {
          transport.peerConnection.addStream({});
        } );
      } );
      waitsFor( function() {
        return flag;
      }, "Should set flag to true", 50 );
      runs( function() {
        expect( flag ).toBeTruthy();
      } );
    } );

    it( "Should bind onremovestream", function() {
      var flag = false;
      transport.on( "rtc.connection.removestream", function() {
        flag = true;
      } );
      runs( function() {
        transport.connect( function() {
          transport.peerConnection.removestream({});
        } );
      } );
      waitsFor( function() {
        return flag;
      }, "Should set flag to true", 50 );
      runs( function() {
        expect( flag ).toBeTruthy();
      } );
    } );

    it( "Should contains no candidates on init", function() {
      expect( transport.candidates ).toBeDefined();
      expect( transport.candidates ).not.toBeNull();
      expect( transport.candidates instanceof Array ).toBeTruthy();
      expect( transport.candidates.length ).toBe( 0 );
    } );
  } );

  describe( "scheduleOfferCandidate", function() {
    it( "Should be defined", function() {
      expect( transport.scheduleOfferCandidate ).toBeDefined();
    } );

    it( "Should add candidate in stack", function() {
      transport.scheduleOfferCandidate( {} );
      expect( transport.candidates.length ).toBe( 1 );
    } );
  } );

  describe( "offerCandidates", function() {
    it( "Should be defined", function() {
      expect( transport.offerCandidates ).toBeDefined();
    } );
  } );

  describe( "isInited", function() {
    it( "Should be defined", function() {
      expect( transport.isInited ).toBeDefined();
    } );

    it( "Should return false on init", function() {
      expect( transport.isInited() ).toBeFalsy();
    } );
  } );

  describe( "setInited", function() {
    it( "Should be defined", function() {
      expect( transport.setInited ).toBeDefined();
    } );

    it( "Should set _inited property", function() {
      expect( transport.isInited() ).toBeFalsy();
      transport.setInited( true );
      expect( transport.isInited() ).toBeTruthy();
    } );
  } );

  describe( "setLocalStream", function() {
    it( "Should be defined", function() {
      expect( transport.setLocalStream ).toBeDefined();
    } );
  } );

  describe( "offer", function() {
    it( "Should be defined", function() {
      expect( transport.offer ).toBeDefined();
    } );

    it( "Should ask session for local stream te be updated", function() {
      var SSID = "Test session ID",
          session = new CM.Session( SSID ),
          transport = new CM.Transport.RTCTransport( session ),
          flag = false;
      
      session.getLocalStream = function() {
        flag = true;
      }
      
      runs( function() {
        transport.offer();
      } );

      waitsFor( function() {
        return flag;
      }, 50 );
      
      runs( function() {
        expect( flag ).toBeTruthy();
      } );
      
    } );

    it( "Should call callback given", function() {
      var SSID = "Test session ID",
          session = new CM.Session( SSID ),
          transport = new CM.Transport.RTCTransport( session ),
          flag = false;
      
      session.getLocalStream = function( cb ) {
        cb.call( this );
      };

      runs( function() {
        transport.offer( function() {
          flag = true;
        } );
      } );
      
      waitsFor( function() {
        return flag;
      }, 50 );
      
      runs( function() {
        expect( flag ).toBeTruthy();
      } );
      
    } );
  } );

  describe( "answer", function() {
    
    it( "Should be defined", function() {
      expect( transport.answer ).toBeDefined();
    } );

    it( "Should call callback given", function() {
      var SSID = "Test session ID",
          remoteSessionID = "Test session ID#2",
          session = new CM.Session( SSID ),
          transport = new CM.Transport.RTCTransport( session ),
          flag = false;
      
      runs( function() {
        transport.answer( remoteSessionID, function() {
          flag = true;
        } );
      } );

      waitsFor( function() {
        return flag;
      }, 50 );

      runs( function() {
        expect( flag ).toBeTruthy();
      } );
      
    } );
  } );
} );