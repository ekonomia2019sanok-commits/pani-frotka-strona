const pageCategoryKey = document.body.dataset.category;
const assetPrefix = "../";

const pageTitle = document.querySelector("#categoryTitle");
const pageDescription = document.querySelector("#categoryDescription");
const seriesGridPage = document.querySelector("#seriesGrid");
const seriesViewPage = document.querySelector("#seriesView");
const galleryViewPage = document.querySelector("#galleryView");
const patternGridPage = document.querySelector("#patternGrid");
const seriesTitlePage = document.querySelector("#seriesTitle");
const backToSeriesPage = document.querySelector("#backToSeries");
const yearPage = document.querySelector("#year");

let pageProducts = {};
let activeSeriesName = "";

if (yearPage) {
  yearPage.textContent = new Date().getFullYear();
}

function pageSeriesEntries(category) {
  return Object.entries(category || {}).filter(([key, value]) => key !== "meta" && key !== "items" && Array.isArray(value));
}

function pageDirectItems(category) {
  return Array.isArray(category?.items) ? category.items : [];
}

function pageTitleFromKey(text) {
  return String(text)
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\p{L}/gu, (letter) => letter.toLocaleUpperCase("pl-PL"));
}

function pageTitleFromFile(filePath) {
  const file = String(filePath).split("/").pop()?.split("\\").pop() || "";
  const withoutExtension = file.replace(/\.[^.]+$/, "");
  const withoutLeadingCode = withoutExtension.replace(/^[A-Za-z]+[_-]?\d*[_-]?\s*/u, "");
  return pageTitleFromKey(withoutLeadingCode || withoutExtension);
}

function pageImagePath(src) {
  if (!src || src.startsWith("http") || src.startsWith("../")) {
    return src;
  }

  return `${assetPrefix}${src}`;
}

function createPageImage(src, alt) {
  const image = document.createElement("img");
  image.src = pageImagePath(src);
  image.alt = alt;
  image.loading = "lazy";
  image.addEventListener("error", () => {
    const placeholder = document.createElement("div");
    placeholder.className = "image-placeholder";
    placeholder.textContent = "♡";
    image.replaceWith(placeholder);
  });
  return image;
}

function renderSeries(category) {
  const meta = category.meta || {};
  const series = pageSeriesEntries(category);
  const directItems = pageDirectItems(category);

  pageTitle.textContent = meta.name || pageTitleFromKey(pageCategoryKey);
  pageDescription.textContent = pageCategoryKey === "torby"
    ? (meta.description || "Wybierz serię, aby zobaczyć dostępne wzory.")
    : (meta.description || "Dostępne produkty pojawią się tutaj.");
  document.title = `${pageTitle.textContent} | Pani-frotka`;
  seriesGridPage.innerHTML = "";

  if (directItems.length || !series.length) {
    renderDirectItems(directItems);
    return;
  }

  series.forEach(([seriesName, products]) => {
    const previewImage = products[0]?.image || meta.image;
    const card = document.createElement("article");
    card.className = "series-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Zobacz serię ${seriesName}`);
    card.innerHTML = `
      <div class="series-card__image"></div>
      <div class="series-card__body">
        <div class="series-card__topline">
          <h3>${seriesName}</h3>
          <span class="card-arrow" aria-hidden="true">→</span>
        </div>
        <p>${products.length} ${products.length === 1 ? "wzór" : "wzorów"}</p>
      </div>
    `;
    card.querySelector(".series-card__image").appendChild(createPageImage(previewImage, seriesName));
    card.addEventListener("click", () => showPageSeries(seriesName));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        showPageSeries(seriesName);
      }
    });
    seriesGridPage.appendChild(card);
  });
}

function renderDirectItems(items) {
  seriesViewPage.hidden = true;
  galleryViewPage.hidden = false;
  seriesTitlePage.textContent = "";
  patternGridPage.innerHTML = "";
  backToSeriesPage.hidden = true;

  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "Produkty w tej kategorii zostaną uzupełnione wkrótce.";
    patternGridPage.appendChild(empty);
    return;
  }

  items.forEach((product) => {
    const title = product.title || pageTitleFromFile(product.image);
    const card = document.createElement("article");
    card.className = "pattern-card";
    card.innerHTML = `
      <div class="pattern-card__image"></div>
      <div class="pattern-card__body">
        <h3>${title}</h3>
      </div>
    `;
    card.querySelector(".pattern-card__image").appendChild(createPageImage(product.image, title));
    patternGridPage.appendChild(card);
  });
}

function showPageSeries(seriesName) {
  activeSeriesName = seriesName;
  const products = pageProducts[seriesName] || [];

  backToSeriesPage.hidden = false;
  seriesViewPage.hidden = true;
  galleryViewPage.hidden = false;
  seriesTitlePage.textContent = seriesName;
  patternGridPage.innerHTML = "";

  products.forEach((product) => {
    const title = product.title || pageTitleFromFile(product.image);
    const card = document.createElement("article");
    card.className = "pattern-card";
    card.innerHTML = `
      <div class="pattern-card__image"></div>
      <div class="pattern-card__body">
        <h3>${title}</h3>
      </div>
    `;
    card.querySelector(".pattern-card__image").appendChild(createPageImage(product.image, title));
    patternGridPage.appendChild(card);
  });

  galleryViewPage.scrollIntoView({ behavior: "smooth", block: "start" });
}

backToSeriesPage?.addEventListener("click", () => {
  seriesViewPage.hidden = false;
  galleryViewPage.hidden = true;
  activeSeriesName = "";
  seriesViewPage.scrollIntoView({ behavior: "smooth", block: "start" });
});

async function loadCategoryPage() {
  try {
    const response = await fetch("../products.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Nie udało się wczytać produktów.");
    }
    const allProducts = await response.json();
    pageProducts = allProducts[pageCategoryKey] || {};
    renderSeries(pageProducts);
  } catch (error) {
    const allProducts = window.PANI_FROTKA_PRODUCTS || {};
    pageProducts = allProducts[pageCategoryKey] || {};

    if (Object.keys(pageProducts).length) {
      renderSeries(pageProducts);
      return;
    }

    pageTitle.textContent = "Kategoria";
    pageDescription.textContent = "Brak produktów do wyświetlenia.";
  }
}

loadCategoryPage();
