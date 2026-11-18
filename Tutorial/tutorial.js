if (sessionStorage.getItem("page-transition") === "in") {
  document.documentElement.classList.add("is-entering");
  sessionStorage.removeItem("page-transition");
}

document.addEventListener("DOMContentLoaded", () => {
  const projectName = new URLSearchParams(window.location.search).get("project");
  if (projectName) {
    document.querySelector("#tutorialProjectName").textContent = projectName;
  }

  const tutorialSteps = [{
      title: "Start",
      description: "Wind the thread into the<br>first slot of the loom.",
      imageAlt: "Wind the thread into the first slot of the loom.",
    },
    {
      title: "Go back",
      description: "Extend the thread to the other end<br>and come back, passing it through<br>the third slot on the heddle.",
      imageAlt: "Extend the thread to the other end and come back, passing it through the third slot on the heddle.",
    },
    {
      title: "Return",
      description: "Return to the first slot and pass<br>the thread through the second<br>slot of the heddle.",
      imageAlt: "Return to the first slot and pass the thread through the second slot of the heddle.",
    },
    {
      title: "First steps",
      description: "Extend the thread to the other end and<br>come back, passing it through the<br>fourth slot on the heddle.",
      imageAlt: "Extend the thread to the other end and come back, passing it through the fourth slot on the heddle.",
    },
    {
      title: "Repeat",
      description: "Repeat the process until<br>you have the exact number<br>of warps you need.",
      imageAlt: "Repeat the process until you have the exact number of warps you need.",
    },
    {
      title: "Close",
      description: "Trim the excess thread<br>with some scissors.",
      imageAlt: "The completed warp is trimmed with scissors.",
    },
  ];
  const circledNumbers = ["①", "②", "③", "④", "⑤", "⑥"];
  const stepNumber = document.querySelector("#stepNumber");
  const stepTitle = document.querySelector("#section-title");
  const stepDescription = document.querySelector("#stepDescription");
  const tutorialImage = document.querySelector(".tutorial-image");
  const previousStepButton = document.querySelector("#previousStep");
  const nextStepButton = document.querySelector("#nextStep");
  const stepImages = tutorialSteps.map((_, stepIndex) => {
    const image = new Image();
    image.src = `../Assets/Images/Tutorial_${stepIndex + 1}.png`;
    image.addEventListener(
      "error",
      () => console.error(`Failed to preload tutorial image for step ${stepIndex + 1}.`), {
        once: true
      }
    );
    return image;
  });
  let currentStep = 0;
  let imageRequest = 0;

  const showStep = (stepIndex) => {
    const step = tutorialSteps[stepIndex];
    currentStep = stepIndex;
    stepNumber.textContent = circledNumbers[stepIndex];
    stepTitle.textContent = step.title;
    stepDescription.textContent = step.description.replace(/<br\s*\/?>/gi, "\n");
    previousStepButton.disabled = stepIndex === 0;
    nextStepButton.disabled = stepIndex === tutorialSteps.length - 1;

    const requestedImage = stepImages[stepIndex];
    const requestId = ++imageRequest;
    const displayImage = () => {
      if (requestId !== imageRequest) {
        return;
      }

      tutorialImage.src = requestedImage.src;
      tutorialImage.alt = step.imageAlt;
    };

    if (requestedImage.complete) {
      displayImage();
    } else {
      requestedImage.addEventListener("load", displayImage, {
        once: true
      });
      requestedImage.addEventListener("error", displayImage, {
        once: true
      });
    }
  };

  previousStepButton.addEventListener("click", () => {
    showStep(currentStep - 1);
  });
  nextStepButton.addEventListener("click", () => {
    showStep(currentStep + 1);
  });

  showStep(0);

  const transitionLinks = document.querySelectorAll(
    'a[href="../index.html"], a[href="../App/app.html"]'
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