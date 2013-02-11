;( function( W ) {
  
  var CM = W.CM = W.CM || {};
  
  CM.Call = new Class({
    
    Implements: [ Events, Options ],
    
    initialize: function( options ) {
      this.setOptions( options );
      this._setupAcceptors();
    },

    _setupAcceptors: function() {
      var self = this;
      [ 'rtcSession', 'uuid', 'userdata' ].each( function( method ) {
        var variable = '_' + method;
        self[ variable ] = null;
        self[ method ] = function( arg ) {
          if ( arg === undefined ) {
            return self[ variable ];
          } else {
            self[ variable ] = arg;
          }
        }
      } );
    }
    
  });
  
} )( window );