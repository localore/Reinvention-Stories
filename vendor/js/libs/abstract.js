;(function( exports ) {

  var Abstract;

  // Abstract operations
  Abstract = {
    // [[Put]] props from dictionary onto |this|
    // MUST BE CALLED FROM WITHIN A CONSTRUCTOR:
    //  Abstract.put.call( this, dictionary );
    put: function( dictionary ) {
      // For each own property of src, let key be the property key
      // and desc be the property descriptor of the property.
      Object.getOwnPropertyNames( dictionary ).forEach(function( key ) {
        this[ key ] = dictionary[ key ];
      }, this);
    },
    // Shims ES6 Object.assign()
    assign: function( O, dictionary ) {
      dictionary = dictionary || {};

      Abstract.put.call( O, dictionary );

      return O;
    },
    merge: function( target ) {
      return [].slice.call( arguments, 1 ).reduce(function( initial, obj ) {
        return Abstract.assign( initial, obj );
      }, target);
    },
    // Shims ES6 Object.mixin()
    mixin: function( receiver, supplier ) {
      return Object.keys( supplier ).reduce(function( receiver, property ) {
        return Object.defineProperty(
          receiver, property, Object.getOwnPropertyDescriptor( supplier, property )
        );
      }, receiver );
    }
  };

  exports.Abstract = Abstract;

  if ( typeof define === "function" &&
      define.amd && define.amd.Abstract ) {
    define( "abstract", [], function () { return Abstract; } );
  }
}(this));
