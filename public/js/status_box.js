;( function( W ) {
  
  StatusBox = new Class({
    
    Extends: ObjectWithHandlers,
    
    known_statuses: [ 'online', 'offline', 'connecting' ],
    
    initialize: function( element_id ) {
      this.parent();
      this.element = $( element_id );
      this.user_name = this.element.getElements( '.name' );
      this.status_marker = this.element.getElements( '.user_status' );
      this.status_text = this.element.getElements( '.user_status .text' );
    },
    
    setStatus: function( status ) {
      var self = this;
      this.callHandlersFor( 'status', status );
      this.known_statuses.each( function( klass ) {
        self.status_marker.removeClass( klass );
      } );
      this.status_marker.addClass( status );
      this.status_text.set( 'html', status );
    },
    
    setName: function( name ) {
      this.callHandlersFor( 'name', name );
      this.user_name.set( 'html', name );
    }
    
  });
  
  W.StatusBox = StatusBox;
  
} )( window );