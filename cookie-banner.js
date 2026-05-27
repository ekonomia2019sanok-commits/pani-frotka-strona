(function () {
  const consentKey = "paniFrotkaCookieConsent";
  const analyticsId = "G-4XV8VH2ZGF";
  const policyUrl = document.body.dataset.policyPath || "polityka-prywatnosci.html";
  let analyticsLoaded = false;

  function loadGoogleAnalytics() {
    if (analyticsLoaded || analyticsId === "G-XXXXXXXXXX") {
      return;
    }

    analyticsLoaded = true;
    const gaScript = document.createElement("script");
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`;
    document.head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", analyticsId, { anonymize_ip: true });
  }

  function getConsent() {
    try {
      return JSON.parse(localStorage.getItem(consentKey));
    } catch (error) {
      return null;
    }
  }

  function saveConsent(analytics) {
    localStorage.setItem(consentKey, JSON.stringify({
      necessary: true,
      analytics,
      savedAt: new Date().toISOString()
    }));

    if (analytics) {
      loadGoogleAnalytics();
    }

    hideCookieElements();
    showSettingsButton();
  }

  function hideCookieElements() {
    document.querySelector(".cookie-banner")?.remove();
    document.querySelector(".cookie-panel")?.remove();
  }

  function showSettingsButton() {
    if (document.querySelector(".cookie-settings-button")) {
      return;
    }

    const button = document.createElement("button");
    button.className = "cookie-settings-button";
    button.type = "button";
    button.textContent = "Cookies";
    button.addEventListener("click", openSettings);
    document.body.appendChild(button);
  }

  function createBanner() {
    const banner = document.createElement("section");
    banner.className = "cookie-banner";
    banner.setAttribute("aria-label", "Informacja o plikach cookies");
    banner.innerHTML = `
      <div class="cookie-banner__text">
        <strong>Cookies</strong>
        <p>Ta strona wykorzystuje pliki cookies do działania strony oraz anonimowych statystyk odwiedzin.</p>
        <a href="${policyUrl}">Polityka prywatności</a>
      </div>
      <div class="cookie-banner__actions">
        <button class="cookie-button cookie-button--primary" type="button" data-cookie-accept>Akceptuję</button>
        <button class="cookie-button" type="button" data-cookie-reject>Odrzuć</button>
        <button class="cookie-button cookie-button--ghost" type="button" data-cookie-settings>Ustawienia</button>
      </div>
    `;

    banner.querySelector("[data-cookie-accept]").addEventListener("click", () => saveConsent(true));
    banner.querySelector("[data-cookie-reject]").addEventListener("click", () => saveConsent(false));
    banner.querySelector("[data-cookie-settings]").addEventListener("click", openSettings);
    document.body.appendChild(banner);
    requestAnimationFrame(() => banner.classList.add("is-visible"));
  }

  function openSettings() {
    document.querySelector(".cookie-panel")?.remove();
    const current = getConsent();
    const panel = document.createElement("div");
    panel.className = "cookie-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-label", "Ustawienia cookies");
    panel.innerHTML = `
      <div class="cookie-panel__box">
        <button class="cookie-panel__close" type="button" aria-label="Zamknij">×</button>
        <p class="eyebrow">Ustawienia</p>
        <h2>Pliki cookies</h2>
        <p>Niezbędne pliki cookies pomagają stronie działać prawidłowo. Analityczne pomagają sprawdzić, które treści są najczęściej oglądane.</p>
        <label class="cookie-toggle">
          <input type="checkbox" checked disabled>
          <span>Niezbędne cookies</span>
        </label>
        <label class="cookie-toggle">
          <input type="checkbox" data-analytics ${current?.analytics ? "checked" : ""}>
          <span>Analityczne cookies Google Analytics</span>
        </label>
        <div class="cookie-panel__actions">
          <button class="cookie-button cookie-button--primary" type="button" data-save>Zapisz wybór</button>
          <button class="cookie-button" type="button" data-reject>Odrzuć analityczne</button>
        </div>
        <a class="cookie-panel__link" href="${policyUrl}">Przejdź do polityki prywatności</a>
      </div>
    `;

    panel.querySelector(".cookie-panel__close").addEventListener("click", () => panel.remove());
    panel.addEventListener("click", (event) => {
      if (event.target === panel) {
        panel.remove();
      }
    });
    panel.querySelector("[data-save]").addEventListener("click", () => {
      saveConsent(panel.querySelector("[data-analytics]").checked);
    });
    panel.querySelector("[data-reject]").addEventListener("click", () => saveConsent(false));
    document.body.appendChild(panel);
  }

  const savedConsent = getConsent();
  if (savedConsent) {
    if (savedConsent.analytics) {
      loadGoogleAnalytics();
    }
    showSettingsButton();
  } else {
    createBanner();
  }
})();
