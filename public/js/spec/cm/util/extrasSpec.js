describe( "CM.Util.extras", function() {
  
  describe( "OnEvents", function() {
    
    var Instantiable = new Class({
      Implements: [ OnEvents ]
    }),
    instance;
    
    beforeEach( function() {
      instance = new Instantiable();
    } );
    
    describe( "instance.on", function() {

      it( "Should be defined", function() {
        expect( instance.on ).toBeDefined();
      } );

      it( "Should add event handlers to stack", function() {
        var handler_key = "test_event",
            handler_func = function() {};
        instance.on( handler_key, handler_func );
        expect( instance.$events[ handler_key ] ).toBeDefined();
        expect( instance.$events[ handler_key ] ).toContain( handler_func );
      } );

    } );

    describe( "instance.bang", function() {

      var handler_key = "test_event",
          flag,
          handler_func = function() { flag = true };

      beforeEach( function() {
        instance.on( handler_key, handler_func );
      } );

      it( "Should be defined", function() {
        expect( instance.bang ).toBeDefined();
      } );

      it( "Should call stored handlers", function() {
        flag = false;
        instance.bang( handler_key );
        expect( flag ).toBeTruthy();
      } );
      
    } );
    
  } );
  
} );