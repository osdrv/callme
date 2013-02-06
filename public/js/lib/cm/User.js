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
    
    createSession: function( ssid, callback, errback ) {
      
      var self = this;
      
      this.session = new CM.Session( ssid, this.options.session );
      this.session.connect( callback, errback );

      var wsTransport = this.session.getTransport();
      
      wsTransport.on( "ws.message", function( message ) {
        if( !CM.isEmpty( message.action ) ) {
          self.bang( message.action, message );
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
    }
    
  });
  
} )( window );