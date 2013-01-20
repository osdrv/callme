;( function( W ) {
  
  var CM = W.CM = W.CM || {};
  
  CM.Session = new Class({
    
    options: {
      transport: {
        klass: CM.Transport.WebSocketTransport,
        options: {}
      },
      rtc: {
        klass: CM.Transport.RTCTransport,
        options: {}
      }
    },
    
    Implements: [ Events, Options ],
    
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
    },

    isConnected: function() {
      return this.transport.isConnected();
    },
    
    connect: function( callback, errback ) {
      if ( CM.isEmpty( this.transport ) ) {
        this._createTransport();
      }
      if ( !this.transport.isConnected() ) {
        this.transport.connect( function() {
          // SUCCESS
          if ( CM.isFunc( callback ) ) {
            callback.call();
          }
        }, function() {
          // ERROR
          if ( CM.isFunc( errback ) ) {
            errback.call();
          }
        } )
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

    offerTo: function( pairedSsid, callback, errback ) {
      var self = this;
      this.callbacks[ ssid ] = {
        callback: callback,
        errback: errback
      };
      this.rtc.offer( function( sessDescr ) {
        // SUCCESSFULLY CREATED OFFER
        // callback( sess_descr );
        self.transport.send({
          action: 'peer',
          uuid: self.ssid,
          receiver: pairedSsid,
          session: sessDescr
        });
        if ( CM.isFunc( callback ) ) {
          callback.call( self );
        }
      }, function( e ) {
        // OFFER CREATION ERROR
        if ( CM.isFunc( errback ) ) {
          errback( e );
        }
      } );
    },

    offerCandidate: function( candidate ) {
      this.transport.send({
        action: 'candidate',
        uuid: this.ssid,
        candidate: candidate
      });
    },
    
    _createTransport: function() {
      this.transport = new this.options.transport.klass(
        this,
        this.options.transport.options
      );
    },

    _createRTC: function() {
      this.rtc = new this.options.rtc.klass(
        this,
        this.options.rtc.options
      );
    }
    
  });
  
} )( window );