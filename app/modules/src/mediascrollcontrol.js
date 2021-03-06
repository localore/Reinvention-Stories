(function( exports ) {

  function scale( value, fromLow, fromHigh, toLow, toHigh ) {
    return ( value - fromLow ) * ( toHigh - toLow ) /
            ( fromHigh - fromLow ) + toLow;
  }

  function delta( e ) {
    var dlt, abs;

    // "wheel" events appear to inverse the delta
    if ( e.type === "wheel" ) {
      dlt = e.deltaY;
      abs = Math.abs( e.deltaY );

      if ( e.deltaY < 0 ) {
        dlt += abs * 2;
      } else {
        dlt -= abs * 2;
      }
      return dlt;
    }

    return e.wheelDeltaY;
  }

  function Scrollable( container, media ) {
    if ( !(this instanceof Scrollable) ) {
      return new Scrollable( container, media );
    }
    // Initialize |last| at -1
    this.last = -1;

    this.container = container.nodeType ?
      container : document.getElementById( container );

    // |media| accepts either a provided element
    // or string selector.
    this.media = media.nodeType ?
      selector : document.getElementById( media );

    // If |media| is not found or is an invalid
    // DOM node, then thrhow-nothing we can do with this.
    if ( !this.media || this.media.nodeType !== 1 ) {
      throw new Error( "Cannot find node matching " + media );
    }

    // "wheel" is the new Gecko event
    [ "wheel", "mousewheel" ].forEach(function( type ) {
      this.container.addEventListener( type, this.handler.bind( this ), false );
    }, this);
  }

  // |handler| is |this| bound to the Scrollable instance, not the
  // node dispatching the event.
  Scrollable.prototype.handler = function( event ) {
    var media, scaled;

    media = this.media;
    scaled = Math.round(
      scale( delta( event ), -120, 120, -10, 10 )
    );

    // Defaulting to |scaled| - 1 intentionally causes the following
    // condition to evaluate false;
    this.last = this.last === -1 ? scaled - 1 : this.last;


    // If |scaled| hasn't changed, then there is no reason to
    // update the media's playbackRate or currentTime
    if ( scaled === this.last ) {
      return;
    }

    // If the scaled value is greater then 0, we're going
    // forward. playbackRate is bumped
    if ( scaled > 0 ) {
      if ( media.paused ) {
        media.play();
      }

      media.playbackRate += 0.20;
    }

    // 0 is the center value. If the mousewheel is at 0
    // then we set playbackRate to 0 and pause the media
    // this will allow users to click on "elements"
    // presented on the video surface.
    if ( scaled === 0 ) {
      media.playbackRate = 1;
      media.pause();
    }

    // If the scaled value is less then 0, we're going
    // backward. playbackRate is non-functional in reverse,
    // so we fake it with currentTime. If the media is playing,
    // pause it to avoid the stutter effect.
    if ( scaled < 0 ) {
      if ( !media.paused ) {
        media.pause();
      }
      // media.currentTime -= 0.15;
      media.currentTime -= 0.05;
    }

    this.last = scaled;
  };

  exports.Scrollable = Scrollable;

  if ( typeof define === "function" &&
      define.amd && define.amd.Scrollable ) {
    define( "scrollable", [], function () { return Scrollable; } );
  }

}( this ));
