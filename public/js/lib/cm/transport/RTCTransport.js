;( function( W ) {

  var CM = W.CM = W.CM || {};

  CM.Transport = CM.Transport || {};

  CM.Transport.RTCTransport = new Class({

    Implements: [ CM.Transport.RTCInternals ],

    Extends: CM.Transport,

    options: {
      stun: {
        iceServers: [
          {
            url: "stun:stun.l.google.com:19302"
          }
        ]
      },
      mediaSettings: {
        mandatory: {
          OfferToReceiveAudio: true,
          OfferToReceiveVideo: true
        }
      }
    },

    initialize: function( options ) {
      this.parent( options );
      this.peerConnection = null;
      this.candidates = [];
    },

    connect: function( callback, errback ) {
      var self = this,
          localCallback = function() {
            try {
              var pc = new RTCPeerConnection(
                self.options.stun
              );
              pc.onopen = function() {
                var args = CM.argsToArr( arguments );
                self.bang( 'rtc.connection.open', args );
                if ( CM.isFunc( callback ) ) {
                  callback.apply( self, args );
                }
              }
              pc.onconnecting = function() {
                self.bang( 'rtc.connection.connecting', arguments );
              }
              pc.onicecandidate = function( event ) {
                if ( !CM.isEmpty( event.candidate ) ) {
                  // IMPLEMENT ME
                  self.bang( 'rtc.connection.icecandidate', arguments );
                  // END OF IMPLEMENT ME
                }
              }
              pc.onaddstream = function( stream ) {
                self.bang( 'rtc.connection.addstream', arguments );
              }
              pc.onremovestream = function() {
                self.bang( 'rtc.connection.removestream', arguments ); 
              }
              self.peerConnection = pc;
            } catch ( e ) {
              self.bang( 'rtc.error' );
              if ( CM.isFunc( errback ) ) {
                errback.call( self, e );
              }
            }
          };
      if ( !CM.isEmpty( this.peerConnection ) ) {
        this.disconnect( localCallback );
      } else {
        localCallback();
      }
    },

    disconnect: function( callback ) {
      try {
        if ( !CM.isEmpty( this.peerConnection ) ) {
          this.peerConnection.close();
          this.peerConnection = null;
        }
        if ( CM.isFunc( callback ) ) {
          callback();
        }
      } catch ( e ) {
        this.bang( 'rtc.close.error', e );
      }
    }

  });

} )( window );