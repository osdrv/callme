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
      this.ssid = ssid;
      if ( CM.isEmpty( ssid ) ) {
        throw( "Could not initialize session without session ID." );
      }
      this.setOptions( options );
      this.isConnected = false;
    },
    
    connect: function( callback, errback ) {
      if ( CM.isEmpty( this.transport ) ) {
        this._createTransport();
      }
      if ( !this.transport.isConnected() ) {
        this.transport.connect( function() {
          // SUCCESS
          callback.call();
        }, function() {
          // ERROR
          errback.call();
        } )
      }
    },
    
    _createTransport: function() {
      this.transport = new this.options.transport.klass(
        this.options.transport.options
      );
    }
    
  });
  
} )( window );