/*
 * jQlouds
 * An awesome yet simple plugin for jquery that let's you create clouds on the fly.
 * Copyright (c) 2014 Enrico Deleo - enricodeleo.com
 * Licensed under the MIT license.
 * license url: http://www.opensource.org/licenses/mit-license.php
 */

;(function ($) {

  //we'll need random numbers
  $.extend({
    random: function(X) {
      return Math.floor(X * (Math.random() % 1));
    },
    randomBetween: function(MinV, MaxV) {
      return MinV + $.random(MaxV - MinV + 1);
    }
  });

  // Collection method.
  $.fn.jQlouds = function (options) {
    options = $.extend({}, $.jQlouds.options, options);
    return this.each(function () {
      // retrieve clouds and append to the target element.
      var clouds = $.jQlouds.jQloudsFactory(options, this);

      //do the job against target element
      $(this)
      .addClass('jqlouds-clouds')
      .css({ position: 'relative', minHeight: options.maxHeight + 'px', height: options.skyHeight + 'px' })
      .append(clouds);

      //trigger init if we decided to turn  wind on
      if ( options.wind === true ) {
        $(this).trigger('jqlouds.init', [ $(this) ]);
      }

    });
  };

  // Static method.
  $.jQlouds = function (options) {
    options = $.extend({}, $.jQlouds.options, options);
    return function() {

    };
  };

  // Static method default options.
  $.jQlouds.options = {
    src: '..img/new-cloud.jpg', // path to image
    maxWidth: 300, // max image's width
    maxHeight: 96, // amx image's height
    minClouds: 5, // minimum amount of clouds
    maxClouds: 10, // maximum amount of clouds
    skyHeight: null, // height of the container element
    wind: true // animate clouds, default is false
  };

  $.jQlouds.jQloudsFactory = function(options ,self) {

    var skyHeight;
    var skyWidth = $(self).width();
    var clouds = '';
    var randomClouds = $.randomBetween(options.minClouds, options.maxClouds);

    if ( !options.skyHeight ) {
      skyHeight = $(self).height();
    }
    else {
      skyHeight = options.skyHeight;
    }

    // generate a bunch of clouds as per settings and some randomness
    for (var i = 0; i < randomClouds; i++) {

      var sizeRatio = $.randomBetween(1, 4);
      var cloudHeight = Math.floor(options.maxHeight/sizeRatio);
      var cloudWidth = Math.floor(options.maxWidth/sizeRatio);

      var cloud = $('<img />', {
        class: 'jqlouds-cloud',
        src: options.src,
        height: cloudHeight,
        width: cloudWidth,
      });

      // random position on the target element
      cloud.css({
        position: 'absolute',
        bottom: ( skyHeight * ( '0.' + $.randomBetween(1, 9) + $.randomBetween(1, 9) ) - cloudHeight ) + 'px',
        left: skyWidth * ( '0.' + $.randomBetween(1, 90) ) + 'px'
      });

      //some cloud should be blurred
      if ( $.randomBetween(1, 3) === 1 ) {
        var filterVal = 'blur(3px)';
        cloud
        .addClass('blur')
        .css('filter',filterVal)
        .css('webkitFilter',filterVal)
        .css('mozFilter',filterVal)
        .css('oFilter',filterVal)
        .css('msFilter',filterVal);
      }

      //sometimes clouds are less opaque
      if ( $.randomBetween(1, 3) === 2 ) {
        cloud.css({ opacity: '0.' + $.randomBetween(5, 8) });
      }

      clouds += cloud[0].outerHTML; //append this cloud to the clouds

    }

    return clouds; //returns all clouds

  };

  //events: init is the kickstart animation, wind the recursive one
  $(document).on('jqlouds.init', function(event, element) {
    element.find('img.jqlouds-cloud').each(function() {
      $.jQlouds.jQloudsAnimate($(this));
    });
  });

  $(document).on('jqlouds.wind', function(event, element) {
      $.jQlouds.jQloudsAnimate(element);
  });


  //animation when the first or consecutive wind blows
  $.jQlouds.jQloudsAnimate = function(element) {
      // each element will be moved right or left randomly
      var direction;
      if( $.randomBetween(0, 1) === 0 ) { direction = '+'; } else { direction = '-'; }

      //applying movements
      element
      .delay($.randomBetween(2000, 6000))
      .animate({left: direction + '=' + $.randomBetween(10, 40)}, $.randomBetween(4000, 7000), 'linear', function() {
        $(document).trigger('jqlouds.wind',[ element ]);


    });

  };

}(jQuery));

$('#sky1, #sky2').jQlouds();
