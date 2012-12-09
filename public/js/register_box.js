;( function( W ) {
  
  RegisterBox = new Class({
    
    initialize: function( element_id ) {
      this.element = document.id( element_id );
      this.form_fields = this.element.getElements( 'input, textarea' );
      this.submit_button = this.element.getElement( 'button' );
      this._bindElements();
    },
    
    _bindElements: function() {
      if ( this.submit_button !== null ) {
        this.submit_button.addEvent( 'click', function() {
          
        } );
      }
    }
  });
  
  W.RegisterBox = RegisterBox;
} )( window );