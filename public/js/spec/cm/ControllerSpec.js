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

} );