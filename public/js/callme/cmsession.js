;( function( W ) {
  
  var CMSession = new Class({
    
    Implements: [ Events, Options ],
    
    initialize: function( data ) {
      this.setSSID( data.uuid );
      this.data( data.user_data );
    },
    
    setSSID: function( ssid ) {
      this.ssid = ssid;
    },
    
    getSSID: function() {
      return this.ssid;
    },
    
    data: function( data ) {
      if ( undefined === data ) {
        return this._data;
      } else {
        this._data = data;
      }
    }
  });
  
  W.CMSession = CMSession;
  
} )( window );