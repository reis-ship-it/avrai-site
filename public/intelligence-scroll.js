(function () {
  var selector = "[data-intelligence-scroll]";
  var wordSelector = "[data-intelligence-word]";
  var scheduled = false;
  var raf =
    window.requestAnimationFrame ||
    function (callback) {
      return window.setTimeout(callback, 16);
    };

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function updateSection(section) {
    var words = section.querySelectorAll(wordSelector);
    if (!words.length) {
      return;
    }

    var rect = section.getBoundingClientRect();
    var pageY = window.scrollY || window.pageYOffset || 0;
    var start = pageY + rect.top;
    var scrollLength = Math.max(1, section.offsetHeight - window.innerHeight);
    var progress = clamp((pageY - start) / scrollLength, 0, 1);
    var position = progress * (words.length - 1);

    section.setAttribute("data-scroll-ready", "true");
    section.setAttribute("data-scroll-position", position.toFixed(3));

    for (var index = 0; index < words.length; index += 1) {
      var word = words[index];
      var distance = index - position;
      var opacity = clamp(1 - Math.abs(distance) * 1.35, 0, 1);
      var translate = clamp(distance * 0.32, -0.42, 0.42);

      word.style.opacity = String(opacity);
      word.style.transform = "translate3d(0, " + translate.toFixed(3) + "em, 0)";
    }
  }

  function updateAll() {
    scheduled = false;

    var sections = document.querySelectorAll(selector);
    for (var index = 0; index < sections.length; index += 1) {
      updateSection(sections[index]);
    }
  }

  function scheduleUpdate() {
    if (scheduled) {
      return;
    }

    scheduled = true;
    raf(updateAll);
  }

  function boot() {
    updateAll();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    if ("MutationObserver" in window) {
      new MutationObserver(scheduleUpdate).observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
