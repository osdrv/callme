;( function( W ) {
  
  var CM = W.CM = W.CM || {};
  
  CM.User = new Class({
    
    Implements: [ Events, Options ],
    
    initialize: function( options ) {
      this.setOptions( options );
      this.session = null;
    },
    
    createSession: function( ssid, callback, errback ) {
      this.session = new CM.Session( ssid );
      this.session.connect( callback, errback );
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
    }
    
  });
  
} )( window );