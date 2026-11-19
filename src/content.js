/* Hides the AI label in the YouTube video description.
 * No network requests. No data is collected. The only stored value is the on/off switch. */
(function (root) {
  "use strict";

  var STORAGE_KEY = "enabled";
  var MARK = "data-rail-label";

  // Lower-case phrases of the label text, per UI language.
  var PHRASES = [
    "altered or synthetic content",
    "synthetic content",
    "ai-generated",
    "ai generated",
    "made with ai",
    "contenuti alterati o sintetici",
    "contenuto alterato o sintetico",
    "contenuti modificati o sintetici",
    "generato dall'ia",
    "generato con l'ia",
    "generato dall’ia",
    "generato con l’ia",
    "contenido alterado o sintético",
    "contenu modifié ou synthétique",
    "veränderte oder synthetische inhalte"
  ];

  // Areas where the label can appear. Titles and comments are never touched.
  var SCOPE_SELECTOR = [
    "ytd-watch-metadata #description",
    "ytd-structured-description-content-renderer",
    "ytd-video-description-header-renderer",
    "ytd-metadata-row-container-renderer"
  ].join(",");
  var EXCLUDE_SELECTOR = "#title, h1, ytd-comments, #comments";
  var MAX_LABEL_LENGTH = 200;

  function normalize(text) {
    return String(text || "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function isLabelText(text) {
    var t = normalize(text);
    if (!t || t.length > MAX_LABEL_LENGTH) return false;
    return PHRASES.some(function (p) { return t.indexOf(p) !== -1; });
  }

  // Finds the elements to hide inside `container`: the outermost element
  // whose whole text is a label (so no empty box stays behind).
  function findLabels(container) {
    var found = [];
    var all = container.querySelectorAll("*");
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      if (el.hasAttribute(MARK) || el.closest("[" + MARK + "]")) continue;
      if (el.closest(EXCLUDE_SELECTOR)) continue;
      if (!isLabelText(el.textContent)) continue;
      var target = el;
      while (
        target.parentElement &&
        target.parentElement !== container &&
        isLabelText(target.parentElement.textContent) &&
        !target.parentElement.matches(EXCLUDE_SELECTOR) &&
        !target.parentElement.matches("ytd-watch-metadata, ytd-watch-flexy, body")
      ) {
        target = target.parentElement;
      }
      found.push(target);
    }
    return found;
  }

  function scan(doc) {
    var scopes = doc.querySelectorAll(SCOPE_SELECTOR);
    var count = 0;
    for (var i = 0; i < scopes.length; i++) {
      var labels = findLabels(scopes[i]);
      for (var j = 0; j < labels.length; j++) {
        labels[j].setAttribute(MARK, "");
        count++;
      }
    }
    return count;
  }

  var api = { isLabelText: isLabelText, findLabels: findLabels, scan: scan, STORAGE_KEY: STORAGE_KEY };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (!root.document) return;

  // ---- Browser part ----
  var doc = root.document;
  var scheduled = false;

  function setEnabled(value) {
    doc.documentElement.setAttribute("data-rail-enabled", value ? "true" : "false");
  }

  function scheduleScan() {
    if (scheduled) return;
    scheduled = true;
    var run = function () { scheduled = false; scan(doc); };
    if (root.requestAnimationFrame) root.requestAnimationFrame(run); else setTimeout(run, 50);
  }

  function start() {
    // Marking is always on. CSS decides if the mark hides anything.
    // This way, switching off shows the label again without a reload.
    new MutationObserver(scheduleScan).observe(doc.documentElement, {
      childList: true, subtree: true, characterData: true
    });
    doc.addEventListener("yt-navigate-finish", scheduleScan);
    scheduleScan();
  }

  setEnabled(true); // default: on, until storage answers
  try {
    root.chrome.storage.local.get({ enabled: true }, function (res) {
      setEnabled(res.enabled !== false);
    });
    root.chrome.storage.onChanged.addListener(function (changes, area) {
      if (area === "local" && changes[STORAGE_KEY]) setEnabled(changes[STORAGE_KEY].newValue !== false);
    });
  } catch (e) { /* storage not available: stay on */ }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", start); else start();
})(typeof window !== "undefined" ? window : globalThis);
