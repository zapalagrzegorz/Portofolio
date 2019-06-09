/* globals getDebouncer */

document.addEventListener("DOMContentLoaded", function() {
  // set up observer
  //   var percentTreshold = [...new Array(100)].map(
  //     (value, index) => (index + 1) / 100
  //   );
  //   var percentTreshold2 = [0.01, 0.02, 0.03, 0.04];
  //   var basedHue = 119;

  var options = {
    root: null,
    rootMargin: "0px 0px -100px 0px",
    threshold: 0.0
  };

  var observePicturesOptions = {
    threshold: 0
  };
  //   observers[i] = new IntersectionObserver(intersectionCallback, observerOptions);
  //   observers[i].observe(document.querySelector("#" + boxID));

  var isChangingColorFunAttached = false;

  var exposingBlock = document.querySelector(".exposition__img-container-js");
  var randomStartingColorOffset = Math.random() * 300;

  function changeColor() {
    var exposingTopOffset = exposingBlock.getBoundingClientRect().y;

    var hue =
      Math.floor(Math.abs(exposingTopOffset) / 15) + randomStartingColorOffset;
    var color = `hsl(${hue}, 59%, 27%)`;
    exposingBlock.style.backgroundColor = color;
  }

  function changePictureCb(entry) {
    if (entry.isIntersecting && entry.target.dataset.picture) {
      document
        .querySelector(".exposition__img-js")
        .setAttribute("src", entry.target.dataset.picture);
    }
  }

  var callback = function(entries, observer) {
    function entryIntersectionCb(entry) {
      if (!isChangingColorFunAttached) {
        window.addEventListener("scroll", getDebouncer(changeColor));

        isChangingColorFunAttached = true;
      }
      // Each entry describes an intersection change for one observed
      // target element:
      //   entry.boundingClientRect
      var box = entry.target;
      //   entry.boundingClientRect;
      requestIdleCallback(
        function() {
          entry;
          if (entry.isIntersecting) {
            box.classList.add("exposition__img-container--visible");
          } else {
            box.classList.remove("exposition__img-container--visible");
          }
          //   var color = `hsl(${Math.floor(
          //     entry.intersectionRatio * 100 * 3 + basedHue
          //   )}, 59%, 27%)`;
          //   box.style.backgroundColor = color;
        },
        { timeout: 1000 }
      );

      //   entry.intersectionRect
      //   entry.isIntersecting
      //   entry.rootBounds
      //   entry.target
      //   entry.time
    }

    entries.forEach(entryIntersectionCb);
  };

  var pictureIntersectionCb = function(entries, observer) {
    entries.forEach(changePictureCb);
  };

  var observerExposition = new IntersectionObserver(callback, options);
  //   var observerPictures = new IntersectionObserver(
  //     pictureIntersectionCb,
  //     observePicturesOptions
  //   );

  var sectionwithPicture = document.querySelector(".exposition__item");
  //   .forEach(function(element) {
  //     var observerPictures = new IntersectionObserver(
  //       pictureIntersectionCb,
  //       observePicturesOptions
  //     );
  //     observerPictures.observe(element);
  //   });

  var observerPictures = new IntersectionObserver(
    pictureIntersectionCb,
    observePicturesOptions
  );

  observerPictures.observe(sectionwithPicture);


  var observerPictures2 = new IntersectionObserver(
    pictureIntersectionCb,
    observePicturesOptions
  );

  observerPictures2.observe(document.querySelectorAll('.exposition__item')[1]);
  // observe section with picture

  var target = document.querySelector(".exposition__img-container-js");
  observerExposition.observe(target);

  //   observePicturesOptions;
});
// on visible
// change background by percent 1% +10 HUE, S, i L zostają takie same

// document.addEventListener('click', function (event) {
// 	if (!event.target.matches('#click-me')) return;
// 	alert('You clicked me!');
// }, false);
