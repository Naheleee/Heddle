if (sessionStorage.getItem("page-transition") === "in") {
  document.documentElement.classList.add("is-entering");
  sessionStorage.removeItem("page-transition");
}

document.addEventListener("DOMContentLoaded", () => {
  const tutorialSteps = [
    {
      title: "Step 1",
      description: "Blah blah blah.",
      imageAlt: "A hand threads the first warp end through the loom.",
    },
    {
      title: "Step 2",
      description: "Blah blah blah.",
      imageAlt: "A hand pulls the yarn through the loom heddle.",
    },
    {
      title: "Step 3",
      description: "Blah blah blah.",
      imageAlt: "A close-up shows the yarn passing through a heddle opening.",
    },
    {
      title: "Step 4",
      description: "Blah blah blah.",
      imageAlt: "Arrows show the repeated threading pattern across the heddle.",
    },
    {
      title: "Step 5",
      description: "Blah blah blah.",
      imageAlt: "The loom is filled with threaded warp ends.",
    },
    {
      title: "Step 6",
      description: "Blah blah blah.",
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
    if (stepIndex === 0) {
      return tutorialImage;
    }

    const image = new Image();
    image.src = `../Assets/Images/Tutorial_${stepIndex + 1}.png`;
    image.addEventListener(
      "error",
      () => console.error(`Failed to preload tutorial image for step ${stepIndex + 1}.`),
      { once: true }
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
    stepDescription.textContent = step.description;
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
      tutorialImage.classList.remove("step-image-transition");
      void tutorialImage.offsetWidth;
      tutorialImage.classList.add("step-image-transition");
    };

    if (requestedImage.complete) {
      displayImage();
    } else {
      requestedImage.addEventListener("load", displayImage, { once: true });
      requestedImage.addEventListener("error", displayImage, { once: true });
    }
  };

  previousStepButton.addEventListener("click", () => {
    showStep(currentStep - 1);
  });
  nextStepButton.addEventListener("click", () => {
    showStep(currentStep + 1);
  });

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