// console.log('another-file.js file loaded');
/* eslint-disable no-unused-vars */

// https://gomakethings.com/debouncing-your-javascript-events/

/**
 *  * @param  {Function} fn The function to debounce
 */

const getDebouncer = function getDebouncer(fn, ...args) {
  // Setup a timer
  let timeout;

  // Return a function to run debounced
  return function getDebouncerClosure() {
    // Setup the arguments
    // var context = this;
    const arg = args;

    // If there's a timer, cancel it
    if (timeout) {
      window.cancelAnimationFrame(timeout);
    }

    // Setup the new requestAnimationFrame()
    timeout = window.requestAnimationFrame(function animationFrameCb() {
      fn.apply(this, arg);
    });
  };
};

// window.addEventListener('scroll', getDebouncer(log));
