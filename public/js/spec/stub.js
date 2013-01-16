var originalWebSocket;

beforeEach( function() {
  // WebSocket STUB
  originalWebSocket = window.WebSocket;
  window.WebSocket = new Class({
    Implements: [ Events ],
    initialize: function( options ) {
      var self = this;
      window.setTimeout( function() {
        self.open();
      }, 10 );
    },
    open: function() {
      if ( CM.isFunc( this.onopen ) ) {
        this.onopen();
      }
    },
    close: function() {
      if ( CM.isFunc( this.onclose ) ) {
        this.onclose();
      }
    },
    message: function( message ) {
      if ( CM.isFunc( this.onmessage ) ) {
        this.onmessage( message );
      }
    }
  });
  // END OF WebSocket STUB
} );

afterEach( function() {
  window.WebSocket = originalWebSocket;
} );