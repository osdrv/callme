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
  
  describe( "CM.is_func", function() {
    
    it( "Should be defined", function() {
      expect( CM.is_func ).toBeDefined();
    } );
    
    it( "Should return true if arg is anonimous function", function() {
      expect( CM.is_func( function() {} ) ).toBeTruthy();
    } );
    
    it( "Should return true if arg is predefined function", function() {
      var f1 = function() {};
      expect( CM.is_func( f1 ) ).toBeTruthy();
    } );
    
    it( "Should return false othewise", function() {
      var args = [ null, undefined, "", [], {}, 1, 1.0, false, new RegExp(''), new Array(), new Object() ];
      for ( var i = 0, l = args.length; i < l; i++ ) {
        expect( CM.is_func( args[ i ] ) ).toBeFalsy();
      }
    } );
    
  } );
  
} );