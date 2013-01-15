;( function( W ) {
  
  var CM = W.CM = W.CM || {};
  
  CM.Transport = CM.Transport || {};
  
  CM.Transport.WebSocketTransport = new Class({
    
    Extends: CM.Transport,
    
    options: {
      host: 'localhost',
      port: '8080',
      protocols: [ 'soap', 'xmpp' ],
      url: '/echo'
    },
    
    implements: function( options ) {
      this.parent( options );
      this.socket = null;
    },
    
    getConnectionUrl: function() {
      return 'ws://' + this.options.host + ':' + this.options.port + this.options.url;
    },
    
    connect: function( callback, errback ) {
      var self = this,
      localCallback = function() {
        
      };
      if ( !CM.isEmpty( this.socket ) ) {
        this.disconnect( localCallback );
      } else {
        localCallback();
      }
    },
    
    disconnect: function( callback ) {
      if ( !CM.isEmpty( this.socket ) ) {
        try {
          this.socket.close();
          this.socket = null;
          this.bang( 'connection.close.ok' );
        } catch( e ) {
          this.bang( 'connection.close.error' );
        }
      }
      if ( CM.isFunc( callback ) ) {
        callback();
      }
    }
    
  });
  
} )( window );