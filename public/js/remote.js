;( function( W ) {
  
  var mediaSettings = {
    mandatory: {
      OfferToReceiveAudio: true, 
      OfferToReceiveVideo: true
    }
  };
  
  var Remote = new Class({
    
    Implements: [ Events ],
    
    Extends: ObjectWithHandlers,
    
    defaults: {
      stun: { iceServers: [ { url: "stun:stun.l.google.com:19302" } ] }
    },
    
    initialize: function( session, options ) {
      this.parent();
      var self = this;
      this.session = session;
      this.options = Object.merge( this.defaults, options );
      this.peer_connection = null;
      this.candidates = [];
      this.is_inited = false;
      this.registerHandler( 'stun.icecandidate', function( event ) {
        if ( event.candidate ) {
          self.offerCandidate( {
            type: 'candidate',
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate
          } );
        }
      } );
    },
    
    createPeerConn: function() {
      var self = this;
      try {
        this.peer_connection = new RTCPeerConnection( this.options.stun );
        $w( 'onicecandidate onconnecting onopen onaddstream onremovestream' ).each( function( event ) {
          ( function( event_kind ) {
            self.peer_connection[ event_kind ] = function() {
              var args = Array.prototype.slice.call( arguments );
              args.unshift( "stun." + event_kind.replace( /^on/, '' ) );
              self.callHandlersFor.apply( self, args );
            }
          } )( event );
        } );
      } catch ( e ) {
        this.callHandlersFor( "stun.error", e );
      }
    },
    
    setStream: function( local_stream ) {
      this.local_stream = local_stream;
      this.callHandlersFor( "stream.add", local_stream );
    },
    
    callTo: function( receiver ) {
      var self = this;
      if ( this.peer_connection === null )
        this.createPeerConn();
      this.peer_connection.addStream( this.local_stream );
      var call = this.peer_connection.createOffer(
        function ( sess_descr ) {
          sess_descr.sdp = self._preferOpus( sess_descr.sdp );
          self.peer_connection.setLocalDescription( sess_descr );
          self.session.connectWith( receiver, sess_descr );
        },
        null,
        mediaSettings
      );
    },
    
    answer: function( callee, remote_session ) {
      var self = this;
      this.is_inited = true;
      if ( this.peer_connection === null )
        this.createPeerConn();
      this.peer_connection.addStream( this.local_stream );
      this.peer_connection.setRemoteDescription(
        new RTCSessionDescription( remote_session )
      );
      this.peer_connection.createAnswer(
        function ( sess_descr ) {
          sess_descr.sdp = self._preferOpus( sess_descr.sdp );
          self.peer_connection.setLocalDescription( sess_descr );
          self.session.answerTo( callee, sess_descr );
        },
        null,
        mediaSettings
      );
      this.callHandlersFor( 'remote.offered', callee, remote_session );
    },
    
    reject: function( callee, remote_session ) {
      this.is_inited = false;
      self.session.rejectTo( callee );
    },
    
    letsRock: function( callee, remote_session ) {
      console.log( "let's rock!" );
      this.is_inited = true;
      this.offerCandidates();
      if ( this.peer_connection === null )
        this.createPeerConn();
      this.peer_connection.setRemoteDescription(
        new RTCSessionDescription( remote_session )
      );
      this.callHandlersFor( 'remote.confirmed', callee, remote_session );
      this.fireEvent( 'connected' );
    },
    
    offerCandidates: function() {
      var self = this;
      while( this.candidates.length ) {
        candidate = this.candidates.shift();
        this.session.offerCandidate( candidate );
      }
    },
    
    offerCandidate: function( candidate ) {
      this.candidates.push( candidate );
      if ( this.is_inited ) {
        this.offerCandidates();
      }
    },
    
    proceed: function( data ) {
      switch ( data.status ) {
        case 'offer':
          try {
            var callee = JSON.parse( data.callee );
          } catch ( e ) {
            console.error( 'Malformed data received.' );
            console.error( e );
            return;
          }
          this.answer( this._getCallee( data.callee ).uuid, data.session );
          break;
        case 'confirm':
          this.letsRock( this._getCallee( data.callee ), data.session );
          break;
        case 'reject':
          // FIX ME
          // this.reject( this._getCallee( data.callee ) );
          // END OF FIX ME
          break;
        case 'candidate':
          this.addCandidate( data.candidate );
          break;
        case 'hangup':
          this.hangup();
          break;
      }
    },
    
    _getCallee: function( data ) {
      try {
        var callee = JSON.parse( data );
      } catch ( e ) {
        console.error( 'Malformed data received.' );
        console.error( e );
        
        return null;
      }
      
      return callee;
    },
    
    // TODO: implement it
    hangup: function() {
      this.is_inited = false;
      console.log( 'hanged up!' );
      this.callHandlersFor( 'remote.hanged_up' );
      this.fireEvent( 'hangup' );
    },
    
    addCandidate: function( data ) {
      var candidate = new RTCIceCandidate( { sdpMLineIndex: data.label, candidate: data.candidate } );
      this.peer_connection.addIceCandidate( candidate );
    },
    
    // copypasted from https://apprtc.appspot.com/
    
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
  
  W.Remote = Remote;
  
} )( window );