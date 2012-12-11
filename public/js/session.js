;( function( W ) {
  
  defaults = {
    host: 'localhost',
    port: '8080',
    protocols: [ 'soap', 'xmpp' ],
    url: '/echo'
  }
  
  var Session = new Class({
    
    Extends: ObjectWithHandlers,
    
    initialize: function( options ) {
      this.parent();
      this.options = Object.merge( defaults, options );
      this.SESSID = null;
      this.connection = null;
      this.user_data = null;
      
      var self = this;
      
      this.registerHandler( "close", function() {
        if ( self.connection !== null )
          self.connection.close();
      } );
    },
    
    cfg: function( k, v ) {
      if ( v === undefined ) {
        return this.options[ k ];
      } else {
        this.options[ k ] = v;
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
          console.log( "Fired: ", event_kind, arguments );
          var args = Array.prototype.slice.call( arguments );
          args.unshift( event_kind.replace( /^on/, '' ) );
          self.callHandlersFor.apply( self, args );
        }
      } );
    },
    
    start: function() {
      this.connection = new WebSocket( this.getConnectionUrl(), this.options.protocols );
      this.bindConnection();
    },
    
    setUserData: function( data ) {
      this.user_data = data;
    },
    
    getUserData: function() {
      return this.user_data;
    },
    
    _finalizeRegister: function() {
      this.connection.send(
        JSON.encode( { action: 'session', uuid: this.SESSID, user_data: this.getUserData() } )
      );
    },
    
    proceed: function( data ) {
      if ( data !== undefined && data !== null ) {
        switch ( data.status ) {
          case 'created':
            this.SESSID = data.uuid;
            this.callHandlersFor( 'session.created' );
            this._finalizeRegister();
          case 'confirmed':
            this.callHandlersFor( 'session.confirmed' );
        }
      }
    },
    
    connectWith: function( uuid, sess_descr ) {
      this.connection.send( JSON.encode({
        action: 'peer',
        uuid: this.SESSID,
        receiver: uuid,
        session: sess_descr
      }));
    },
    
    answerTo: function( uuid, sess_descr ) {
      
    }
  });

  W.Session = Session;
  
} )( window );