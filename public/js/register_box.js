;( function( W ) {
  
  RegisterBox = new Class({
    
    Extends: ObjectWithHandlers,
    
    initialize: function( element_id ) {
      this.parent();
      this.element = $( element_id );
      this.form_fields = this.element.getElements( 'input, textarea' );
      this.submit_button = this.element.getElement( 'button' );
      this._bindElements();
    },
    
    isInputCorrect: function() {
      res = true;
      this.form_fields.each( function( element ) {
        element.removeClass( 'wrong' );
        var check = true;
        if ( element.getProperty( 'required' ) && !element.get( "value" ) ) {
          check = false;
          element.addClass( 'wrong' );
          window.setTimeout( function() {
            element.removeClass( 'wrong' );
          }, 1000 );
        }
        res &= check;
      } );
      
      return res;
    },
    
    getInput: function() {
      res = {};
      this.form_fields.each( function( element ) {
        res[ element.getProperty( 'name' ) ] = element.get( "value" );
      } );
      
      return res;
    },
    
    focus: function() {
      this.form_fields[ 0 ].focus();
    },
    
    submit: function () {
      if ( this.isInputCorrect() ) {
        this.callHandlersFor( 'register', this.getInput() );
      }
    },
    
    _bindElements: function() {
      var self = this;
      if ( this.submit_button !== null ) {
        this.submit_button.addEvent( 'click', function() {
          self.submit.call( self );
        } );
      }
      this.form_fields.each( function( element ) {
        element.addEvent( 'keypress', function( e ) {
          if ( e.key !== undefined && e.key == 'enter' ) {
            self.submit.call( self );
          }
        } );
      } );
    }
  });
  
  W.RegisterBox = RegisterBox;
  
} )( window );