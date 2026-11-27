/* Keeps the yellow navigation marker on the section currently being viewed. */
(() => {
  const links = Array.from(document.querySelectorAll('.bottom-nav a'));
  const sections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if (!links.length || !sections.length) return;

  function activate(id) {
    links.forEach(link => {
      const selected = link.getAttribute('href') === '#' + id;
      if (selected && !link.classList.contains('active')) {
        link.classList.add('active');
      } else if (!selected) {
        link.classList.remove('active');
      }
      if (selected) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  links.forEach(link => link.addEventListener('click', () => {
    const id = link.getAttribute('href').slice(1);
    activate(id);
  }));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting)
        .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) activate(visible.target.id);
    }, { rootMargin: '-22% 0px -48% 0px', threshold: [0, .15, .35, .6] });
    sections.forEach(section => observer.observe(section));
  }
})();
