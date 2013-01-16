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
  
  describe( "isFunc", function() {
    
    it( "Should be defined", function() {
      expect( CM.isFunc ).toBeDefined();
    } );
    
    it( "Should return true if arg is anonimous function", function() {
      expect( CM.isFunc( function() {} ) ).toBeTruthy();
    } );
    
    it( "Should return true if arg is predefined function", function() {
      var f1 = function() {};
      expect( CM.isFunc( f1 ) ).toBeTruthy();
    } );
    
    it( "Should return false othewise", function() {
      var args = [ null, undefined, "", [], {}, 1, 1.0, false, new RegExp(''), new Array(), new Object() ];
      for ( var i = 0, l = args.length; i < l; i++ ) {
        expect( CM.isFunc( args[ i ] ) ).toBeFalsy();
      }
    } );
    
  } );
  
  describe( "isEmpty", function() {
    
    it( "Should be defined", function() {
      expect( CM.isEmpty ).toBeDefined();
    } );
    
    it( "Should return true for 0", function() {
      expect( CM.isEmpty( 0 ) ).toBeTruthy();
    } );
    
    it( "Should return true for 0.0", function() {
      expect( CM.isEmpty( 0.0 ) ).toBeTruthy();
    } );
    
    it( "Should return true for null", function() {
      expect( CM.isEmpty( null ) ).toBeTruthy();
    } );
    
    it( "Should return true for undefined", function() {
      expect( CM.isEmpty( undefined ) ).toBeTruthy();
    } );
    
    it( "Should return true for ''", function() {
      expect( CM.isEmpty( '' ) ).toBeTruthy();
    } );
    
  } );

  describe( "argsToArr", function() {

    it( "Should be defined", function() {
      expect( CM.argsToArr ).toBeDefined();
    } );
    
    it( "Should return right value", function() {
      var arr = [ 1, 2, 3 ],
          flag = false,
          res = null,
          testFunc = function() {
            flag = true;
            res = CM.argsToArr( arguments );
          };
      testFunc.apply( window, arr );
      
      expect( flag ).toBeTruthy();
      expect( res.join( " " ) ).toBe( arr.join( " " ) );
    } );
  } );
  
  describe( "_w", function() {
    it( "Should be defined", function() {
      expect( CM._w ).toBeDefined();
    } );
    
    it( "Should return right value", function() {
      var arr = [ "a", "b", "c" ],
          testStr = "a b c",
          res = CM._w( testStr );

      expect( res instanceof Array ).toBeTruthy;
      expect( res.length ).toBe( 3 );
      expect( arr.join( " " ) ).toBe( res.join( " " ) );
    } );
  } );

  describe( "getUserMedia", function() {
    
    var originalNavigator;

    beforeEach( function() {
      originalNavigator = window.navigator;
      window.navigator = {};
    } );

    afterEach( function() {
      window.navigator = originalNavigator;
    } );

    it( "Should be defined", function() {
      expect( CM.getUserMedia ).toBeDefined();
    } );

    it( "Should be defined in case of generic method", function() {
      navigator.getUserMedia = 1;
      expect( CM.getUserMedia() ).toBe( 1 );
    } );

    it( "Should be defined in case of webkit method", function() {
      navigator.webkitGetUserMedia = 1;
      expect( CM.getUserMedia() ).toBe( 1 );
    } );

    it( "Should be defined in case of mozilla method", function() {
      navigator.mozGetUserMedia = 1;
      expect( CM.getUserMedia() ).toBe( 1 );
    } );

    it( "Should be defined in case of msie method", function() {
      navigator.msGetUserMedia = 1;
      expect( CM.getUserMedia() ).toBe( 1 );
    } );    
  } );

  describe( "tmpl", function() {

    it( "Should be defined", function() {
      expect( CM.tmpl ).toBeDefined();
    } );

    it( "Should return correct value", function() {
      var testObj = { "a": "b", "c": "d" },
          testTmpl = "<div class=\"#{a}\">#{c}-#{c}:#{c}#{cc}</div>",
          res = CM.tmpl( testTmpl, testObj );
      expect( res ).toBe( "<div class=\"b\">d-d:d</div>" );
    } );

  } );
} );