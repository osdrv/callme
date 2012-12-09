;( function( W ) {
  
  defaults = {
    host: 'localhost',
    port: '8080',
    protocols: [ 'soap', 'xmpp' ],
    url: '/echo'
  }
  
  var Session = new Class({
    
    initialize: function( options ) {
      this.options = Object.merge( defaults, options );
      this.handlers = {};
      this.SESSID = null;
      this.connection = null;
    },
    
    cfg: function( k, v ) {
      if ( v === undefined ) {
        return this.options[ k ];
      } else {
        this.options[ k ] = v;
      }
    },
    
    registerHandler: function( event, cb ) {
      this.handlers[ event ] = this.handlers[ event ] || new Array();
    },
    
    callHandlersFor: function( event ) {
      var _arguments = arguments;
      _arguments.shift();
      if ( this.handlers[ event ] !== undefined ) {
        this.handlers[ event ].each( function( el ) {
          el.apply( el, _arguments );
        } );
      }
    },
    
    getConnectionUrl: function() {
      return 'ws://' + this.options.host + ':' + this.options.port + this.options.url;
    },
    
    bindConnection: function() {
      if ( this.connection === null ) {
        throw 'Session is not started yet. Call session.start() first.';
      }
      var self = this,
          connection = this.connection;
      [ 'onopen', 'error', 'onmessage', 'onclose' ].each( function( event_kind ) {
        connection[ event_kind ] = function() {
          self.callHandlersFor.apply( self, event_kind.replace( /^on/, '' ), arguments );
        }
      } );
    },
    
    start: function() {
      this.connection = new WebSocket( this.getConnectionUrl(), this.options.protocols );
      this.bindConnection();
    }
  });

  window.Session = Session;
  
} )( window );