;( function( W ) {

  var CM = W.CM = W.CM || {};

  CM.Transport = new Class({

    /* @Abstract */

    Implements: [ OnEvents, Options ],

    initialize: function( session, options ) {
      this.session = session;
      this.setOptions( options );
      this.is_connected = false;
    },

    connect: function( callback, errback ) {
    },

    disconnect: function( callback ) {
    },

    isConnected: function() {
      return this.is_connected;
    },

    send: function( data, params ) {
    },

    receive: function( data ) {
      this.bang( 'message', data );
    }

  });

} )( window );