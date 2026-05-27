const sliderTrack = document.querySelector("[data-work-slider]");
const sliderPrev = document.querySelector("[data-slider-prev]");
const sliderNext = document.querySelector("[data-slider-next]");
let sliderTimer;

function slideWorks(direction) {
  if (!sliderTrack) {
    return;
  }

  const firstSlide = sliderTrack.querySelector(".work-slide");
  const slideWidth = firstSlide ? firstSlide.getBoundingClientRect().width + 18 : 320;
  const maxScroll = sliderTrack.scrollWidth - sliderTrack.clientWidth;

  if (direction > 0 && sliderTrack.scrollLeft >= maxScroll - 8) {
    sliderTrack.scrollTo({
      left: 0,
      behavior: "smooth"
    });
    return;
  }

  sliderTrack.scrollBy({
    left: direction * slideWidth,
    behavior: "smooth"
  });
}

function startAutoSlider() {
  if (!sliderTrack) {
    return;
  }

  stopAutoSlider();
  sliderTimer = window.setInterval(() => slideWorks(1), 4200);
}

function stopAutoSlider() {
  if (sliderTimer) {
    window.clearInterval(sliderTimer);
  }
}

sliderPrev?.addEventListener("click", () => slideWorks(-1));
sliderNext?.addEventListener("click", () => slideWorks(1));

sliderTrack?.addEventListener("mouseenter", stopAutoSlider);
sliderTrack?.addEventListener("mouseleave", startAutoSlider);
sliderTrack?.addEventListener("focusin", stopAutoSlider);
sliderTrack?.addEventListener("focusout", startAutoSlider);

startAutoSlider();
