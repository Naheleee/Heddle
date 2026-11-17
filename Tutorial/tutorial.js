(() => {
  const chapters = [...document.querySelectorAll('[data-chapter]')];
  const links = [...document.querySelectorAll('[data-chapter-link]')];
  const progress = document.querySelector('[data-progress]');
  const progressLabel = document.querySelector('[data-progress-label]');

  if (!chapters.length || !links.length || !progress || !progressLabel) return;

  function setCurrentChapter(id) {
    const index = chapters.findIndex(chapter => chapter.id === id);
    if (index < 0) return;

    links.forEach((link, linkIndex) => {
      if (linkIndex === index) {
        link.setAttribute('aria-current', 'step');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    progress.value = index + 1;
    progressLabel.textContent = `${index + 1} of ${chapters.length}`;
  }

  links.forEach(link => {
    link.addEventListener('click', () => setCurrentChapter(link.hash.slice(1)));
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const visibleChapters = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (visibleChapters.length) setCurrentChapter(visibleChapters[0].target.id);
    }, {
      rootMargin: '-15% 0px -65% 0px',
      threshold: 0
    });

    chapters.forEach(chapter => observer.observe(chapter));
  }

  const initialChapter = window.location.hash.slice(1);
  setCurrentChapter(chapters.some(chapter => chapter.id === initialChapter)
    ? initialChapter
    : chapters[0].id);
})();
