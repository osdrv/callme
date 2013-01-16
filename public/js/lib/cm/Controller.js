;( function( W ) {
  
  var CM = W.CM = W.CM || {};
  
  var listeners = {};

  CM.Controller = {
    
    on: function( event, handler ) {
      if ( CM.isEmpty( listeners[ event ] ) ) {
        listeners[ event ] = [];
      }
      listeners[ event ].push( handler );

      return this;
    },

    bang: function( event ) {
      if ( !CM.isEmpty( listeners[ event ] ) ) {
        listeners[ event ].each( function( listener) {} )
      }
    }
    
  };
  
} )( window );