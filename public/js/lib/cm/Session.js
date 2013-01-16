;( function( W ) {
  
  var CM = W.CM = W.CM || {};
  
  CM.Session = new Class({
    
    options: {
      transport: {
        klass: CM.Transport.WebSocketTransport,
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
      this._createTransport();
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
      } )
    },
    
    _createTransport: function() {
      this.transport = new this.options.transport.klass(
        this.options.transport.options
      );
    }
    
  });
  
} )( window );