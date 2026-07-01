/*
  LITTLE OMMANI PAPERIE — SNIPCART SETTINGS

  Paste your Snipcart *PUBLIC API KEY* between the quotation marks below.
  This key is safe to publish on your website. Never put a Snipcart secret API key here.
*/
window.SnipcartSettings = {
  publicApiKey: "PASTE_YOUR_SNIPCART_PUBLIC_API_KEY_HERE",
  currency: "usd",
  modalStyle: "side",
  loadStrategy: "on-user-interaction",
  version: "3.3.3"
};

/* Official Snipcart loader pattern, kept here so the key only lives in one file. */
(function () {
  var settings = window.SnipcartSettings;
  var version = settings.version || "3.0";
  var timeoutDuration = settings.timeoutDuration || 2750;
  var domain = settings.domain || "cdn.snipcart.com";
  var protocol = settings.protocol || "https";
  var loadCSS = settings.loadCSS !== false;
  var events = ["focus", "mouseover", "touchmove", "scroll", "keydown"];
  var loaded = false;

  function loadSnipcart() {
    if (loaded) return;
    loaded = true;

    var head = document.getElementsByTagName("head")[0];
    var container = document.querySelector("#snipcart");
    var scriptSelector = 'script[src^="' + protocol + '://' + domain + '"][src$="snipcart.js"]';
    var cssSelector = 'link[href^="' + protocol + '://' + domain + '"][href$="snipcart.css"]';

    if (!container) {
      container = document.createElement("div");
      container.id = "snipcart";
      container.setAttribute("hidden", "true");
      document.body.appendChild(container);
    }

    container.dataset.apiKey = settings.publicApiKey;
    if (settings.addProductBehavior) container.dataset.configAddProductBehavior = settings.addProductBehavior;
    if (settings.modalStyle) container.dataset.configModalStyle = settings.modalStyle;
    if (settings.currency) container.dataset.currency = settings.currency;
    if (settings.templatesUrl) container.dataset.templatesUrl = settings.templatesUrl;

    if (!document.querySelector(scriptSelector)) {
      var script = document.createElement("script");
      script.src = protocol + "://" + domain + "/themes/v" + version + "/default/snipcart.js";
      script.async = true;
      head.appendChild(script);
    }

    if (loadCSS && !document.querySelector(cssSelector)) {
      var stylesheet = document.createElement("link");
      stylesheet.rel = "stylesheet";
      stylesheet.type = "text/css";
      stylesheet.href = protocol + "://" + domain + "/themes/v" + version + "/default/snipcart.css";
      head.prepend(stylesheet);
    }

    events.forEach(function (eventName) {
      document.removeEventListener(eventName, loadSnipcart);
    });
  }

  window.LoadSnipcart = loadSnipcart;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      if (settings.loadStrategy === "manual") return;
      if (settings.loadStrategy === "on-user-interaction") {
        events.forEach(function (eventName) {
          document.addEventListener(eventName, loadSnipcart);
        });
        setTimeout(loadSnipcart, timeoutDuration);
      } else {
        loadSnipcart();
      }
    });
  } else {
    if (settings.loadStrategy === "manual") return;
    if (settings.loadStrategy === "on-user-interaction") {
      events.forEach(function (eventName) {
        document.addEventListener(eventName, loadSnipcart);
      });
      setTimeout(loadSnipcart, timeoutDuration);
    } else {
      loadSnipcart();
    }
  }
})();
