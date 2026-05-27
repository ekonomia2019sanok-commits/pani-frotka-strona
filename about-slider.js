const selectedWorksFolderApi = "https://api.github.com/repos/ekonomia2019sanok-commits/pani-frotka-strona/contents/wybrane%20realizacje?ref=main";
const fallbackWorks = [
  {
    image: "zdjecia-produktow/breloki/BRE_1.jpg",
    title: "Brelok handmade"
  },
  {
    image: "zdjecia-produktow/breloki/BRE_2.jpg",
    title: "Mały dodatek na prezent"
  },
  {
    image: "zdjecia-produktow/breloki/BRE_3.jpg",
    title: "Brelok z personalizacją"
  }
];

const sliderTrack = document.querySelector("[data-work-slider]");
const sliderPrev = document.querySelector("[data-slider-prev]");
const sliderNext = document.querySelector("[data-slider-next]");
let sliderTimer;

function titleFromFilename(filename) {
  return filename
    .replace(/\.(jpe?g|png|webp)$/i, "")
    .replace(/[-_]+/g, " ")
    .trim() || "Realizacja handmade";
}

function createSlide(work) {
  const figure = document.createElement("figure");
  figure.className = "work-slide";

  const image = document.createElement("img");
  image.src = work.image;
  image.alt = work.title ? `${work.title} Pani-frotka` : "Realizacja handmade Pani-frotka";
  image.loading = "lazy";

  const caption = document.createElement("figcaption");
  caption.textContent = work.title || "Realizacja handmade";

  figure.append(image, caption);
  return figure;
}

function renderWorks(works) {
  if (!sliderTrack) {
    return;
  }

  sliderTrack.innerHTML = "";
  works.forEach((work) => sliderTrack.appendChild(createSlide(work)));
  startAutoSlider();
}

async function loadSelectedWorks() {
  if (!sliderTrack) {
    return;
  }

  try {
    const response = await fetch(selectedWorksFolderApi, { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Folder is not available yet");
    }

    const files = await response.json();
    const works = files
      .filter((file) => file.type === "file" && /\.(jpe?g|png|webp)$/i.test(file.name))
      .sort((a, b) => a.name.localeCompare(b.name, "pl", { numeric: true }))
      .map((file) => ({
        image: encodeURI(file.path),
        title: titleFromFilename(file.name)
      }));

    renderWorks(works.length ? works : fallbackWorks);
  } catch (error) {
    renderWorks(fallbackWorks);
  }
}

function slideWorks(direction) {
  if (!sliderTrack) {
    return;
  }

  const firstSlide = sliderTrack.querySelector(".work-slide");
  const slideWidth = firstSlide ? firstSlide.getBoundingClientRect().width + 18 : 320;
  const maxScroll = sliderTrack.scrollWidth - sliderTrack.clientWidth;

  if (maxScroll <= 0) {
    return;
  }

  if (direction > 0 && sliderTrack.scrollLeft >= maxScroll - 8) {
    sliderTrack.scrollTo({
      left: 0,
      behavior: "smooth"
    });
    return;
  }

  if (direction < 0 && sliderTrack.scrollLeft <= 8) {
    sliderTrack.scrollTo({
      left: maxScroll,
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
  if (!sliderTrack || sliderTrack.children.length < 2) {
    return;
  }

  stopAutoSlider();
  sliderTimer = window.setInterval(() => slideWorks(1), 3500);
}

function stopAutoSlider() {
  if (sliderTimer) {
    window.clearInterval(sliderTimer);
    sliderTimer = null;
  }
}

sliderPrev?.addEventListener("click", () => {
  slideWorks(-1);
  startAutoSlider();
});

sliderNext?.addEventListener("click", () => {
  slideWorks(1);
  startAutoSlider();
});

sliderTrack?.addEventListener("mouseenter", stopAutoSlider);
sliderTrack?.addEventListener("mouseleave", startAutoSlider);
sliderTrack?.addEventListener("focusin", stopAutoSlider);
sliderTrack?.addEventListener("focusout", startAutoSlider);

loadSelectedWorks();
