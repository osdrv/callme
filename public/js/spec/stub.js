var originalWebSocket,
    originalRTCPeerConnection,
    originalRTCSessionDescription,
    originalRTCIceCandidate;

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

    addstream: function( stream ) {
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

    },

    createAnswer: function( callback, errback, options ) {

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
  originalRTCIceCandidate
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
} );

afterEach( function() {
  window.WebSocket = originalWebSocket;
  window.RTCPeerConnection = originalRTCPeerConnection;
  window.RTCSessionDescription = originalRTCSessionDescription;
  window.RTCIceCandidate = originalRTCIceCandidate;
} );