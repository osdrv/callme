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

  W.RTCPeerConnection = 
    W.RTCPeerConnection ||
      W.mozRTCPeerConnection ||
        W.webkitRTCPeerConnection;
  
  CM.isFunc = function( arg ) {
    return typeof( arg ) == 'function';
  }
  
  CM.isEmpty = function( arg ) {
    return arg === undefined || !arg
  }

  CM.argsToArr = function( args ) {
    return Array.prototype.slice.call( args );
  };

  CM._w = function( str ) {
    return str.split( /\s+/ );
  }

  CM.getUserMedia = CM.getUserMedia || function() {
    return  navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia;
  }

  CM.tmpl = function( str_tmpl, obj ) {
    if ( str_tmpl.match( /^#/ ) ) {
      str_tmpl = str_tmpl.replace( /^#/, "" )
      var el = $( str_tmpl );
      if ( !CM.isEmpty( el ) ) {
        str_tmpl = el.get( 'html' );
      }
    }
    res = str_tmpl;
    Object.each( obj, function( v, k ) {
      var re = new RegExp( '#{' + k + '}', 'g' );
      res = res.replace( re, v );
    } );
    res = res.replace( /\#\{.+?\}/g, '' );
    
    return res;
  }

  CM.testSystem = function( callback, errback ) {
    // @FIXME: implement system test
    if ( CM.isFunc( callback ) ) {
      callback();
    }
    // END OF FIXME
  }
  
} )( window );