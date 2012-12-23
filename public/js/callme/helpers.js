;( function( W ) {
  
  W.CallMe = W.CallMe || {};
  
  W.CallMe.getUsersOnline = function( message ) {
    var contacts_online = {};
    if ( !is_empty( message.sessions ) ) {
      message.sessions.each( function( session ) {
        var session = new CMSession( session ),
            user = new CMUser();
        user.setSession( session );
        user.local( false );
        contacts_online[ session.getSSID() ] = user;
      } );
    }
    
    return contacts_online;
  }
  
} )( window );