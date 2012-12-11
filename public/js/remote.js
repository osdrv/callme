;( function( W ) {
  
  var mediaSettings = {
    mandatory: {
      OfferToReceiveAudio: true, 
      OfferToReceiveVideo: true
    }
  };
  
  var Remote = new Class({
    
    Extends: ObjectWithHandlers,
    
    defaults: {
      stun: { iceServers: [ { url: "stun:stun.l.google.com:19302" } ] }
    },
    
    initialize: function( session, options ) {
      this.parent();
      this.session = session;
      this.options = Object.merge( this.defaults, options );
      //this.createPeerConn();
    },
    
    createPeerConn: function() {
      var self = this;
      // try {
        this.peer_connection = new RTCPeerConnection( this.options.stun );
        // this.peer_connection = new webkitPeerConnection00(
        //   this.options.stun,
        //   function( peer, others ) {
        //     self.callHandlersFor( "stun.ice_candidate", peer, others );
        //   }
        // );
        console.log( this.peer_connection );
        $w( 'onicecandidate onconnecting onopen onaddstream onremovestream' ).each( function( event ) {
          ( function( event_kind ) {
            console.log( event_kind );
            self.peer_connection[ event_kind ] = function() {
              var args = Array.prototype.slice.call( arguments );
              args.unshift( "stun." + event_kind.replace( /^on/, '' ) );
              self.callHandlersFor.apply( self, args );
            }
          } )( event );
        } );
      // } catch ( e ) {
        // this.callHandlersFor( "stun.error", e );
      // }
    },
    
    setStream: function( local_stream ) {
      this.local_stream = local_stream;
      this.callHandlersFor( "stream.add", local_stream );
    },
    
    callTo: function( receiver ) {
      var self = this;
      this.createPeerConn();
      this.peer_connection.addStream( this.local_stream );
      var call = this.peer_connection.createOffer(
        function ( sess_descr ) {
          sess_descr.sdp = preferOpus( sess_descr.sdp );
          self.peer_connection.setLocalDescription( sess_descr );
          self.session.connectWith( receiver, sess_descr );
        },
        null,
        mediaSettings
      );
    },
    
    preferOpus: function( sdp ) {
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
        if ( sdpLines[i].search('opus/48000') !== -1 ) {
          var opusPayload = this.extractSdp( sdpLines[i], /:(\d+) opus\/48000/i );
          if ( opusPayload ) {
            sdpLines[ mLineIndex ] = setDefaultCodec( sdpLines[mLineIndex], opusPayload );
          }
          break;
        }
      }

      // Remove CN in m line and sdp.
      sdpLines = removeCN(sdpLines, mLineIndex);

      sdp = sdpLines.join('\r\n');
      
      return sdp;
    },
    
    extractSdp: function( sdpLine, pattern ) {
      var result = sdpLine.match( pattern );
      return ( result && result.length == 2 )? result[ 1 ]: null;
    },
    
    setDefaultCodec: function( mLine, payload ) {
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
    
    function removeCN(sdpLines, mLineIndex) {
      var mLineElements = sdpLines[mLineIndex].split(' ');
      // Scan from end for the convenience of removing an item.
      for ( var i = sdpLines.length - 1; i >= 0; i-- ) {
        var payload = this.extractSdp( sdpLines[i], /a=rtpmap:(\d+) CN\/\d+/i );
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