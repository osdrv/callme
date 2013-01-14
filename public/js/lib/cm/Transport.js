;( function( W ) {
  
  var CM = W.CM = W.CM || {};
  
  CM.Transport = new Class({
    
    /*@Abstract*/
    
    Implements: [ OnEvents, Options ],
    
    initialize: function( options ) {
      this.setOptions( options );
    },
    
    connect: function( callback, errback ) {
      
    },
    
    disconnect: function( callback ) {
      
    },
    
    send: function( data, params ) {
      
    },
    
    receive: function( data ) {
      
    }
    
  });
  
} )( window );