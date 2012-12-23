;( function( W ) {
  var CMUser = new Class({
    
    Implements: [ Events, Options ],
    
    initialize: function( options ) {
      this.setOptions( options );
      this.session = null;
      this.transport = null;
      this.stream = null;
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
    
    incomming: function( client ) {
      this.fireEvent( 'incomming', client );
    },
    
    answer: function( client ) {
      this.transport.answerTo( this.getSession(), client.getSession() );
      this.fireEvent( 'answered', client );
    },
    
    reject: function( client ) {
      this.transport.rejectTo( this.getSession(), client.getSession() );
      this.fireEvent( 'rejected', client );
    },
    
    hangup: function() {
      this.fireEvent( 'hanged_up', client );
    },
    
    cancel: function() {
      this.fireEvent( 'canceled', client );
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