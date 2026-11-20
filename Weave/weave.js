document.addEventListener("DOMContentLoaded", () => {
  const projectName = new URLSearchParams(window.location.search).get("project");
  if (projectName) {
    document.querySelector("#tutorialProjectName").textContent = projectName;
  }

  const transitionLinks = document.querySelectorAll(
    '.toolbar a[href="../index.html"], .tutorial-footer a[href="../App/app.html"]'
  );
  transitionLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      event.preventDefault();
      if (document.body.classList.contains("page-leaving")) {
        return;
      }

      sessionStorage.setItem("page-transition", "in");
      document.body.classList.add("page-leaving");
      window.setTimeout(() => {
        window.location.assign(link.href);
      }, 350);
    });
  });

  if (document.documentElement.classList.contains("is-entering")) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove("is-entering");
      });
    });
  }
});
