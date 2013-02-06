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

    initialize: function( session, options ) {
      this.parent( session, options );
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
                var args = CM.argsToArr( arguments );
                args.shift();
                self.bang( 'ws.open.ok', args );
                self.is_connected = true;
                if ( CM.isFunc( callback ) ) {
                  callback.apply( self, args );
                }
              }
              self.socket.error = function() {
                var args = CM.argsToArr( arguments );
                args.shift();
                self.bang( 'ws.open.error', args );
                self.is_connected = false;
                if ( CM.isFunc( errback ) ) {
                  errback.apply( self, args );
                }
              }
              self.socket.onmessage = function( string_message ) {
                self.receive( string_message );
              }
              self.socket.onclose = function() {
                self.is_connected = false;
                self.bang( 'ws.close.ok' );
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
      try {
        if ( !CM.isEmpty( this.socket ) ) {
          self.is_connected = false;
          this.socket.close();
          this.socket = null;
        }
        if ( CM.isFunc( callback ) ) {
          callback();
        }
      } catch( e ) {
        this.bang( 'ws.close.error', e );
      }
    },

    receive: function( string_message ) {
      try {
        var message = JSON.parse( string_message.data );
        console.log( 'Websocket message: ', message );
        this.bang( 'ws.message', message );
      } catch( e ) {
        this.bang( 'ws.message.error', e );
      }
    },

    send: function( object ) {
      if ( this.isConnected() ) {
        this.socket.send( JSON.encode( object ) );
      } else {
        throw "Socket is not connected yet.";
      }
    }

  });

} )( window );