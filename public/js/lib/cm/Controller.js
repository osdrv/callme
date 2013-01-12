;( function( W ) {
  
  var CM = W.CM = W.CM || {};
  
  CM.Controller = new Class({
    
    Implements: [ OnEvents, Options ],
    
    initialize: function( options ) {
      this.setOptions( options );
    }
    
  });
  
} )( window );