var originalWebSocket,
    originalRTCPeerConnection,
    originalRTCSessionDescription,
    originalRTCIceCandidate,
    originalLocalMediaStream,
    originalGetUserMedia;

var TEST_SDP = "v=0\
↵o=- 195268782 2 IN IP4 127.0.0.1\
↵s=-\
↵t=0 0\
↵a=group:BUNDLE audio video\
↵m=audio 1 RTP/SAVPF 111 103 104 0 8 126\
↵c=IN IP4 0.0.0.0\
↵a=rtcp:1 IN IP4 0.0.0.0\
↵a=ice-ufrag:jn/zQ5EGo8SFVsKF\
↵a=ice-pwd:kX60BruHzMUGUFyR4zxSlOcL\
↵a=ice-options:google-ice\
↵a=sendrecv\
↵a=mid:audio\
↵a=rtcp-mux\
↵a=crypto:1 AES_CM_128_HMAC_SHA1_80 inline:OYyWgzuAzX7NkwIIfbcJryhoYjHXOedu8mR9M15T\
↵a=rtpmap:103 ISAC/16000\
↵a=rtpmap:104 ISAC/32000\
↵a=rtpmap:111 opus/48000\
↵a=rtpmap:0 PCMU/8000\
↵a=rtpmap:8 PCMA/8000\
↵a=rtpmap:126 telephone-event/8000\
↵a=ssrc:2548604052 cname:xxTpcv2SXLVKzGnJ\
↵a=ssrc:2548604052 msid:GFeE8yqAgHuHsdVQoR2Thy7jX4yz555lIATS a0\
↵a=ssrc:2548604052 mslabel:GFeE8yqAgHuHsdVQoR2Thy7jX4yz555lIATS\
↵a=ssrc:2548604052 label:GFeE8yqAgHuHsdVQoR2Thy7jX4yz555lIATSa0\
↵m=video 1 RTP/SAVPF 100 101 102\
↵c=IN IP4 0.0.0.0\
↵a=rtcp:1 IN IP4 0.0.0.0\
↵a=ice-ufrag:jn/zQ5EGo8SFVsKF\
↵a=ice-pwd:kX60BruHzMUGUFyR4zxSlOcL\
↵a=ice-options:google-ice\
↵a=sendrecv\
↵a=mid:video\
↵a=rtcp-mux\
↵a=crypto:1 AES_CM_128_HMAC_SHA1_80 inline:OYyWgzuAzX7NkwIIfbcJryhoYjHXOedu8mR9M15T\
↵a=rtpmap:100 VP8/90000\
↵a=rtpmap:101 red/90000\
↵a=rtpmap:102 ulpfec/90000\
↵a=ssrc:335629684 cname:xxTpcv2SXLVKzGnJ\
↵a=ssrc:335629684 msid:GFeE8yqAgHuHsdVQoR2Thy7jX4yz555lIATS v0\
↵a=ssrc:335629684 mslabel:GFeE8yqAgHuHsdVQoR2Thy7jX4yz555lIATS\
↵a=ssrc:335629684 label:GFeE8yqAgHuHsdVQoR2Thy7jX4yz555lIATSv0\
↵"


beforeEach( function() {
  // WebSocket STUB
  originalWebSocket = window.WebSocket;
  window.WebSocket = new Class({
    Implements: [ Events, Options ],
    initialize: function( options ) {
      var self = this;
      this.setOptions( options );
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
    },
    message: function( message ) {
      if ( CM.isFunc( this.onmessage ) ) {
        this.onmessage( message );
      }
    },
    send: function( message ) {
      
    }
  });
  // END OF WebSocket STUB

  // RTCPeerConnection STUB
  originalRTCPeerConnection = window.RTCPeerConnection;
  window.RTCPeerConnection = new Class({

    Implements: [ Options ],

    initialize: function( options ) {
      var self = this;
      this.setOptions( options );
      window.setTimeout( function() {
        self.connecting();
      }, 1 );
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
    },

    icecandidate: function( candidate ) {
      if ( CM.isFunc( this.onicecandidate ) ) {
        this.onicecandidate( candidate );
      }
    },

    connecting: function() {
      if ( CM.isFunc( this.onconnecting ) ) {
        this.onconnecting();
      }
    },

    addStream: function( stream ) {
      if ( CM.isFunc( this.onaddstream ) ) {
        this.onaddstream();
      }
    },

    removestream: function() {
      if ( CM.isFunc( this.onremovestream ) ) {
        this.onremovestream();
      }
    },

    createOffer: function( callback, errback, options ) {
      callback({
        sdp: TEST_SDP
      });
    },

    createAnswer: function( callback, errback, options ) {
      callback({
        sdp: TEST_SDP
      });
    },

    setLocalDescription: function( description ) {

    },

    setRemoteDescription: function( description ) {

    }

  });
  // END OF RTCPeerConnection STUB

  // RTCSessionDescription STUB
  originalRTCSessionDescription = window.RTCSessionDescription;
  
  window.RTCSessionDescription = new Class({
    initialize: function( session ) {
      this.session = session;
      this.sdp = "";
    }
  });
  // END OF RTCSessionDescription STUB

  // RTCIceCandidate STUB
  originalRTCIceCandidate = window.RTCIceCandidate;
  window.RTCIceCandidate = new Class({
    Implements: [ Options ],
    initialize: function( options ) {
      this.setOptions( options );
      this.sdpMLineIndex = "";
      this.sdpMid = "";
      this.candidate = {};
    }
  });
  // END OF RTCIceCandidate STUB


  // LocalMediaStream STUB
  originalLocalMediaStream = window.LocalMediaStream;
  window.LocalMediaStream = new Class({
    Implements: [ Options ],

    initialize: function( options ) {
      this.setOptions( options );
      this.length = 1;
      if ( !CM.isEmpty( this.options.video )&&
        this.options.video ) {
        this.videoTracks = [];
      }
      if ( !CM.isEmpty( this.options.audio )&&
        this.options.audio ) {
        this.audioTracks = [];
      }
      this.label = "LFcWP25PUaFacWnEuPpxqtE07PjU3u3pqeef";
      this.readyState = 1;
    }
  });
  // END OF LocalMediaStream STUB


  // Set to false to reject getUserMedia dialog
  var GET_USER_MEDIA_CONFIRM = true;
  originalGetUserMedia = CM.getUserMedia;
  navigator.getUserMedia = function( options, callback, errback ) {
    window.setTimeout( function() {
      if ( GET_USER_MEDIA_CONFIRM ) {
        if ( CM.isFunc( callback ) ) {
          callback.call( self, new LocalMediaStream( options ) );
        }
      } else {
        if ( CM.isFunc( errback ) ) {
          errback.call( self );
        }
      }
    }, 10 );
  };

} );

afterEach( function() {
  window.WebSocket = originalWebSocket;
  window.RTCPeerConnection = originalRTCPeerConnection;
  window.RTCSessionDescription = originalRTCSessionDescription;
  window.RTCIceCandidate = originalRTCIceCandidate;
  window.LocalMediaStream = originalLocalMediaStream;
  navigator.getUserMedia = originalGetUserMedia;
} );