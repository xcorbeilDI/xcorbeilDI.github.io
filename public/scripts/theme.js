(function () {
  var root = document.documentElement;
  var storageKey = "theme-preference";

  function getPreferredTheme() {
    var saved = localStorage.getItem(storageKey);
    if (saved === "light" || saved === "dark") {
      return saved;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem(storageKey, theme);

    var button = document.getElementById("theme-toggle");
    if (button) {
      button.setAttribute("aria-pressed", String(theme === "dark"));
      button.textContent = theme === "dark" ? "Light Theme" : "Dark Theme";
    }
  }

  window.toggleTheme = function () {
    var current = root.getAttribute("data-theme") || getPreferredTheme();
    applyTheme(current === "dark" ? "light" : "dark");
  };

  applyTheme(getPreferredTheme());
})();
