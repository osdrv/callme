;( function( W ) {
  
  var CM = W.CM = W.CM || {};
  
  CM.Session = new Class({
    
    Implements: [ Events, Options ],
    
    options: {
      transport: {
        klass: CM.Transport.WebSocketTransport,
        options: {}
      },
      rtc: {
        klass: CM.Transport.RTCTransport,
        options: {}
      },
      media: {
        options: {
          video: true, audio: true
        }
      }
    },
    
    initialize: function( ssid, options ) {
      options = options || {};
      this.setOptions( options );
      this.ssid = ssid;
      if ( CM.isEmpty( ssid ) ) {
        throw( "Could not initialize session without session ID." );
      }
      this.callbacks = {};
      this._createTransport();
      this._createRTC();
      this._localStream = null;
    },

    isConnected: function() {
      return this.transport.isConnected();
    },
    
    connect: function( callback, errback ) {
      var self = this;
      if ( CM.isEmpty( this.transport ) ) {
        this._createTransport();
      }
      if ( !this.transport.isConnected() ) {
        this.transport.connect( function() {
          // SUCCESS
          self._registerSelf();
          if ( CM.isFunc( callback ) ) {
            callback.call( self );
          }
        }, function() {
          // ERROR
          if ( CM.isFunc( errback ) ) {
            errback.call( self );
          }
        } );
      }
    },

    getLocalStream: function( callback, errback ) {
      if ( !CM.isEmpty( this._localStream ) ) {
        if ( CM.isFunc( callback ) ) {
          callback.call( self, this._localStream );
        }
      } else {
        this._initMediaStream( callback, errback );
      }
    },

    stopLocalStream: function( callback, errback ) {
      if ( !CM.isEmpty( this._localStream ) ) {
        try {
          this._localStream.stop();
          if ( CM.isFunc( callback ) ) {
            callback.call( self );
          }
        } catch ( e ) {
          if ( CM.isFunc( errback ) ) {
            errback.call( self, e );
          }
        }
      }
    },

    hangupLocalStream: function( callback ) {
      this._localStream = null;
      if ( CM.isFunc( callback ) ) {
        callback.call( self );
      }
    },

    _initMediaStream: function( callback, errback ) {
      var self = this;
      try {
        var getUserMedia = CM.getUserMedia();
        // We have to call this method with context of navigator
        // Otherwise Illegal invocation errow would be thrown
        getUserMedia.call( navigator,
          this.options.media.options,
          function( stream ) {
            self._localStream = stream;
            if ( CM.isFunc( callback ) ) {
              callback.call( self, stream );
            }
          },
          function( e ) {
            if ( CM.isFunc( errback ) ) {
              errback.call( self );
            }
          }
        );
      } catch ( e ) {
        if ( CM.isFunc( errback ) ) {
          errback.call( self, e );
        }
      }
    },

    destroy: function( callback ) {
      var self = this;
      this.transport.disconnect( function() {
        self.transport = null;
        if ( CM.isFunc( callback ) ) {
          callback.call( self );
        }
      } );
    },

    getContactList: function() {
      this.transport.send({
        action: 'contacts.refresh',
        uuid: this.ssid
      });
    },

    offerTo: function( pairedSsid, callback, errback ) {
      var self = this;
      this.callbacks[ pairedSsid ] = {
        callback: callback,
        errback: errback
      };
      this.rtc.offer( function( sessDescr ) {
        // SUCCESSFULLY CREATED OFFER
        self.transport.send({
          action: 'peer',
          uuid: self.ssid,
          receiver: pairedSsid,
          session: sessDescr
        });
      }, function( e ) {
        // OFFER CREATION ERROR
        if ( CM.isFunc( errback ) ) {
          errback( e );
        }
      } );
    },

    accept: function( pairedSsid, remoteSession ) {
      var self = this;
      this.rtc.answer( remoteSession, function( sessDescr ) {
        self.transport.send({
          action: 'accept',
          uuid: self.ssid,
          receiver: pairedSsid,
          session: remoteSession
        });
      } );
    },

    reject: function( pairedSsid ) {
      this.transport.send({
        action: 'reject',
        uuid: self.ssid,
        receiver: pairedSsid
      });
    },

    hangup: function( reason ) {
      reason = reason || '';
      this.transport.send({
        action: 'hangup',
        uuid: self.ssid,
        reason: reason
      });
    },

    finalze: function( pairedSsid, remoteSession ) {
      this.rtc.finalize( remoteSession );
      this.succeedWith( pairedSsid );
    },

    offerCandidate: function( candidate ) {
      this.transport.send({
        action: 'candidate',
        uuid: this.ssid,
        candidate: candidate
      });
    },

    succeedWith: function( pairedSsid ) {
      if ( !CM.isEmpty( this.callbacks[ pairedSsid ] ) ) {
        if ( CM.isFunc( this.callbacks[ pairedSsid ].callback ) ) {
          var args = CM.argsToArr( arguments );
          args.shift();
          this.callbacks[ pairedSsid ].callback.apply( this, args );
        }
        this.callbacks[ pairedSsid ] = null;
      }
    },

    failedWith: function( pairedSsid ) {
      if ( !CM.isEmpty( this.callbacks[ pairedSsid ] ) ) {
        if ( CM.isFunc( this.callbacks[ pairedSsid ].errback ) ) {
          var args = CM.argsToArr( arguments );
          args.shift();
          this.callbacks[ pairedSsid ].errback.apply( this, args );
        }
        this.callbacks[ pairedSsid ] = null;
      }
    },
    
    getTransport: function() {
      return this.transport;
    },

    _createTransport: function() {
      this.transport = new this.options.transport.klass(
        this,
        this.options.transport.options
      );
    },

    getRTC: function() {
      return this.rtc;
    },

    _createRTC: function() {
      
      var self = this;

      this.rtc = new this.options.rtc.klass(
        this,
        this.options.rtc.options
      );

      this.rtc.on( 'rtc.connection.addstream', function( event ) {
        // URL.createObjectURL( event.stream )
        console.log( event )
        self.rtc.offerCandidates();
        console.log( URL.createObjectURL( event.stream ) );
      } );
    },

    _registerSelf: function() {
      this.transport.send({
        action: 'session.confirm',
        uuid: this.ssid
      })
    }
    
  });
  
} )( window );