(function () {
  var tabButtons = document.querySelectorAll(".tab");
  var panels = document.querySelectorAll(".tab-panel");

  function activateTab(tabId) {
    tabButtons.forEach(function (button) {
      var isActive = button.getAttribute("data-tab") === tabId;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });

    panels.forEach(function (panel) {
      panel.classList.toggle("active", panel.id === tabId);
    });
  }

  tabButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      activateTab(button.getAttribute("data-tab"));
    });
  });

  activateTab("tab-webpush-existing");
})();
