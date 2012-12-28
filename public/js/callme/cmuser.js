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
    
    getTransport: function() {
      return this.transport;
    },
    
    call: function( user ) {
      var call = new CMCall( this );
      call.init( user );
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
      this.stream = null;
      this.fireEvent( 'hanged_up', user );
    },
    
    cancel: function( user ) {
      this.stream = null;
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
      if ( !is_empty( this.stream ) ) {
        cb( this.stream );
      } else {
        navigator.getUserMedia( { video: true, audio: true }, function( stream ) {
          self.stream = stream;
          self.stream_url = W.URL.createObjectURL( stream );
          self.fireEvent( 'media.allowed', stream );
          cb( stream );
        }, function( error ) {
          self.fireEvent( 'media.rejected', error );
        } );
      }
    },
    
    getStream: function( cb ) {
      this.askForVideo( cb );
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