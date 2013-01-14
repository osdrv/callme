;( function( W ) {
  
  var CM = W.CM = W.CM || {};
  
  CM.Session = new Class({
    
    options: {
      transport: CM.Transport.WebSocket
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
      this._createTransport();
    }
    
  });
  
} )( window );