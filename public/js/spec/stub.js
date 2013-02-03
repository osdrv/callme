var originalWebSocket,
    originalRTCPeerConnection,
    originalRTCSessionDescription,
    originalRTCIceCandidate,
    originalLocalMediaStream;

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
        sdp: "asd\nasdasd\nasdasd"
      });
    },

    createAnswer: function( callback, errback, options ) {
      callback({
        sdp: "asd\nasdasd\nasdasd"
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
} );

// Set to false to reject getUserMedia dialog
var GET_USER_MEDIA_CONFIRM = true;
navigator.getUserMedia = function( options, callback, errback ) {
  window.setTimeout( function() {
    if ( GET_USER_MEDIA_CONFIRM ) {
      callback.call( self, new LocalMediaStream( options ) );
    } else {
      errback.call( self );
    }
  }, 10 );
};

afterEach( function() {
  window.WebSocket = originalWebSocket;
  window.RTCPeerConnection = originalRTCPeerConnection;
  window.RTCSessionDescription = originalRTCSessionDescription;
  window.RTCIceCandidate = originalRTCIceCandidate;
} );