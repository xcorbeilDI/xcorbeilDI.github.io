(function () {
  class TestTab extends HTMLElement {}

  class TestTabs extends HTMLElement {
    connectedCallback() {
      if (this._initialized) {
        return;
      }
      this._initialized = true;

      var tabNodes = Array.from(this.querySelectorAll("test-tab"));
      if (tabNodes.length === 0) {
        return;
      }

      var nav = document.createElement("nav");
      nav.className = "tab-bar";
      nav.setAttribute("role", "tablist");
      nav.setAttribute(
        "aria-label",
        this.getAttribute("aria-label") || "Test tabs",
      );

      var content = document.createElement("div");
      var firstActiveId = null;
      var loadTasks = [];

      tabNodes.forEach(function (tabNode, index) {
        var tabId = tabNode.getAttribute("tab-id") || "tab-" + (index + 1);
        var title = tabNode.getAttribute("title") || "Tab " + (index + 1);
        var isDefaultActive = tabNode.hasAttribute("active");

        if (!firstActiveId && (isDefaultActive || index === 0)) {
          firstActiveId = tabId;
        }

        var button = document.createElement("button");
        button.type = "button";
        button.className = "tab";
        button.setAttribute("data-tab", tabId);
        button.setAttribute("role", "tab");
        button.setAttribute("aria-selected", "false");
        button.textContent = title;
        nav.appendChild(button);

        var panel = document.createElement("section");
        panel.className = "tab-panel";
        panel.id = tabId;
        panel.setAttribute("role", "tabpanel");

        var src = tabNode.getAttribute("src");
        if (src) {
          var task = fetch(src)
            .then(function (response) {
              if (!response.ok) {
                throw new Error("Failed to load " + src);
              }
              return response.text();
            })
            .then(function (html) {
              panel.innerHTML = html;
              document.dispatchEvent(
                new CustomEvent("tabContentLoaded", {
                  detail: { tabId: tabId, src: src },
                }),
              );
            })
            .catch(function (error) {
              panel.innerHTML =
                '<p class="note">Cannot load tab content: ' + src + "</p>";
              console.error(error);
            });
          loadTasks.push(task);
        } else {
          while (tabNode.firstChild) {
            panel.appendChild(tabNode.firstChild);
          }
        }

        content.appendChild(panel);
      });

      this.innerHTML = "";
      this.appendChild(nav);
      this.appendChild(content);

      var tabButtons = this.querySelectorAll(".tab");
      var panels = this.querySelectorAll(".tab-panel");

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

      activateTab(firstActiveId);

      Promise.allSettled(loadTasks).then(function () {
        document.dispatchEvent(new Event("tabsReady"));
      });
    }
  }

  customElements.define("test-tab", TestTab);
  customElements.define("test-tabs", TestTabs);
})();
