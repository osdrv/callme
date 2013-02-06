;( function( W ) {
  
  var CM = W.CM = W.CM || {};
  
  var listeners = {};

  var router;

  var routerEvent = "message"

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
    },

    withRouter: function( newRouter, newRouterEvent ) {
      var self = this;
      router = newRouter;
      routerEvent = newRouterEvent || routerEvent;
      if ( !( newRouter instanceof CM.Transport ) ) {
        throw "argument should be a Transport instance";
      }
      router.on( routerEvent, function( message ) {
        if( !CM.isEmpty( message.action ) ) {
          self.bang( message.action, message );
        };
      } );
      
      return this;
    }
    
  };
  
} )( window );