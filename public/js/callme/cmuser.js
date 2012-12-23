;( function( W ) {
  var CMUser = new Class({
    
    Implements: [ Events, Options ],
    
    initialize: function( options ) {
      this.setOptions( options );
      this.session = null;
      this.transport = null;
      this.stream = null;
      this.is_local = true;
    },
    
    local: function( v ) {
      if ( v === undefined ) {
        return this.is_local;
      } else {
        this.is_local = v;
      }
    },
    
    setSession: function( session ) {
      this.session = session;
    },
    
    getSession: function() {
      return this.session;
    },
    
    setTransport: function( transport ) {
      this.transport = transport;
      this._bindTransportEvents();
    },
    
    call: function( user ) {
      this.transport.send(
        this.session,
        user.getSession(),
        {
          action: 'remote.invite'
        }
      );
    },
    
    incomming: function( user ) {
      this.fireEvent( 'incomming', user );
    },
    
    answer: function( user ) {
      this.transport.answerTo( this.getSession(), user.getSession() );
      this.fireEvent( 'answered', user );
    },
    
    reject: function( user ) {
      this.transport.rejectTo( this.getSession(), user.getSession() );
      this.fireEvent( 'rejected', user );
    },
    
    hangup: function( user ) {
      this.fireEvent( 'hanged_up', user );
    },
    
    cancel: function( user ) {
      this.fireEvent( 'canceled', user );
    },
    
    confirm: function() {
      this.transport.send(
        this.session,
        null,
        { action: 'session.confirm' }
      );
    },
    
    askForVideo: function( cb ) {
      var self = this;
      navigator.getUserMedia( { video: true, audio: true }, function( stream ) {
        self.stream = stream;
        self.stream_url = W.URL.createObjectURL( stream );
        self.fireEvent( 'media.allowed', stream );
        cb( stream );
      }, function( error ) {
        self.fireEvent( 'media.rejected', error );
      } );
    },
    
    loadContactList: function() {
      this.transport.send(
        this.session,
        null,
        { action: 'contacts.refresh' }
      );
    },
    
    _bindTransportEvents: function() {
      var self = this;
      this.transport.addEvent( 'connection.open', function() {
        self.confirm();
      } );
    }
  });
  
  W.CMUser = CMUser;
  
} )( window );