;( function( W ) {
  
  var CM = W.CM = W.CM || {};
  
  CM.User = new Class({
    
    Implements: [ OnEvents, Options ],
    
    options: {
      session: {}
    },

    initialize: function( options ) {
      this.setOptions( options );
      this.session = null;
    },

    _setupProxies: function() {
      var self = this;
      Object.each({
        invite: function( action, data ) {
          var call = new CM.Call({ type: 'incomming' });
          call.uuid( data.uuid );
          call.rtcSession( data.session );
          call.userdata( data.userdata );
          return [ action, call ];
        }
      }, function( h, k ) {
        self._registerProxyHandler( k, h );
      })
    },
    
    createSession: function( ssid, callback, errback ) {
      
      var self = this;
      
      this._setupProxies();      
      
      this.session = new CM.Session( ssid, this.options.session );
      this.session.connect( callback, errback );

      var wsTransport = this.session.getTransport();
      
      wsTransport.on( "ws.message", function( message ) {
        if( !CM.isEmpty( message.action ) ) {
          self._proxyEvent( message.action, message );
        };
      } );

      return this;
    },
    
    getSession: function() {
      return this.session;
    },
    
    destroySession: function( callback ) {
      var self = this;
      this.session.destroy( function() {
        self.session = null;
        if ( CM.is_func( callback ) ) {
          callback.call( self );
        }
      } );
    },

    refreshContacts: function() {
      this.session.getContactList();
    },

    callTo: function( user, callback, errback ) {
      if ( user instanceof CM.User ) {
        user = user.getSession().ssid;
      }
      var self = this,
      handler = function() {
        self.getSession().offerTo( user, callback, errback );
      }
      if ( !this.getSession().isConnected() ) {
        this.getSession().connect( function() {
          handler,
          errback
        } );
      } else {
        handler();
      }
    },

    startWebCam: function( callback, errback ) {
      var self = this,
      selfCallback = function( stream ) {
        if ( !CM.isEmpty( stream ) ) {
          if ( CM.isFunc( callback ) ) {
            var streamUrl = W.URL.createObjectURL( stream );
            callback.call( self, streamUrl );
          }
        }
      }
      this.session.getLocalStream( selfCallback, errback );
    },

    stopWebCam: function( callback, errback ) {
      this.session.stopLocalStream( callback, errback );
    },

    _registerProxyHandler: function( k, h ) {
      this._proxies = this._proxies || {};
      this._proxies[ k ] = h;
    },

    _proxyEvent: function( action, data ) {
      if ( !CM.isEmpty( this._proxies[ action ] ) ) {
        var res = this._proxies[ action ].call( this, action, data );
        action = res[ 0 ];
        data = res[ 1 ];
      }
      console.log( "action: " + action );
      this.bang( action, data );
    }
    
  });
  
} )( window );