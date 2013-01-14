;( function( W ) {
  
  if ( W.Events !== undefined ) {
    W.OnEvents = new Class({
      Extends: Events,
      
      on: function( type, fn, internal ) {
        return this.addEvent( type, fn, internal );
      },
      
      bang: function( type, args, delay ) {
        return this.fireEvent( type, args, delay );
      }
    });
  } else {
    console.warn( "MooTools Events module is not defied." )
  }
  
  CM.isFunc = function( arg ) {
    return typeof( arg ) == 'function';
  }
  
  CM.isEmpty = function( arg ) {
    return arg === undefined || !arg
  }
  
} )( window );