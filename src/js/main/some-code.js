/* globals getDebouncer */

document.addEventListener("DOMContentLoaded", function() {
  window.addEventListener("scroll", getDebouncer(changeColor));
  var options = {
    root: null,
    rootMargin: "0px 0px -100px 0px",
    threshold: 0.0
  };

  var observePicturesOptions = {
    threshold: [0, 0.65],
    rootMargin: "0px 0px -40% 0px"
  };

  var isChangingColorFunAttached = false;

  var exposingBlock = document.querySelector(".exposition__img-container-js");
  var randomStartingColorOffset = Math.random() * 300;
  var imageContainer = document.querySelector(".exposition__img-js");

  function changeColor() {
    var exposingTopOffset = exposingBlock.getBoundingClientRect().y;

    var hue =
      Math.floor(Math.abs(exposingTopOffset) / 15) + randomStartingColorOffset;
    var color = `hsl(${hue}, 59%, 27%)`;
    exposingBlock.style.backgroundColor = color;
  }

  function changePictureCb(entry) {
	var imageTarget = document.querySelector(".exposition__img-js");
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
	}
	else if(entry.intersectionRatio > 0.7){
		imageTarget.classList.add("fadedOut"); 
	}
  }

  var expositionInterSectionCb = function(entries, observer) {
    function entryIntersectionCb(entry) {
      if (!isChangingColorFunAttached) {
        isChangingColorFunAttached = true;
      }
      var box = entry.target;
      requestIdleCallback(
        function() {
          entry;
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
  };

  var pictureIntersectionCb = function(entries, observer) {
    entries.forEach(changePictureCb);
  };

  var observerExposition = new IntersectionObserver(
    expositionInterSectionCb,
    options
  );

  var sectionwithPicture = document.querySelector(".exposition__item");
  var secondSectionWithPicture = document.querySelectorAll(
    ".exposition__item"
  )[1];

  var observerPictures = new IntersectionObserver(
    pictureIntersectionCb,
    observePicturesOptions
  );

  observerPictures.observe(sectionwithPicture);
  observerPictures.observe(secondSectionWithPicture);

  //   var observerPictures2 = new IntersectionObserver(
  //     pictureIntersectionCb,
  //     observePicturesOptions
  //   );

  //   observerPictures2.observe(secondSectionWithPicture);
  // observe section with picture

  var target = document.querySelector(".exposition__img-container-js");
  observerExposition.observe(target);

  //   observePicturesOptions;
});
