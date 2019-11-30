/* globals getDebouncer */

document.addEventListener("DOMContentLoaded", function mainThread() {


  let isChangingColorFunAttached = false;

  const colorfulBlock = document.querySelector(".exposition__img-container-js");
  const imageContainer = document.querySelector(".exposition__img-js");
  const sectionsWithPicture = document.querySelectorAll(".exposition__item");
  const expostionHeader = document.querySelectorAll('.exposition__header');
  
  const observeExpositionOptions = {
    root: null,
    rootMargin: "0px 0px -100px 0px",
    threshold: 0.0
  };

  const observePicturesOptions = {
    threshold: [0],
    rootMargin: "-25% 0px -25% 0px"
  };
  
  const randomStartingColorOffset = Math.random() * 300;

  /* change color of colorful block */
  function changeColor() {
    const exposingTopOffset = colorfulBlock.getBoundingClientRect().y;

    const hue =
      Math.floor(Math.abs(exposingTopOffset) / 15) + randomStartingColorOffset;
    const color = `hsl(${hue}, 59%, 27%)`;
    colorfulBlock.style.backgroundColor = color;
  }

  /* cb dla obserwatora ekspozycji */
  function expositionInterSectionCb(entries) {
    function entryIntersectionCb(entry) {
      if (!isChangingColorFunAttached) {
        isChangingColorFunAttached = true;
      }
      const box = entry.target;
      requestIdleCallback(
        function requestCb() {
          if (entry.isIntersecting) {
            box.classList.add("exposition__img-container--visible");
          } else {
            box.classList.remove("exposition__img-container--visible");
          }
        },
        { timeout: 1000 }
      );
    }

    entries.forEach(entryIntersectionCb);
  }

  /* cb dla obserwatora zdjęć  */
  function pictureIntersectionCb(entries) {

    /* internal callback  */
    function changePictureCb(entry) {
      const imageTarget = document.querySelector(".exposition__img-js");
      if (
        entry.isIntersecting &&
        entry.intersectionRatio < 0.8 &&
        entry.target.dataset.picture &&
        imageContainer.getAttribute("src") !== entry.target.dataset.picture
      ) {
        imageTarget.classList.remove("fadedOut");
        imageTarget.classList.toggle("fadeIn");
        imageTarget.classList.toggle("fadeIn2");
        imageTarget.setAttribute("src", entry.target.dataset.picture);
      } else if (!entry.isIntersecting || entry.intersectionRatio > 0.7) {
        imageTarget.classList.add("fadedOut");
      }
    }

    entries.forEach(changePictureCb);
  }

  /* obserwator 'ekspozycji */
  const observerExposition = new IntersectionObserver(
    expositionInterSectionCb,
    observeExpositionOptions
  );

  /* obserwator 'zdjęć */
  const observerPictures = new IntersectionObserver(
    pictureIntersectionCb,
    observePicturesOptions
  );

  /* dodaj każdą sekcję ze zdjęciem do obserwatora 'zdjęć' */
  sectionsWithPicture.forEach(section => observerPictures.observe(section));
  
  /* dodaj nagłówki sekcji do obserwatora - aby czyścić zdjecie przy nagłówkach */
  expostionHeader.forEach(section => observerPictures.observe(section));
 
  
  /* obserwator ekspozycji obserwuje 'ekspozycję' */
  observerExposition.observe(colorfulBlock);

  window.addEventListener("scroll", getDebouncer(changeColor));
});

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

/**
 * Element.matches() polyfill (simple version)
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
 */
if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}