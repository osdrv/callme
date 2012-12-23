;( function( W ) {
  
  var ContactsBox = new Class({
    
    Implements: [Events, Options],
    
    options: {
      template: "<li class='#{status}'><a title='Позвонить' href='##{uuid}'>#{name}</a></li>"
    },
    
    initialize: function( element_id, options ) {
      var self = this;
      this.setOptions( options );
      this.element = $( element_id );
      this.list = this.element.getElement( 'ul' );
      this.list.addEvent( 'click:relay(a)', function( e, t ) {
        e.preventDefault();
        var uuid = t.get( 'href' ).replace( '#', '' );
        self.fireEvent( 'contact.selected', self.users[ uuid ] );
      } );
    },
    
    proceed: function( data ) {
      if ( data !== undefined && data !== null ) {
        switch ( data.status ) {
          case 'refresh':
            this.clearList();
            this.setContactList( data.sessions );
            break;
        }
      }
    },
    
    clearList: function() {
      this.list.empty();
    },
    
    setContactList: function( users ) {
      var self = this;
      this.list.empty();
      this.users = users;
      Object.each( users, function( user ) {
        var user_data = user.session.data(),
            user_name,
            user_uuid = user.session.getSSID();
        if ( is_empty( user_uuid ) ) return;
        user_name = is_empty( user_data ) ? user_uuid : user_data[ 'name' ];
        self.addContact( { status: 'online', uuid: user_uuid, name: user_name } );
      } );
    },
    
    addContact: function( contact ) {
      var li = tmpl( this.options.template, contact );
      this.list.set( 'html', this.list.get( 'html' ) + li );
    }
    
  });
  
  W.ContactsBox = ContactsBox;
  
} )( window );