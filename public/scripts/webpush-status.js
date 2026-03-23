(function () {
  function setupDebugToggle() {
    var toggle = document.getElementById("ofsys-debug-toggle");
    if (!toggle || toggle.dataset.initialized === "1") {
      return;
    }
    toggle.dataset.initialized = "1";

    var url = new URL(window.location.href);
    if (!url.searchParams.has("ofsysDebug")) {
      url.searchParams.set("ofsysDebug", "1");
      window.history.replaceState({}, "", url.toString());
    }
    toggle.checked = url.searchParams.get("ofsysDebug") === "1";

    toggle.addEventListener("change", function () {
      var nextUrl = new URL(window.location.href);
      if (toggle.checked) {
        nextUrl.searchParams.set("ofsysDebug", "1");
      } else {
        nextUrl.searchParams.delete("ofsysDebug");
      }

      window.history.replaceState({}, "", nextUrl.toString());
      setStatus("Latest: URL updated => " + nextUrl.search, "result-success");
    });
  }

  function toText(value) {
    if (typeof value === "undefined") {
      return "undefined";
    }
    if (value === null) {
      return "null";
    }
    if (typeof value === "string") {
      return value;
    }
    if (typeof value === "object") {
      try {
        return JSON.stringify(value);
      } catch (error) {
        return "[object]";
      }
    }
    return String(value);
  }

  function setStatus(message, cssClass) {
    var output = document.getElementById("webpush-last-result");
    if (!output) {
      return;
    }

    output.textContent = message;
    output.classList.remove("result-info", "result-success", "result-error");
    output.classList.add(cssClass || "result-info");
  }

  function run(name, action) {
    setStatus("Running " + name + " ...", "result-info");

    try {
      var result = action();
      if (result && typeof result.then === "function") {
        result
          .then(function (resolved) {
            setStatus(
              "Latest: " + name + " => Promise resolved: " + toText(resolved),
              "result-success",
            );
          })
          .catch(function (error) {
            setStatus(
              "Latest: " + name + " => Promise rejected: " + toText(error),
              "result-error",
            );
          });
        return;
      }

      setStatus("Latest: " + name + " => " + toText(result), "result-success");
    } catch (error) {
      setStatus(
        "Latest: " + name + " => Error: " + toText(error),
        "result-error",
      );
    }
  }

  window.webPushActions = {
    identify: function () {
      var emailInput = document.getElementById("email");
      var email = emailInput ? emailInput.value : "";
      console.log("Identifying with email:", email);
      run("DI.WebPush.Identify", function () {
        return DI.WebPush.Identify("f_EMail", email);
      });
    },
    resetIdentify: function () {
      run("DI.WebPush.ResetIdentify", function () {
        return DI.WebPush.ResetIdentify();
      });
    },
    requestPermissionFr: function () {
      run("DI.WebPush.RequestPermission('fr')", function () {
        return DI.WebPush.RequestPermission("fr");
      });
    },
    requestPermissionEn: function () {
      run("DI.WebPush.RequestPermission('en')", function () {
        return DI.WebPush.RequestPermission("en");
      });
    },
    checkIsSubscribed: function () {
      run("DI.WebPush.isSubscribed", function () {
        return DI.WebPush.isSubscribed();
      });
    },
    checkIsSupported: function () {
      run("DI.WebPush.isSupported", function () {
        return DI.WebPush.isSupported();
      });
    },
    checkIsBlocked: function () {
      run("DI.WebPush.isBlocked", function () {
        return DI.WebPush.isBlocked();
      });
    },
  };

  setupDebugToggle();
})();
