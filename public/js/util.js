;( function( W ) {
  
  W.tmpl = function( str_tmpl, obj ) {
    res = str_tmpl;
    Object.each( obj, function( v, k ) {
      var re = new RegExp( '#{' + k + '}', 'g' );
      res = res.replace( re, v );
    } );
    res = res.replace( /\#\{.+?\}/g, '' );
    
    return res;
  }
  
  W.is_empty = function( v ) {
    return v === undefined || v === null;
  }
  
  W.$w = function( str ) {
    return str.split( /\s+/ );
  }
  
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  
  W.URL = W.URL || W.webkitURL;
  
  W.RTCPeerConnection = W.mozRTCPeerConnection || W.webkitRTCPeerConnection;
  
} )( window );