(() => {
  const trigger = document.getElementById('readingMenuBtn');
  if (!trigger) return;
  const saved = JSON.parse(localStorage.getItem('wordReadingPrefs') || '{"size":"medium","font":"classic"}');
  const backdrop = document.createElement('div');
  backdrop.className = 'reading-glass-backdrop';
  backdrop.setAttribute('aria-hidden','true');
  const menu = document.createElement('section');
  menu.className = 'reading-glass-menu';
  menu.setAttribute('role','dialog');
  menu.setAttribute('aria-label','Reading settings');
  menu.setAttribute('aria-modal','false');
  menu.innerHTML = `
    <div class="reading-menu-head"><strong>Reading appearance</strong><button class="reading-menu-close" type="button" aria-label="Close">×</button></div>
    <div class="reading-menu-group">
      <span class="reading-menu-label">FONT SIZE</span>
      <div class="reading-choice-row" data-setting="size">
        <button class="reading-choice" data-value="small">Small</button>
        <button class="reading-choice" data-value="medium">Medium</button>
        <button class="reading-choice" data-value="large">Large</button>
        <button class="reading-choice" data-value="xlarge">XL</button>
      </div>
    </div>
    <div class="reading-menu-group">
      <span class="reading-menu-label">FONT STYLE</span>
      <div class="reading-choice-row" data-setting="font">
        <button class="reading-choice" data-value="classic">Classic</button>
        <button class="reading-choice" data-value="modern">Modern</button>
        <button class="reading-choice" data-value="serif">Serif</button>
        <button class="reading-choice" data-value="clean">Clean</button>
      </div>
      <div class="reading-preview" id="readingPreview">“Thy word is a lamp unto my feet.”</div>
    </div>`;
  document.body.append(backdrop, menu);

  const apply = () => {
    const sizeMap = {small:'14px',medium:'16px',large:'19px',xlarge:'22px'};
    const fontMap = {
      classic:"'Playfair Display', Georgia, serif",
      modern:"'DM Sans', Arial, sans-serif",
      serif:"Georgia, 'Times New Roman', serif",
      clean:"Arial, Helvetica, sans-serif"
    };
    document.documentElement.style.setProperty('--reading-size', sizeMap[saved.size] || sizeMap.medium);
    document.documentElement.style.setProperty('--reading-font', fontMap[saved.font] || fontMap.classic);
    document.querySelectorAll('.passage .verse,.daily-verse,.saved-item,.search-results .result').forEach(el => {
      el.style.fontSize = sizeMap[saved.size] || sizeMap.medium;
      el.style.fontFamily = fontMap[saved.font] || fontMap.classic;
    });
    menu.querySelectorAll('[data-setting]').forEach(row => row.querySelectorAll('button').forEach(btn => {
      btn.classList.toggle('selected', saved[row.dataset.setting] === btn.dataset.value);
      btn.setAttribute('aria-pressed', saved[row.dataset.setting] === btn.dataset.value ? 'true' : 'false');
    }));
    const preview = menu.querySelector('#readingPreview');
    preview.style.fontSize = sizeMap[saved.size] || sizeMap.medium;
    preview.style.fontFamily = fontMap[saved.font] || fontMap.classic;
  };
  const close = () => {
    if (!menu.classList.contains('open')) return;
    menu.classList.remove('open');
    menu.classList.add('closing');
    trigger.setAttribute('aria-expanded','false');
    backdrop.classList.remove('visible');
    window.setTimeout(() => menu.classList.remove('closing'), 230);
  };
  const open = () => {
    menu.classList.remove('closing');
    menu.classList.add('open');
    backdrop.classList.add('visible');
    trigger.setAttribute('aria-expanded','true');
    apply();
  };
  trigger.addEventListener('click', () => menu.classList.contains('open') ? close() : open());
  menu.querySelector('.reading-menu-close').addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  menu.querySelectorAll('[data-setting] button').forEach(btn => btn.addEventListener('click', () => {
    const row = btn.closest('[data-setting]');
    saved[row.dataset.setting] = btn.dataset.value;
    localStorage.setItem('wordReadingPrefs', JSON.stringify(saved));
    apply();
  }));
  apply();
})();
