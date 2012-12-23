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
          contacts_box = new ContactsBox( 'contacts' ),
          video_box = new VideoBox( { self: 'self', paired: 'paired' } ),
          incomming_box = new IncommingBox( 'incomming' ),
          control_box = new ControlBox( 'controls' ),
          sorry_plate = $( 'sorry' ),
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
        var users_online = CallMe.getUsersOnline( message );
        Object.each( users_online, function( user ) { user.setTransport( transport ) } );
        contacts_box.setContactList( users_online );
      } );
      
      router.on( 'remote.invite', function( message ) {
        
      } ).on( 'remote.ack', function( message ) {
        
      } ).on( 'remote.bye', function( message ) {
        
      } ).on( 'remote.cancel', function() {
        
      } ).on( 'remote.stun.candidate', function() {
        
      } );
      
      contacts_box.addEvent( 'contact.selected', function( remote_user ) {
        user.askForVideo( function( stream ) {
          user.call( remote_user );
        } )
      } );
      
      // создаем соединение с сервером
      transport.start();
      
    }
    
  }
  
  W.CallMe = CallMe;
  
} )( window );