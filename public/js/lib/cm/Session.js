;( function( W ) {
  
  var CM = W.CM = W.CM || {};
  
  CM.Session = new Class({
    
    Implements: [ Events, Options ],
    
    initialize: function( ssid, options ) {
      options = options || {};
      this.ssid = ssid;
      if ( CM.is_empty( ssid ) ) {
        throw( "Could not initialize session without session ID." );
      }
      this.setOptions( options );
    }
    
  });
  
} )( window );