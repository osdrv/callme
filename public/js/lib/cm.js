;( function( W ) {
  
  var CM = {
    version: '0.1.0dev'
  },
  dependencies = [ "MooTools" ];
  
  for ( var i = 0, l = dependencies.length; i < l; i++ ) {
    if ( W[ dependencies[ i ] ] === undefined ) {
      throw( "Required dependency is not satisfied: " + dependencies[ i ] );
    }
  }
  
  W.CM = W.CallMe = CM;
  
} )( window );