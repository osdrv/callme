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
      var args = CM.argsToArr( arguments ),
          self = this;
      args.shift();
      if ( !CM.isEmpty( listeners[ event ] ) ) {
        listeners[ event ].each( function( handler ) {
          if ( CM.isFunc( handler ) ) {
            handler.apply( self, args );
          }
        } );
      }

      return this;
    }
    
  };
  
} )( window );