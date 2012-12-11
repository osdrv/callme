;( function( W ) {
  
  var VideoBox = new Class({
    
    Extends: ObjectWithHandlers,
    
    initialize: function( videos ) {
      this.parent();
      this.self_video = $( videos.self );
      this.paired_video = $( videos.paired );
      this.self_stream = null;
      this.self_stream_url = null;
      this.initUserMedia();
    },
    
    initUserMedia: function() {
      var self = this;
      navigator.getUserMedia({ video: true, audio: true }, function( stream ) { 
        self.self_stream_url = W.URL.createObjectURL( stream );
        self.self_video.set( 'src', self.self_stream_url );
        self.self_stream = stream;
        self.callHandlersFor( 'inited', self.self_stream );
      }, function( error ) {
        self.callHandlersFor( 'error', error );
      });
    },
    
    playPairedVideo: function( src ) {
      self.paired_video.set( 'src', src );
      self.paired_video.play();
    },
    
    stopPairedVideo: function() {
      self.paired_video.stop();
    }
    
  });
  
  W.VideoBox = VideoBox;
} )( window );