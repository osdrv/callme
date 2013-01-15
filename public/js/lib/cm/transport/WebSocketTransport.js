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

    initialize: function( options ) {
      this.parent( options );
      this.socket = null;
    },

    getConnectionUrl: function() {
      return 'ws://' +
        this.options.host +
        ':' +
        this.options.port +
        this.options.url;
    },

    connect: function( callback, errback ) {
      var self = this,
      localCallback = function() {
        try {
          self.socket = new WebSocket(
            self.getConnectionUrl(),
            self.options.protocols
          );
          self.socket.onopen = function() {
            // FIXME: Arguments list
            self.bang( 'connection.open.ok', arguments );
            self.is_connected = true;
            if ( CM.isFunc( callback ) ) {
              callback.apply( self, arguments );
            }
            // END OF FIXME
          }
          self.socket.error = function() {
            // FIXME: Arguments list
            self.bang( 'connection.open.error', arguments );
            self.is_connected = false;
            if ( CM.isFunc( errback ) ) {
              errback.apply( self, arguments );
            }
            // END OF FIXME
          }
          self.socket.onmessage = function( string_message ) {
            self.receive( string_message );
          }
          self.socket.onclose = function() {
            self.is_connected = false;
            self.bang( 'connection.close.ok' );
          }
        } catch ( e ) {
          if ( CM.isFunc( errback ) ) {
            errback.call( self, e );
          }
        }
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
          self.is_connected = false;
          this.socket.close();
          this.socket = null;
        } catch( e ) {
          this.bang( 'connection.close.error', e );
        }
      }
      if ( CM.isFunc( callback ) ) {
        callback();
      }
    },

    receive: function( string_message ) {
      try {
        var message = JSON.parse( string_message );
        this.bang( 'connection.message', message );
      } catch( e ) {
        this.bang( 'connection.message.error', e );
      }
    }

  });

} )( window );