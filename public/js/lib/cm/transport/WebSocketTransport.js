;( function( W ) {
  
  var CM = W.CM = W.CM || {};
  
  CM.Transport = CM.Transport || {};
  
  CM.Transport.WebSocketTransport = new Class({
    
    Extends: CM.Transport,
    
    implements: function( options ) {
      this.parent( options );
    }
    
  });
  
} )( window );