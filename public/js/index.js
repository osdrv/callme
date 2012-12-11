;( function( W ) {
  document.addEventListener( 'DOMContentLoaded', function() {
    
    var session = new Session({
          host: 'localhost',
          port: 8080,
          url: '/session'
        }),
        remote = new Remote( session, {} ),
        register_box = new RegisterBox( 'register' ),
        user_box = new StatusBox( 'user' ),
        contacts_box = new ContactsBox( 'contacts' ),
        video_box = new VideoBox( { self: 'self', paired: 'paired' } ),
        sorry_plate = $( 'sorry' ),
        page = $( 'page' ),
        interval = 250,
        reconnects = 0,
        MAX_RECONNECTS = 10,
        RECONNECT_TIMEOUT = 1000;
    
    
    
    remote.registerHandler( 'stun.icecandidate', function( peer, offers ) {
      console.log( 'stun.ice_candidate', arguments );
    } );
    
    remote.registerHandler( 'stun.addstream', function( event ) {
      console.log( 'stun.addstream', arguments );
      video_box.playPairedVideo( URL.createObjectURL( event.stream ) );
    } );
    
    remote.registerHandler( 'stun.removestream', function( event ) {
      console.log( 'stun.removestream', arguments );
    } );
    
    remote.registerHandler( 'stun.error', function() {
      console.log( 'stun.error', arguments );
    } );
    
    remote.registerHandler( 'sdp.init', function() {
      console.log( 'sdp.init', arguments );
    } );
    
    
    contacts_box.registerHandler( 'contact.selected', function( uuid ) {
      remote.callTo( uuid );
    } );
    
    
    session.registerHandler( 'open', function() {
      user_box.setStatus( 'connecting' );
    } );
    
    session.registerHandler( 'session.confirmed', function() {
      user_box.setStatus( 'online' );
    } );
    
    session.registerHandler( 'close', function() {
      user_box.setStatus( 'offline' );
      if ( reconnects <= MAX_RECONNECTS ) {
        window.setTimeout( function() {
          reconnects++;
          session.start();
        }, RECONNECT_TIMEOUT );
      } else {
        page.removeClass( 'unblur' ).addClass( 'blur' );
        sorry_plate.removeClass( 'hide' ).addClass( 'appear' );
      }
    } );
    
    session.registerHandler( 'message', function( message ) {
      reconnects = 0;
      // try {
        var data = JSON.decode( message.data );
        
        switch ( data.action ) {
          case 'session':
            session.proceed( data );
            break;
          case 'contacts':
            contacts_box.proceed( data );
            break;
          case 'remote':
            remote.proceed( data );
            break;
        }
      // } catch ( e ) {
      //   console.log( e );
      //   console.log( 'Inconsistent message received' );
      // }
      // console.log(  );
    } );
    
    
    video_box.registerHandler( 'inited', function( stream ) {
      remote.setStream( stream );
    } );
    
    
    register_box.registerHandler( 'register', function( values ) {
      session.setUserData( values );
      register_box.element.removeClass( 'appear' ).addClass( 'right-top' ).addClass( 'hide' );
      window.setTimeout( function() {
        page.removeClass( 'blur' ).addClass( 'unblur' );
        user_box.setName( values.name );
        session.start();
      }, 2 * interval );
    } );
    
    
    var ix = 1;
    page.addClass( 'blur' );
    [ 'user', 'register' ].each( function( box_id ) {
      window.setTimeout( function() {
        $( box_id ).removeClass( 'hide' ).addClass( 'appear' );
        if ( box_id == 'register' ) {
          window.setTimeout( function() {
            register_box.focus();
          }, interval );
        }
      }, interval * ( ++ix ) );
    } );
    
  }, false );
} )( window );