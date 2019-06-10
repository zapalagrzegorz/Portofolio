/* globals getDebouncer */

document.addEventListener("DOMContentLoaded", function mainThread() {
  const options = {
    root: null,
    rootMargin: "0px 0px -100px 0px",
    threshold: 0.0
  };

  const observePicturesOptions = {
    threshold: [0, 0.65],
    rootMargin: "0px 0px -40% 0px"
  };

  let isChangingColorFunAttached = false;

  const exposingBlock = document.querySelector(".exposition__img-container-js");
  const randomStartingColorOffset = Math.random() * 300;
  const imageContainer = document.querySelector(".exposition__img-js");

  function changeColor() {
    const exposingTopOffset = exposingBlock.getBoundingClientRect().y;

    const hue =
      Math.floor(Math.abs(exposingTopOffset) / 15) + randomStartingColorOffset;
    const color = `hsl(${hue}, 59%, 27%)`;
    exposingBlock.style.backgroundColor = color;
  }

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
    } else if (entry.intersectionRatio > 0.7) {
      imageTarget.classList.add("fadedOut");
    }
  }

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

  function pictureIntersectionCb(entries) {
    entries.forEach(changePictureCb);
  }

  const observerExposition = new IntersectionObserver(
    expositionInterSectionCb,
    options
  );

  const sectionwithPicture = document.querySelector(".exposition__item");
  const secondSectionWithPicture = document.querySelectorAll(
    ".exposition__item"
  )[1];

  const observerPictures = new IntersectionObserver(
    pictureIntersectionCb,
    observePicturesOptions
  );

  observerPictures.observe(sectionwithPicture);
  observerPictures.observe(secondSectionWithPicture);

  const target = document.querySelector(".exposition__img-container-js");
  observerExposition.observe(target);

  window.addEventListener("scroll", getDebouncer(changeColor));
});
