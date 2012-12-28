;( function( W ) {
  
  var CONNECTION_PREFFIX = 'connection.';
  
  var CMTransport = new Class({
    
    Implements: [ Events, Options ],
    
    options: {
      host: 'localhost',
      port: '8080',
      protocols: [ 'soap', 'xmpp' ],
      url: '/echo'
    },
    
    initialize: function( router, options ) {
      this.setOptions( options );
      this.connection = null;
      this._bindSelf();
      this.router = router || null;
      if ( is_empty( this.router ) ) throw "Controller parameter is expected.";
    },
    
    start: function() {
      var self = this;
      this._initConnection();
      this._bindConnectionHandlers();
    },
    
    close: function() {
      this.connection.close();
    },
    
    receive: function( data ) {
      var method_name = data.action;
      if ( this.router.respondTo( method_name ) ) {
        this.router[ method_name ]( data );
      }
    },
    
    send: function( session_from, session_to, data ) {
      this.connection.send( JSON.encode({
        sender: ( session_from && session_from.getSSID() ) || null,
        receiver: ( session_to && session_to.getSSID() ) || null,
        data: data
      }));
    },
    
    _initConnection: function( cb ) {
      this.connection = new WebSocket( this._getConnectionUrl(), this.options.protocols );
    },
    
    _getConnectionUrl: function() {
      return 'ws://' + this.options.host + ':' + this.options.port + this.options.url;
    },
    
    _bindConnectionHandlers: function() {
      var self = this,
          connection = this.connection || null;
      
      if ( is_empty( connection ) ) throw "Connection is not inited yet.";
      
      _w( 'onopen error onmessage onclose' ).each( function( event_kind ) {
        connection[ event_kind ] = function() {
          console.log( "Fired: ", event_kind, arguments );
          var args = argsToArr( arguments );
          args.unshift( event_kind.replace( /^on/, CONNECTION_PREFFIX ) );
          self.fireEvent.apply( self, args );
        }
      } );
    },
    
    _bindSelf: function() {
      var self = this;
      this.addEvent( CONNECTION_PREFFIX + 'message', function( message ) {
        var message_data = pJSON( message.data );
        self.receive( message_data || {} );
      } );
    }
    
  });
  
  W.CMTransport = CMTransport;
  
} )( window );