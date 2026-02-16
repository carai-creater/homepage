document.addEventListener('DOMContentLoaded', function () {
  // Custom cursor（ミニマル）
  var cursor = document.createElement('div');
  cursor.className = 'custom-cursor is-hidden';
  cursor.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cursor);

  var cursorX = 0, cursorY = 0;
  var posX = 0, posY = 0;

  document.addEventListener('mousemove', function (e) {
    cursorX = e.clientX;
    cursorY = e.clientY;
    cursor.classList.remove('is-hidden');
  });

  document.addEventListener('mouseleave', function () {
    cursor.classList.add('is-hidden');
  });

  document.addEventListener('mouseenter', function () {
    cursor.classList.remove('is-hidden');
  });

  var links = document.querySelectorAll('a, button, [role="button"]');
  links.forEach(function (el) {
    el.addEventListener('mouseenter', function () { cursor.classList.add('is-link'); });
    el.addEventListener('mouseleave', function () { cursor.classList.remove('is-link'); });
  });

  function animateCursor() {
    posX += (cursorX - posX) * 0.2;
    posY += (cursorY - posY) * 0.2;
    cursor.style.left = posX + 'px';
    cursor.style.top = posY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Scroll reveal: スクロールで表示（複数クラス対応）
  var revealSelectors = '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale';
  var revealEls = document.querySelectorAll(revealSelectors);
  if (revealEls.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });
    revealEls.forEach(function (el) { observer.observe(el); });
  }

  // Hero slider (all uploaded images)
  const slider = document.querySelector('[data-hero-slider]');
  if (slider) {
    var slides = slider.querySelectorAll('.hero-slide');
    var dots = document.querySelectorAll('.hero-dot');
    var current = 0;
    function goTo(n) {
      current = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle('is-active', i === current); });
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === current); });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); });
    });
    setInterval(function () { goTo(current + 1); }, 5000);
  }

  const triggers = document.querySelectorAll('.accordion-trigger');

  triggers.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = btn.closest('.accordion-item');
      const isOpen = item.getAttribute('data-open') === 'true';

      document.querySelectorAll('.accordion-item').forEach(function (other) {
        other.setAttribute('data-open', 'false');
        other.querySelector('.accordion-trigger')?.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.setAttribute('data-open', 'true');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
});
