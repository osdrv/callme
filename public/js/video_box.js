;( function( W ) {
  
  var VideoBox = new Class({
    
    Extends: ObjectWithHandlers,
    
    initialize: function( videos ) {
      this.parent();
      console.log( videos )
      this.self_video = $( videos.self );
      this.paired_video = $( videos.paired );
      this.stream_url = null;
      this.initUserMedia();
    },
    
    initUserMedia: function() {
      var self = this;
      navigator.getUserMedia({ video: true, audio: true }, function( stream ) { 
        self.stream_url = W.URL.createObjectURL( stream );
        console.log( self.stream_url );
        self.self_video.src = self.stream_url;
        self.callHandlersFor( 'inited', self.stream_url );
      }, function( error ) {
        self.callHandlersFor( 'error', error );
      });
    }
    
  });
  
  W.VideoBox = VideoBox;
} )( window );