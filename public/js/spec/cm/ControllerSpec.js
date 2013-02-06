describe( "CM.Controller", function() {
  
  var controller;
  
  describe( "on", function() {

    it( "Should be defined", function() {
      expect( CM.Controller.on ).toBeDefined();
    } );

    it( "Should return self", function() {
      var testEvent = "test event",
          testArg = "test arg";
      expect( CM.Controller.on( testEvent, testArg ) )
        .toBe( CM.Controller );
    } );

  } );

  describe( "bang", function() {

    it( "Should be defined", function() {
      expect( CM.Controller.bang ).toBeDefined();
    } );

    it( "Should return self", function() {
      var testEvent = "test event",
          testArg = "test arg";
      expect( CM.Controller.bang( testEvent, testArg ) )
        .toBe( CM.Controller );
    } );

    it( "Should call registered handlers with arguments given", function() {
      var i = 0,
          testEvent = "test event",
          testHandler1 = function( k ) {
            i += k * 2;
          },
          testHandler2 = function( k ) {
            i += k * 3;
          };
      CM.Controller
        .on( "test event", testHandler1 )
        .on( "test event", testHandler2 )
        .bang( "test event", 10 );
      expect( i ).toBe( 50 );
    } );

  } );

  describe( "withRouter", function() {
    it( "Should be defined", function() {
      expect( CM.Controller.withRouter ).toBeDefined();
    } );

    it( "Should throw error if argument is not Transport instance", function() {
      var notTransportInstance = {},
          transportInstance = new CM.Transport({});
      expect( function() { CM.Controller.withRouter( notTransportInstance ) } ).toThrow();
      expect( function() { CM.Controller.withRouter( transportInstance ) } ).not.toThrow();
    } );

    it( "Should observe router 'message' event", function() {
      var transport = new CM.Transport({}),
          flag = false;
      CM.Controller.withRouter( transport ).on( "test.event", function() {
        flag = true;
      } );
      transport.bang( "message", { action: 'test.event' } );
      expect( flag ).toBeTruthy();
    } );
  } );

} );