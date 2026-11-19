(function () {
  "use strict";
  var toggle = document.getElementById("toggle");
  var state = document.getElementById("state");

  function render(on) {
    toggle.checked = on;
    state.textContent = on ? "The label is hidden." : "The label is visible.";
  }

  chrome.storage.local.get({ enabled: true }, function (res) {
    render(res.enabled !== false);
  });
  toggle.addEventListener("change", function () {
    chrome.storage.local.set({ enabled: toggle.checked });
    render(toggle.checked);
  });
})();
