;( function( W ) {
  
  var CMCall = new Class({
    
    Implements: [ Events, Options ],
    
    options: {
      stun: { iceServers: [ { url: "stun:stun.l.google.com:19302" } ] },
      media_settings: {
        mandatory: {
          OfferToReceiveAudio: true, 
          OfferToReceiveVideo: true
        }
      }
    },
    
    initialize: function( sender, options ) {
      this.sender = sender;
      this.setOptions( options );
      this._bindICE();
    },
    
    restart: function() {
      this.close();
      this.connect();
    },
    
    close: function() {
      this.connection = null;
      this.candidates = [];
      this.is_inited = false;
      this.candidates = [];
    },
    
    connect: function() {
      var self = this;
      try {
        this.connection = new RTCPeerConnection( this.options.stun );
        _w( 'onicecandidate onconnecting onopen onaddstream onremovestream' ).each( function( event ) {
          ( function( event_kind ) {
            self.connection[ event_kind ] = function() {
              var args = Array.prototype.slice.call( arguments );
              args.unshift( "stun." + event_kind.replace( /^on/, '' ) );
              self.fireEvent.apply( self, args );
            }
          } )( event );
        } );
      } catch ( e ) {
        this.fireEvent( "stun.error", e );
      }
    },
    
    init: function( receiver ) {
      var self = this;
      if ( is_empty( this.connection ) )
        this.connect();
      this.sender.getStream( function( stream ) {
        self.connection.addStream( stream );
        self.connection.createOffer(
          function ( sess_descr ) {
            sess_descr.sdp = self._preferOpus( sess_descr.sdp );
            self.connection.setLocalDescription( sess_descr );
            self.sender.getTransport().send(
              self.sender.getSession(),
              receiver.getSession(),
              {
                action: 'remote.ack',
                session: sess_descr
              }
            );
          },
          null,
          self.options.media_settings
        );
      } );
    },
    
    answer: function( receiver, remote_session ) {
      var self = this;
      this.is_inited = true;
      if ( is_empty( this.connection ) )
        this.connect();
      
      this.sender.getStream( function( stream ) {
        self.connection.addStream( stream );
        self.connection.setRemoteDescription(
          new RTCSessionDescription( remote_session )
        );
        self.peer_connection.createAnswer(
          function ( sess_descr ) {
            sess_descr.sdp = self._preferOpus( sess_descr.sdp );
            self.peer_connection.setLocalDescription( sess_descr );
            self.session.answerTo( callee, sess_descr );
          },
          null,
          sef.options.mediaSettings
        );
        this.fireEvent( 'remote.offered', callee, remote_session );
      } );
    },
    
    reject: function( receiver ) {
      this.stop();
      this.receiver.getTransport.send(
        this.sender.getSession(),
        receiver.getSession(),
        {
          action: 'remote.cancel'
        }
      );
    },
    
    addCandidate: function( data ) {
      var candidate = new RTCIceCandidate( { sdpMLineIndex: data.label, candidate: data.candidate } );
      this.connection.addIceCandidate( candidate );
    },
    
    hangup: function() {
      this.resetConnection();
      this.fireEvent( 'hangup' );
    },
    
    _bindICE: function() {
      var self = this;
      this.addEvent( 'stun.icecandidate', function( event ) {
        if ( event.candidate ) {
          self._offerCandidate( {
            type: 'candidate',
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate
          } );
        }
      } );
    },
    
    _offerCandidate: function( candidate ) {
      this.candidates.push( candidate );
      if ( this.is_inited ) {
        this._offerCandidates();
      }
    },
    
    _offerCandidates: function() {
      var self = this;
      while( this.candidates.length ) {
        candidate = this.candidates.shift();
        this.session.offerCandidate( candidate );
      }
    },
    
    _preferOpus: function( sdp ) {
      var sdpLines = sdp.split( '\r\n' );
      // Search for m line.
      for ( var i = 0; i < sdpLines.length; i++ ) {
        if ( sdpLines[i].search( 'm=audio' ) !== -1 ) {
          var mLineIndex = i;
          break;
        } 
      }
      if ( mLineIndex === null )
        return sdp;
      // If Opus is available, set it as the default in m line.
      for ( var i = 0; i < sdpLines.length; i++ ) {
        if ( sdpLines[i].search( 'opus/48000' ) !== -1 ) {
          var opusPayload = this._extractSdp( sdpLines[ i ], /:(\d+) opus\/48000/i );
          if ( opusPayload ) {
            sdpLines[ mLineIndex ] = this._defaultCodec( sdpLines[ mLineIndex ], opusPayload );
          }
          break;
        }
      }

      // Remove CN in m line and sdp.
      sdpLines = this._removeCN( sdpLines, mLineIndex );

      sdp = sdpLines.join( '\r\n' );

      return sdp;
    },
    
    _extractSdp: function( sdpLine, pattern ) {
      var result = sdpLine.match( pattern );
      return ( result && result.length == 2 ) ? result[ 1 ]: null;
    },
    
    _defaultCodec: function( mLine, payload ) {
      var elements = mLine.split( ' ' ),
          newLine = new Array(),
          index = 0;
      for ( var i = 0; i < elements.length; i++ ) {
        if ( index === 3 ) // Format of media starts from the fourth.
          newLine[ index++ ] = payload; // Put target payload to the first.
        if ( elements[ i ] !== payload ) {
          newLine[ index++ ] = elements[ i ];
        }
      }
      
      return newLine.join( ' ' );
    },
    
    _removeCN: function(sdpLines, mLineIndex) {
      var mLineElements = sdpLines[mLineIndex].split(' ');
      // Scan from end for the convenience of removing an item.
      for ( var i = sdpLines.length - 1; i >= 0; i-- ) {
        var payload = this._extractSdp( sdpLines[i], /a=rtpmap:(\d+) CN\/\d+/i );
        if ( payload ) {
          var cnPos = mLineElements.indexOf( payload );
          if ( cnPos !== -1 ) {
            // Remove CN payload from m line.
            mLineElements.splice( cnPos, 1 );
          }
          // Remove CN line in sdp
          sdpLines.splice( i, 1 );
        }
      }
      sdpLines[ mLineIndex ] = mLineElements.join( ' ' );
      
      return sdpLines;
    }
    
  });
  
  W.CMCall = CMCall;
  
} )( window );