(function () {
  try {
    var saved = localStorage.getItem("theme");
    if (saved === "dark") document.documentElement.dataset.theme = "dark";
  } catch (e) {}
})();
