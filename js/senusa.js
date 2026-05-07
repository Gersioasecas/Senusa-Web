/* ================================================================
   SENUSA 3.0 — JavaScript principal
   ----------------------------------------------------------------
   Sistema unificado de:
   • Scroll animations con Intersection Observer (spring-based)
   • Navegación con scroll-aware + hamburger animado
   • Stagger automático para grids de cards
   • Counter animation para stats
   • Smooth page transitions
   ================================================================ */

(function () {
  'use strict';

  /* Preferencia global por reducir movimiento (usada en varios módulos) */
  var prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. Navegación scroll-aware ─────────────────────────── */
  const nav = document.getElementById('site-nav');
  if (nav) {
    let lastScrollY = 0;
    let ticking = false;

    function updateNav() {
      const y = window.scrollY;
      nav.classList.toggle('scrolled', y > 24);
      lastScrollY = y;
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateNav);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── 2. Menú mobile con animación hamburger ─────────────── */
  const ham = document.getElementById('ham');
  const mob = document.getElementById('mob');
  const mobClose = document.getElementById('mob-close');

  function openMobile() {
    mob.classList.add('open');
    ham.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobile() {
    mob.classList.remove('open');
    ham.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (ham && mob) {
    ham.addEventListener('click', openMobile);
    if (mobClose) mobClose.addEventListener('click', closeMobile);
    mob.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMobile);
    });
  }

  /* ── 3. Scroll Animations (Spring-based) ────────────────── */
  if ('IntersectionObserver' in window) {
    if (prefersReduced) {
      document.querySelectorAll('.fu, .sa').forEach(function (el) {
        el.classList.add('on');
      });
    } else {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('on');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.06,
        rootMargin: '0px 0px -40px 0px'
      });

      document.querySelectorAll('.fu, .sa').forEach(function (el) {
        observer.observe(el);
      });

      var dividerObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('on');
            dividerObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      document.querySelectorAll('.t-divider').forEach(function (el) {
        dividerObs.observe(el);
      });
    }
  } else {
    document.querySelectorAll('.fu, .sa').forEach(function (el) {
      el.classList.add('on');
    });
    document.querySelectorAll('.t-divider').forEach(function (el) {
      el.classList.add('on');
    });
  }

  /* ── 4. Auto-stagger para grids ─────────────────────────── */
  var grids = document.querySelectorAll('.svc-grid, .pillars-grid, .logos-grid, .gal-grid, .stats-row');
  grids.forEach(function (grid) {
    var children = grid.children;
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      if (!child.classList.contains('d1') &&
          !child.classList.contains('d2') &&
          !child.classList.contains('d3') &&
          !child.classList.contains('d4') &&
          !child.classList.contains('sa--d1') &&
          !child.classList.contains('sa--d2') &&
          !child.classList.contains('sa--d3')) {
        child.style.transitionDelay = (i * 0.07) + 's';
      }
    }
  });

  /* ── 5. Stat counter animation ──────────────────────────── */
  if ('IntersectionObserver' in window && !prefersReduced) {
    var statObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.stat-number[data-count]').forEach(function (el) {
      statObs.observe(el);
    });
  } else {
    document.querySelectorAll('.stat-number[data-count]').forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var prefix = el.getAttribute('data-prefix') || '';
      if (!isNaN(target)) {
        el.textContent = prefix + target.toLocaleString('es-MX') + suffix;
      }
    });
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var duration = 1200;
    var start = performance.now();

    function step(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 5);
      var current = Math.round(eased * target);
      el.textContent = prefix + current.toLocaleString('es-MX') + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ── 6. Active link highlight ───────────────────────────── */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    if (a.getAttribute('href') === currentPage) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
  });

})();
