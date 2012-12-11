;( function( W ) {
  
  var ContactsBox = new Class({
    
    Extends: ObjectWithHandlers,
    
    defaults: {
      template: "<li class='#{status}'><span>■</span><a title='Make a call' href='##{uuid}'>#{name}</a></li>"
    },
    
    initialize: function( element_id, options ) {
      this.parent();
      var self = this;
      this.options = Object.merge( this.defaults, options );
      this.element = $( element_id );
      this.list = this.element.getElement( 'ul' );
      this.list.addEvent( 'click:relay(a)', function( e, t ) {
        e.preventDefault();
        var uuid = t.get( 'href' ).replace( '#', '' );
        self.callHandlersFor.call( self, 'contact.selected', uuid );
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
    
    setContactList: function( sessions ) {
      var self = this;
      sessions.each( function( session ) {
        // try {
          data = JSON.parse( session );
          if ( !is_empty( data ) && !is_empty( data.uuid ) && !is_empty( data.user_data.name ) ) {
            self.addContact({ status: 'online', uuid: data.uuid, name: data.user_data.name });
          }
        // } catch ( e ) {
          // console.log( 'ContactsBox.setContactList: Malformed data given' );
        // }
      } )
    },
    
    addContact: function( contact ) {
      var li = tmpl( this.options.template, contact );
      this.list.set( 'html', this.list.get( 'html' ) + li );
    }
    
    
  });
  
  W.ContactsBox = ContactsBox;
  
} )( window );