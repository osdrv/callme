;( function( W ) {
  
  ControlBox = new Class({
    Implements: [ Events ],
    
    initialize: function( element_id ) {
      this.element = $( element_id );
      this._bindElements();
    },
    
    _bindElements: function() {
      var hangup,
          self = this;
      if ( hangup = this.element.getElement( '.hangup' ) ) {
        hangup.addEvent( 'click', function( e ) {
          e.preventDefault();
          self.fireEvent( 'hangup' );
        } );
      }
    },
    
    appear: function() {
      this.element.removeClass( 'hide' ).addClass( 'appear' );
      this.fireEvent( 'appear' );
    },
    
    disappear: function() {
      this.element.removeClass( 'appear' ).addClass( 'hide' );
      this.fireEvent( 'disappear' );
    }
  });
  
  W.ControlBox = ControlBox;
  
} )( window );