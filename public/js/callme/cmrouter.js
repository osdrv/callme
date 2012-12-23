;( function( W ) {
  
  var CMRouter = new Class({
    
    Implements: [ Events, Options ],
    
    initialize: function( options ) {
      options = options || {};
      this.setOptions( options );
    },
    
    respondTo: function( action_name ) {
      return !is_empty( this[ action_name ] );
    },
    
    on: function( action_name, handler ) {
      this[ action_name ] = handler;
      return this;
    }
    
  });
  
  W.CMRouter = CMRouter;
  
} )( window );