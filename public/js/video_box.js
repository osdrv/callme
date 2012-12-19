;( function( W ) {
  
  var VIDEO_TMPL = '<video src="#{src}" width=#{width} height=#{height} autoplay="true"></video>',
      SELF_VIDEO_SIZE = { w: 320, h: 230 },
      PAIRED_VIDEO_SIZE = { w: 640, h: 480 };
  
  var VideoBox = new Class({
    
    Extends: ObjectWithHandlers,
    
    initialize: function( videos ) {
      this.parent();
      this.self_video = $( videos.self );
      this.paired_video = $( videos.paired );
      this.self_stream = null;
      this.self_stream_url = null;
    },
    
    initUserMedia: function() {
      var self = this;
      navigator.getUserMedia({ video: true, audio: true }, function( stream ) { 
        self.self_stream_url = W.URL.createObjectURL( stream );
        self.self_video.set( 'html', tmpl( VIDEO_TMPL, {
          width: SELF_VIDEO_SIZE.w,
          height: SELF_VIDEO_SIZE.h,
          src: self.self_stream_url
        } ) );
        self.self_stream = stream;
        self.callHandlersFor( 'inited', self.self_stream );
      }, function( error ) {
        self.callHandlersFor( 'error', error );
      });
    },
    
    playSelfVideo: function( src ) {
      this.stopVideo( this.self_video );
      this.startVideo( this.self_video, {
        width: SELF_VIDEO_SIZE.w,
        height: SELF_VIDEO_SIZE.h,
        src: src
      } );
    },
    
    stopSelfVideo: function() {
      this.stopVideo( this.self_video );
    },
    
    playPairedVideo: function( src ) {
      this.stopVideo( this.paired_video );
      this.startVideo( this.paired_video, {
        width: PAIRED_VIDEO_SIZE.w,
        height: PAIRED_VIDEO_SIZE.h,
        src: src
      } );
    },
    
    stopPairedVideo: function() {
      this.stopVideo( this.paired_video );
    },
    
    startVideo: function( video, params ) {
      video.set( 'html', tmpl( VIDEO_TMPL, params ) );
    },
    
    stopVideo: function( video ) {
      var video_element = video.getElement( 'video' );
      if ( video_element !== null ) {
        video_element.stop();
        video_element.set( 'src', '' );
      }
      video.empty();
    }
  });
  
  W.VideoBox = VideoBox;
} )( window );