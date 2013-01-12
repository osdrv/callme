;( function( W ) {
  
  var CM = W.CM = W.CM || {};
  
  CM.Call = new Class({
    
    Implements: [ Events, Options ],
    
    initialize: function( options ) {
      this.setOptions( options );
    }
    
  });
  
} )( window );