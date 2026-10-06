/* Site chrome behaviour — shared by every page (see assets/site-chrome.css). */
(function () {
  var header = document.getElementById('mc-header');
  if (!header) return;
  var burger = header.querySelector('.mc-burger');
  var panel = document.getElementById('mc-panel');

  function setOpen(open) {
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    panel.hidden = !open;
  }
  burger.addEventListener('click', function () { setOpen(panel.hidden); });
  panel.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { setOpen(false); burger.focus(); } });
  window.addEventListener('resize', function () { if (window.innerWidth >= 960 && !panel.hidden) setOpen(false); });

  // Where am I: highlight the section the current page belongs to.
  var path = location.pathname.replace(/\/+$/, '') || '/';
  header.querySelectorAll('a[data-match]').forEach(function (a) {
    var hit = a.getAttribute('data-match').split(' ').some(function (p) { return path === p || path.indexOf(p + '/') === 0; });
    if (hit) { a.classList.add('mc-active'); a.setAttribute('aria-current', 'page'); }
  });

  function onScroll() { header.classList.toggle('mc-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
