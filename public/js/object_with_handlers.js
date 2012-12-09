;( function( W ) {
  
  var ObjectWithHandlers = new Class({
    
    initialize: function() {
      this.handlers = {};
    },
    
    registerHandler: function( event, cb ) {
      this.handlers[ event ] = this.handlers[ event ] || new Array();
      this.handlers[ event ].push( cb );
    },
    
    callHandlersFor: function( event ) {
      var _arguments = Array.prototype.slice.call( arguments );
      _arguments.shift();
      if ( this.handlers[ event ] !== undefined ) {
        this.handlers[ event ].each( function( el ) {
          el.apply( el, _arguments );
        } );
      }
    }
  });
  
  W.ObjectWithHandlers = ObjectWithHandlers;
} )( window );