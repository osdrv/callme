;( function( W ) {
  var IncommingBox = new Class({
    
    Implements: [ Events ],
    
    initialize: function( element_id ) {
      this.callbacks = {};
      this.element = $( element_id );
      this._bindButtons();
      var self = this;
      this.addEvent( 'response', function( kind ) {
        if ( !is_empty( kind ) && !is_empty( self.callbacks[ kind ] ) ) {
          self.callbacks[ kind ].call( self );
        }
      } )
    },
    
    incomming: function( callee, answer, reject ) {
      this.element.getElement( '.callee' ).set( { text: callee } );
      this.callbacks[ "answer" ] = answer;
      this.callbacks[ "reject" ] = reject;
      this.appear();
    },
    
    appear: function() {
      this.element.removeClass( 'hide' ).addClass( 'appear' );
      this.fireEvent( 'appear' );
    },
    
    disappear: function() {
      this.element.removeClass( 'appear' ).addClass( 'hide' );
      this.fireEvent( 'disappear' );
    },
    
    proceed: function( data, answer, reject ) {
      var callee = this._getCallee( data );
      if ( callee === null ) {
        console.error( "incomming.proceed: callee is null" );
        return;
      }
      var callee_name = callee.name || callee.uuid;
      this.incomming( callee_name, answer, reject );
    },
    
    _bindButtons: function() {
      var self = this;
      this.element.getElement( '.answer' ).addEvent( 'click', function( e ) {
        e.preventDefault();
        self.fireEvent( 'response', 'answer' );
      } );
      this.element.getElement( '.reject' ).addEvent( 'click', function( e ) {
        e.preventDefault();
        self.fireEvent( 'response', 'reject' );
      } );
    },
    
    _getCallee: function( data ) {
      console.log( data )
      try {
        var callee = JSON.parse( data );
      } catch ( e ) {
        console.error( 'Malformed data received.' );
        console.error( e );
        
        return null;
      }
      
      return callee;
    }
    
  });
  
  W.IncommingBox = IncommingBox;
} )( window );