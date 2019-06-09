// console.log('another-file.js file loaded');
/* eslint-disable no-unused-vars */

// https://gomakethings.com/debouncing-your-javascript-events/

/**
 *  * @param  {Function} fn The function to debounce
 */

var getDebouncer = function(fn) {
  // Setup a timer
  var timeout;

  // Return a function to run debounced
  return function() {
    // Setup the arguments
    // var context = this;
    var args = arguments;

    // If there's a timer, cancel it
    if (timeout) {
      window.cancelAnimationFrame(timeout);
    }

    // Setup the new requestAnimationFrame()
    timeout = window.requestAnimationFrame(function() {
      fn.apply(this, args);
    });
  };
};

// window.addEventListener('scroll', getDebouncer(log));
