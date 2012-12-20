;( function( W ) {
  
  W.WB = W.WB || {};
  
  WB.App = {
    
    bang: function( sess_data ) {
      var uri = new URI(),
          session = new Session({
            host: uri.get( 'host' ),
            port: uri.get( 'port' ),
            url: '/session'
          }),
          remote = new Remote( session, {} ),
          contacts_box = new ContactsBox( 'contacts' ),
          video_box = new VideoBox( { self: 'self', paired: 'paired' } ),
          incomming_box = new IncommingBox( 'incomming' ),
          sorry_plate = $( 'sorry' ),
          page = $( 'page' ),
          interval = 250,
          reconnects = 0,
          MAX_RECONNECTS = 10,
          RECONNECT_TIMEOUT = 1000;


      var blurPage = function() {
        page.removeClass( 'unblur' ).addClass( 'blur' );
      }

      var unblurPage = function() {
        page.removeClass( 'blur' ).addClass( 'unblur' );
      }


      remote.registerHandler( 'stun.icecandidate', function( event ) {
        // console.log( 'stun.ice_candidate', arguments );
      } );

      remote.registerHandler( 'stun.addstream', function( event ) {
        console.log( 'stun.addstream', arguments );
        remote.offerCandidates();
        video_box.playPairedVideo( URL.createObjectURL( event.stream ) );
      } );

      remote.registerHandler( 'stun.removestream', function( event ) {
        console.log( 'stun.removestream', arguments );
        video_box.stopPairedVideo();
      } );

      remote.registerHandler( 'stun.error', function() {
        console.log( 'stun.error', arguments );
      } );

      remote.registerHandler( 'sdp.init', function() {
        console.log( 'sdp.init', arguments );
      } );


      incomming_box.addEvent( 'appear', function() {
        blurPage();
      } ).addEvent( 'disappear', function() {
        unblurPage();
      } );

      contacts_box.registerHandler( 'contact.selected', function( uuid ) {
        video_box.initUserMedia( function( stream ) {
          remote.setStream( stream );
          remote.callTo( uuid );
        } );
      } );


      session.registerHandler( 'open', function() {
        // user_box.setStatus( 'connecting' );
      } );

      session.registerHandler( 'session.confirmed', function() {
        // user_box.setStatus( 'online' );
      } );

      session.registerHandler( 'close', function() {
        // user_box.setStatus( 'offline' );
        if ( reconnects <= MAX_RECONNECTS ) {
          window.setTimeout( function() {
            reconnects++;
            session.start();
          }, RECONNECT_TIMEOUT );
        } else {
          blurPage();
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
              if ( data.status == "offer" ) {
                incomming_box.proceed( data.callee, function() {
                  video_box.initUserMedia( function( stream ) {
                    incomming_box.disappear();
                    remote.setStream( stream );
                    remote.proceed( data );
                  });
                }, function() {
                  incomming_box.disappear();
                  // FIX ME
                  // remote.reject( data );
                  // END OF FIX ME
                } );
              } else {
                remote.proceed( data );
              }
              break;
          }
        // } catch ( e ) {
        //   console.log( e );
        //   console.log( 'Inconsistent message received' );
        // }
        // console.log(  );
      } );


      session.setUserData( sess_data );
      session.start();
      
      // register_box.registerHandler( 'register', function( values ) {
      //   session.setUserData( values );
      //   register_box.element.removeClass( 'appear' ).addClass( 'right-top' ).addClass( 'hide' );
      //   window.setTimeout( function() {
      //     page.removeClass( 'blur' ).addClass( 'unblur' );
      //     user_box.setName( values.name );
      //     session.start();
      //   }, 2 * interval );
      // } );


      // var ix = 1;
      // page.addClass( 'blur' );
      // [ 'user', 'register' ].each( function( box_id ) {
      //   window.setTimeout( function() {
      //     $( box_id ).removeClass( 'hide' ).addClass( 'appear' );
      //     if ( box_id == 'register' ) {
      //       window.setTimeout( function() {
      //         register_box.focus();
      //       }, interval );
      //     }
      //   }, interval * ( ++ix ) );
      // } );
    }
    
  }
} )( window );