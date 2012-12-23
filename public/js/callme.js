;( function( W ) {
  
  var CallMe = {
    
    bang: function( sessid ) {
      
      var uri = new URI(),
          router = new CMRouter(),
          transport = new CMTransport( router, {
            host: uri.get( 'host' ),
            port: uri.get( 'port' ),
            url: '/session'
          }),
          session = new CMSession( sessid ),
          user = new CMUser();
      user.setSession( session );
      user.setTransport( transport );
      
      
      router.on( 'session.confirmed', function( message ) {
        session.data( message.user_data );
        user.loadContactList();
      } ).on( 'session.rejected', function( message ) {
        // FIX ME
        console.error( 'Session could not been created' );
        // END OF FIX ME
      } );
      
      router.on( 'contacts.refresh', function( message ) {
        console.log( message )
      } );
      
      router.on( 'remote.invite', function( message ) {
        
      } ).on( 'remote.ack', function( message ) {
        
      } ).on( 'remote.bye', function( message ) {
        
      } ).on( 'remote.cancel', function() {
        
      } ).on( 'remote.stun.candidate', function() {
        
      } );
      
      // создаем соединение с сервером
      transport.start();
      
    }
    
  }
  
  W.CallMe = CallMe;
  
} )( window );