/* Mobile nav toggle: open/close menu, focus trap, body scroll lock, sync --nav-h */
(function () {
  var nav = document.getElementById('siteNav');
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');
  if (!nav || !toggle || !menu) return;

  var measure = function () {
    document.documentElement.style.setProperty('--nav-h', nav.offsetHeight + 'px');
  };

  var getFocusables = function () {
    return Array.prototype.slice.call(menu.querySelectorAll('a, button, input, [tabindex="0"]'));
  };

  var setMenu = function (open) {
    measure();
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);
    
    if (open) {
      document.body.style.overflow = 'hidden';
      var focusables = getFocusables();
      if (focusables.length) focusables[0].focus();
    } else {
      document.body.style.overflow = '';
      toggle.focus();
    }
  };

  window.closeMobileNav = function () {
    if (toggle.getAttribute('aria-expanded') === 'true') setMenu(false);
  };

  measure();
  window.addEventListener('resize', function () {
    measure();
    /* Coming back up to desktop leaves the menu orphaned — close it. */
    if (window.innerWidth > 900 && toggle.getAttribute('aria-expanded') === 'true') setMenu(false);
  }, { passive: true });

  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });

  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });

  document.addEventListener('keydown', function (e) {
    if (toggle.getAttribute('aria-expanded') === 'true') {
      if (e.key === 'Escape') {
        setMenu(false);
      } else if (e.key === 'Tab') {
        var focusables = getFocusables();
        if (!focusables.length) return;
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });

  // Sticky nav elevation on scroll
  var handleNavScroll = function () {
    var scrollY = window.scrollY || window.pageYOffset;
    nav.classList.toggle('is-scrolled', scrollY > 40);
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();
})();

/* FAQ accordion: one panel open at a time, with the open/close height animated. */
function initFaq() {
  var faq = document.querySelector('.faq');
  if (!faq || faq.dataset.faqInit) return;
  faq.dataset.faqInit = 'true';
  var items = Array.prototype.slice.call(faq.querySelectorAll('details'));
  if (!items.length) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DURATION = 320;
  var EASING = 'cubic-bezier(.2,.7,.3,1)';
  var supported = 'animate' in Element.prototype;

  var bodyOf = function (details) { return details.querySelector('.faq-body'); };
  var running = new WeakMap();

  var slide = function (details, from, to, onDone) {
    var body = bodyOf(details);
    if (!body || reduceMotion || !supported) { onDone(); return; }
    var previous = running.get(details);
    if (previous) previous.cancel();
    var player = body.animate(
      [{ height: from + 'px' }, { height: to + 'px' }],
      { duration: DURATION, easing: EASING }
    );
    running.set(details, player);
    player.addEventListener('finish', function () { running.delete(details); onDone(); });
    player.addEventListener('cancel', function () { running.delete(details); });
  };

  var open = function (details) {
    var body = bodyOf(details);
    details.open = true;
    if (!body) return;
    slide(details, 0, body.scrollHeight, function () { body.style.height = ''; });
  };

  var close = function (details) {
    var body = bodyOf(details);
    if (!body || reduceMotion || !supported) { details.open = false; return; }
    slide(details, body.scrollHeight, 0, function () {
      details.open = false;
      body.style.height = '';
    });
  };

  faq.addEventListener('click', function (e) {
    var summary = e.target.closest ? e.target.closest('summary') : null;
    if (!summary || summary.parentElement.tagName !== 'DETAILS') return;
    var details = summary.parentElement;
    e.preventDefault();

    if (details.open) { close(details); return; }
    items.forEach(function (other) { if (other !== details && other.open) close(other); });
    open(details);
  });
}
initFaq();

/* Statistic & Case-figure counters */
function initCounters() {
  var figures = document.querySelectorAll('[data-count-to]:not([data-counter-bound])');
  if (!figures.length) return;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DURATION = 1400;
  var easeOutCubic = function (t) { return 1 - Math.pow(1 - t, 3); };

  var format = function (el, value) {
    var decimals = parseInt(el.dataset.countDecimals || '0', 10);
    var formattedNum = value.toFixed(decimals);
    if (el.dataset.countComma === 'true') {
      var parts = formattedNum.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      formattedNum = parts.join('.');
    }
    return (el.dataset.countPrefix || '') + formattedNum + (el.dataset.countSuffix || '');
  };

  var run = function (el) {
    var target = parseFloat(el.dataset.countTo);
    if (reduceMotion || !('requestAnimationFrame' in window)) { el.textContent = format(el, target); return; }
    var start = null;
    var step = function (ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / DURATION, 1);
      el.textContent = format(el, target * easeOutCubic(p));
      if (p < 1) requestAnimationFrame(step); else el.textContent = format(el, target);
    };
    requestAnimationFrame(step);
  };

  if (!('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      run(entry.target);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.3 });
  figures.forEach(function (el) {
    el.dataset.counterBound = 'true';
    io.observe(el);
  });
}
initCounters();

/* Sticky Stacking Cards dynamic depth & scale enhancement */
function initStack() {
  var stack = document.getElementById('ledgerStack');
  if (!stack || stack.dataset.stackInit) return;
  stack.dataset.stackInit = 'true';
  var cards = Array.prototype.slice.call(stack.querySelectorAll('.ledger-card'));
  if (cards.length <= 1) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  var ticking = false;

  var updateStack = function () {
    var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '65', 10);
    var isMobile = window.innerWidth <= 900;
    var baseOffset = isMobile ? 12 : 24;
    var stepOffset = isMobile ? 10 : 14;

    for (var i = 0; i < cards.length - 1; i++) {
      var card = cards[i];
      var nextCard = cards[i + 1];
      if (!nextCard) continue;

      var nextRect = nextCard.getBoundingClientRect();
      var nextTargetTop = navH + baseOffset + ((i + 1) * stepOffset);

      var distance = nextRect.top - nextTargetTop;
      var transitionRange = 260;
      var progress = Math.max(0, Math.min(1, 1 - (distance / transitionRange)));

      if (progress > 0) {
        var scale = 1 - (progress * 0.035);
        var translateY = -progress * 4;
        var brightness = 1 - (progress * 0.025);
        card.style.transform = 'scale(' + scale.toFixed(4) + ') translateY(' + translateY.toFixed(2) + 'px)';
        card.style.filter = 'brightness(' + brightness.toFixed(4) + ')';
      } else {
        card.style.transform = '';
        card.style.filter = '';
      }
    }
    ticking = false;
  };

  var onScroll = function () {
    if (!ticking) {
      window.requestAnimationFrame(updateStack);
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  updateStack();
}
initStack();

/* ============================================================
   DESIGN SPELLS INTERACTION CONTROLLERS
   ============================================================ */

/* Design Spell: Magnetic Controls */
function initMagnetics() {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasHover = window.matchMedia('(hover: hover)').matches;
  if (reduceMotion || !hasHover) return;

  var magnetics = document.querySelectorAll('[data-spell="magnetic"]:not([data-magnetic-bound])');
  magnetics.forEach(function (btn) {
    btn.dataset.magneticBound = 'true';
    var bound = null;
    var strength = 0.28;

    btn.addEventListener('mouseenter', function () {
      bound = btn.getBoundingClientRect();
    });

    btn.addEventListener('mousemove', function (e) {
      if (!bound) bound = btn.getBoundingClientRect();
      var x = e.clientX - bound.left - bound.width / 2;
      var y = e.clientY - bound.top - bound.height / 2;
      btn.style.transform = 'translate(' + (x * strength).toFixed(2) + 'px, ' + (y * strength).toFixed(2) + 'px)';
    });

    btn.addEventListener('mouseleave', function () {
      btn.style.transform = '';
      bound = null;
    });
  });
}
initMagnetics();

/* Design Spell: Atmospheric Field Spotlight */
function initFieldSpotlights() {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasHover = window.matchMedia('(hover: hover)').matches;
  if (reduceMotion || !hasHover) return;

  var fields = document.querySelectorAll('.field.ink:not([data-spotlight-bound])');
  fields.forEach(function (field) {
    field.dataset.spotlightBound = 'true';
    field.addEventListener('mousemove', function (e) {
      var rect = field.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      field.style.setProperty('--spotlight-x', x + 'px');
      field.style.setProperty('--spotlight-y', y + 'px');
      field.style.setProperty('--spotlight-opacity', '1');
    }, { passive: true });

    field.addEventListener('mouseleave', function () {
      field.style.setProperty('--spotlight-opacity', '0');
    });
  });
}
initFieldSpotlights();

/* Design Spell: Interactive Card Spotlight */
function initCardSpotlights() {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasHover = window.matchMedia('(hover: hover)').matches;
  if (reduceMotion || !hasHover) return;

  var cards = document.querySelectorAll('.ledger-card:not([data-card-bound]), [data-spell="card-spotlight"]:not([data-card-bound])');
  cards.forEach(function (card) {
    card.dataset.cardBound = 'true';
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', x + 'px');
      card.style.setProperty('--mouse-y', y + 'px');
    }, { passive: true });
  });
}
initCardSpotlights();

/* Wispr Flow Style Case Showcase Controller */
function initCaseShowcase() {
  var container = document.getElementById('caseShowcase');
  if (!container || container.dataset.showcaseInit) return;
  container.dataset.showcaseInit = 'true';

  var steps = Array.prototype.slice.call(container.querySelectorAll('.showcase-step'));
  var slides = Array.prototype.slice.call(container.querySelectorAll('.showcase-slide'));
  if (!steps.length || !slides.length) return;

  var activeIndex = -1;
  var ticking = false;

  var setActive = function (index) {
    if (index === activeIndex || index < 0 || index >= slides.length) return;
    activeIndex = index;

    steps.forEach(function (step, i) {
      step.classList.toggle('is-active', i === index);
    });

    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === index);
    });
  };

  var onScroll = function () {
    var stage = container.querySelector('.showcase-stage');
    var triggerY = window.innerHeight * 0.45;
    
    // Sync trigger line with the focal reading zone of the sticky visual card
    if (stage) {
      var stageRect = stage.getBoundingClientRect();
      triggerY = stageRect.top + (stageRect.height * 0.35);
    }

    var selectedIndex = 0;
    for (var i = 0; i < steps.length; i++) {
      var rect = steps[i].getBoundingClientRect();
      // Step becomes active only when its heading reaches the focal trigger line
      if (rect.top <= triggerY) {
        selectedIndex = i;
      }
    }

    setActive(selectedIndex);
    ticking = false;
  };

  var requestTick = function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  };

  // Click step to smoothly scroll it to the focal reading line
  steps.forEach(function (step, i) {
    step.addEventListener('click', function () {
      var stage = container.querySelector('.showcase-stage');
      var triggerY = window.innerHeight * 0.45;
      if (stage) {
        var stageRect = stage.getBoundingClientRect();
        triggerY = stageRect.top + (stageRect.height * 0.35);
      }
      var rect = step.getBoundingClientRect();
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var targetY = scrollTop + rect.top - triggerY + 5;

      if (window.__lenis) {
        window.__lenis.scrollTo(targetY, { duration: 1.0 });
      } else {
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
      setActive(i);
    });
  });

  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick, { passive: true });
  onScroll();
}
initCaseShowcase();

/* Section 02: Discipline Inspector & Design Spells Controller */
function initDisciplineShowcase() {
  var showcase = document.getElementById('disciplineShowcase');
  if (!showcase || showcase.dataset.disciplineInit) return;
  showcase.dataset.disciplineInit = 'true';

  var items = Array.prototype.slice.call(showcase.querySelectorAll('.discipline-item'));
  var panels = Array.prototype.slice.call(showcase.querySelectorAll('.sim-panel'));
  var terminal = document.getElementById('inspectorTerminal');
  if (!items.length || !panels.length) return;

  var activeIndex = 0;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var selectDiscipline = function (index) {
    if (index === activeIndex || index < 0 || index >= items.length) return;
    activeIndex = index;

    items.forEach(function (item, i) {
      var isTarget = i === index;
      item.classList.toggle('is-active', isTarget);
      item.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    panels.forEach(function (panel, i) {
      panel.classList.toggle('is-active', i === index);
    });

    // Spell: Sim 0 Speed count-up
    if (index === 0 && !reduceMotion) {
      var meterVal = panels[0].querySelector('.meter-val');
      if (meterVal) {
        var start = 0;
        var target = 99;
        var duration = 400;
        var startTime = null;
        var animateCount = function (timestamp) {
          if (!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);
          meterVal.textContent = Math.floor(progress * target);
          if (progress < 1) {
            window.requestAnimationFrame(animateCount);
          } else {
            meterVal.textContent = target;
          }
        };
        window.requestAnimationFrame(animateCount);
      }
    }
  };

  items.forEach(function (item, i) {
    // Spell 1: Mouse-tracking spotlight on discipline rows
    item.addEventListener('mousemove', function (e) {
      if (reduceMotion) return;
      var rect = item.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      item.style.setProperty('--spotlight-x', x + 'px');
      item.style.setProperty('--spotlight-y', y + 'px');
      item.style.setProperty('--spotlight-opacity', '1');
    }, { passive: true });

    item.addEventListener('mouseleave', function () {
      item.style.setProperty('--spotlight-opacity', '0');
    });

    item.addEventListener('mouseenter', function () {
      selectDiscipline(i);
    });

    item.addEventListener('click', function () {
      selectDiscipline(i);
    });

    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectDiscipline(i);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        var next = (i + 1) % items.length;
        items[next].focus();
        selectDiscipline(next);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        var prev = (i - 1 + items.length) % items.length;
        items[prev].focus();
        selectDiscipline(prev);
      }
    });
  });

  // Spell 3: Terminal Atmospheric Spotlight
  if (terminal && !reduceMotion) {
    terminal.addEventListener('mousemove', function (e) {
      var rect = terminal.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      terminal.style.setProperty('--term-mouse-x', x + 'px');
      terminal.style.setProperty('--term-mouse-y', y + 'px');
    }, { passive: true });
  }

  // Spell 5: Sim 1 AI Citation Chip Probe
  var citationChip = showcase.querySelector('.ai-citation-chip');
  if (citationChip) {
    citationChip.addEventListener('click', function () {
      citationChip.classList.toggle('is-verified');
      var icon = citationChip.querySelector('i');
      if (icon) {
        icon.className = citationChip.classList.contains('is-verified') ? 'fa-solid fa-circle-check text-emerald' : 'fa-solid fa-link';
      }
    });
  }

  // Spell 8: Sim 4 Interactive Swatch Color-Shift
  var swatches = showcase.querySelectorAll('.palette-swatches .swatch');
  if (swatches.length && terminal) {
    var colorMap = {
      'Signal 500': 'rgba(232, 54, 40, 0.22)',
      'Ink 950': 'rgba(20, 20, 26, 0.35)',
      'Ink 900': 'rgba(43, 43, 51, 0.35)',
      'Ink 050': 'rgba(247, 245, 241, 0.16)'
    };
    swatches.forEach(function (swatch) {
      swatch.addEventListener('click', function () {
        swatches.forEach(function (s) { s.classList.remove('is-selected'); });
        swatch.classList.add('is-selected');
        var colorTitle = swatch.getAttribute('title');
        var accent = colorMap[colorTitle] || 'rgba(232, 54, 40, 0.15)';
        terminal.style.setProperty('--term-accent', accent);
      });
    });
  }

  // Interactive Ad Spend Slider
  var slider = document.getElementById('adSpendSlider');
  var spendDisplay = document.getElementById('calcSpendDisplay');
  var leadsDisplay = document.getElementById('calcLeadsDisplay');
  var cplDisplay = document.getElementById('calcCplDisplay');

  if (slider && spendDisplay && leadsDisplay && cplDisplay) {
    var updateCalculator = function () {
      var spend = parseInt(slider.value, 10);
      spendDisplay.textContent = '₹' + spend.toLocaleString('en-IN');
      
      var minVal = parseInt(slider.min || '15000', 10);
      var maxVal = parseInt(slider.max || '250000', 10);
      var pct = ((spend - minVal) / (maxVal - minVal)) * 100;
      slider.style.setProperty('--slider-fill', pct.toFixed(1) + '%');

      var minLeads = Math.round(spend / 145);
      var maxLeads = Math.round(spend / 105);
      leadsDisplay.textContent = minLeads + ' - ' + maxLeads + ' Leads';
      
      var cplMin = Math.round(spend / maxLeads);
      var cplMax = Math.round(spend / minLeads);
      cplDisplay.textContent = '₹' + cplMin + ' - ₹' + cplMax;

      slider.setAttribute('aria-valuenow', String(spend));
      slider.setAttribute('aria-valuetext', '₹' + spend.toLocaleString('en-IN') + ' monthly spend, ' + minLeads + ' to ' + maxLeads + ' estimated qualified leads');
    };

    slider.addEventListener('input', updateCalculator);
    updateCalculator();
  }
}
initDisciplineShowcase();

/* ==========================================================================
   Smooth Inertia Scroll (Lenis Engine)
   ========================================================================== */
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  function initLenis() {
    if (typeof Lenis === 'undefined') return;

    var lenis = new Lenis({
      duration: 1.15,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
      infinite: false
    });

    window.__lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    initAnchorScrolls();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLenis);
  } else {
    initLenis();
  }
})();

function initAnchorScrolls() {
  var lenis = window.__lenis;
  document.querySelectorAll('a[href^="#"]:not([data-anchor-bound])').forEach(function (anchor) {
    anchor.dataset.anchorBound = 'true';
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href && href !== '#' && href.length > 1) {
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          var offset = window.innerWidth <= 900 ? -80 : -100;
          if (lenis) {
            lenis.scrollTo(target, { offset: offset, duration: 1.2 });
          } else {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    });
  });
}

/* Footer Reveal Dynamic Height Controller */
function initFooterReveal() {
  var wrap = document.getElementById('footerRevealWrap');
  if (!wrap) return;

  var footer = wrap.querySelector('.footer');
  if (!footer) return;

  var syncFooterHeight = function () {
    if (window.innerWidth > 900) {
      var h = footer.offsetHeight;
      wrap.style.height = h + 'px';
    } else {
      wrap.style.height = 'auto';
    }
  };

  if (!wrap.dataset.footerInit) {
    wrap.dataset.footerInit = 'true';
    window.addEventListener('resize', syncFooterHeight, { passive: true });
    window.addEventListener('load', syncFooterHeight);
  }
  syncFooterHeight();
  setTimeout(syncFooterHeight, 250);
}
initFooterReveal();


/* ==========================================================================
   SERVICES PAGE (services.html) INTERACTION CONTROLLERS
   ========================================================================== */

/* 1. Sticky Subnav Scroll-Spy & Active Tab Indicator */
function initServicesSubnav() {
  var subnav = document.getElementById('servicesSubnav');
  if (!subnav || subnav.dataset.subnavInit) return;
  subnav.dataset.subnavInit = 'true';

  var links = Array.prototype.slice.call(subnav.querySelectorAll('.services-nav-btn'));
  var sections = [];
  
  links.forEach(function (link) {
    var targetId = link.getAttribute('href');
    if (targetId && targetId.startsWith('#')) {
      var sec = document.querySelector(targetId);
      if (sec) sections.push({ id: targetId, el: sec, link: link });
    }
  });

  if (!sections.length) return;

  var ticking = false;

  var updateActive = function () {
    var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '65', 10);
    var triggerLine = navH + 80;
    var current = sections[0];

    for (var i = 0; i < sections.length; i++) {
      var rect = sections[i].el.getBoundingClientRect();
      if (rect.top <= triggerLine) {
        current = sections[i];
      }
    }

    links.forEach(function (link) { link.classList.remove('is-active'); });
    if (current && current.link) {
      current.link.classList.add('is-active');
      if (subnav.querySelector('.services-nav-inner')) {
        var inner = subnav.querySelector('.services-nav-inner');
        var linkRect = current.link.getBoundingClientRect();
        var innerRect = inner.getBoundingClientRect();
        if (linkRect.left < innerRect.left || linkRect.right > innerRect.right) {
          inner.scrollLeft = current.link.offsetLeft - 24;
        }
      }
    }
    ticking = false;
  };

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateActive);
      ticking = true;
    }
  }, { passive: true });

  updateActive();
}
initServicesSubnav();

/* 2. Engagement Models Tab Switcher (Sprints vs Retainers vs Comparison Table) */
function initEngagementModels() {
  var container = document.getElementById('engagementModels');
  if (!container || container.dataset.modelsInit) return;
  container.dataset.modelsInit = 'true';

  var toggleBtns = container.querySelectorAll('.engagement-toggle-btn');
  var cardsView = container.querySelector('.engagement-cards-grid');
  var tableView = container.querySelector('.engagement-table-view');
  var cards = container.querySelectorAll('.engagement-card');

  if (!toggleBtns.length || !cardsView) return;

  toggleBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var view = btn.dataset.view;
      toggleBtns.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');

      if (view === 'sprints') {
        if (cardsView) cardsView.style.display = 'grid';
        if (tableView) tableView.style.display = 'none';
        cards.forEach(function (c) {
          if (c.dataset.model === 'sprint') {
            c.style.display = 'flex';
            c.classList.add('is-highlighted');
          } else {
            c.style.display = 'flex';
            c.classList.remove('is-highlighted');
          }
        });
      } else if (view === 'retainers') {
        if (cardsView) cardsView.style.display = 'grid';
        if (tableView) tableView.style.display = 'none';
        cards.forEach(function (c) {
          if (c.dataset.model === 'retainer') {
            c.style.display = 'flex';
            c.classList.add('is-highlighted');
          } else {
            c.style.display = 'flex';
            c.classList.remove('is-highlighted');
          }
        });
      } else if (view === 'compare') {
        if (cardsView) cardsView.style.display = 'none';
        if (tableView) tableView.style.display = 'block';
      }
    });
  });
}
initEngagementModels();

/* 3. Interactive Sprint Scope Planner & Dynamic Roadmap Estimator */
function initSprintPlanner() {
  var planner = document.getElementById('sprintPlanner');
  if (!planner || planner.dataset.plannerInit) return;
  planner.dataset.plannerInit = 'true';

  var options = planner.querySelectorAll('.planner-option');
  var seqList = document.getElementById('plannerSeqList');
  var durationDisplay = document.getElementById('plannerDuration');
  var delivDisplay = document.getElementById('plannerDelivs');
  var fitDisplay = document.getElementById('plannerFit');
  var bookBtn = document.getElementById('plannerBookBtn');

  var scopeData = {
    web: { name: 'Web Architecture', timeWeeks: 4, delivCount: 5, model: 'Sprint (4 Wk)' },
    ai: { name: 'AI Visibility (GEO/AEO)', timeWeeks: 1, delivCount: 4, model: 'Audit & Sprint' },
    seo: { name: 'Technical & Content SEO', timeWeeks: 3, delivCount: 4, model: 'Monthly Sprint' },
    perf: { name: 'Performance Marketing', timeWeeks: 1, delivCount: 4, model: '7-Day Launch' },
    brand: { name: 'Brand Design System', timeWeeks: 2.5, delivCount: 5, model: '2-3 Wk Sprint' },
    social: { name: 'Social Content Kit', timeWeeks: 2, delivCount: 4, model: '30-Post Batch' }
  };

  var updatePlanner = function () {
    var selectedKeys = [];
    options.forEach(function (opt) {
      if (opt.classList.contains('is-selected')) {
        selectedKeys.push(opt.dataset.key);
      }
    });

    if (selectedKeys.length === 0) {
      if (seqList) seqList.innerHTML = '<span class="seq-chip">Select 1 or more focus areas above</span>';
      if (durationDisplay) durationDisplay.textContent = 'Custom';
      if (delivDisplay) delivDisplay.textContent = '0 Items';
      if (fitDisplay) fitDisplay.textContent = 'Diagnostic';
      if (bookBtn) bookBtn.setAttribute('href', '/contact?scope=Custom');
      return;
    }

    var totalWeeks = 0;
    var totalDelivs = 0;
    var chipsHtml = '';

    selectedKeys.forEach(function (key, idx) {
      var item = scopeData[key];
      if (item) {
        totalWeeks += item.timeWeeks;
        totalDelivs += item.delivCount;
        chipsHtml += '<span class="seq-chip">0' + (idx + 1) + '. ' + item.name + '</span>';
      }
    });

    if (seqList) seqList.innerHTML = chipsHtml;
    
    var realisticWeeks = Math.max(1, Math.ceil(totalWeeks * 0.75));
    if (durationDisplay) durationDisplay.textContent = realisticWeeks + (realisticWeeks === 1 ? ' Week' : ' Weeks');
    if (delivDisplay) delivDisplay.textContent = totalDelivs + ' Deliverables';
    if (fitDisplay) {
      fitDisplay.textContent = selectedKeys.length > 2 ? 'Sprint + Retainer' : 'Fixed Sprint';
    }

    if (bookBtn) {
      var scopeQuery = encodeURIComponent(selectedKeys.join(', '));
      bookBtn.setAttribute('href', '/contact?scope=' + scopeQuery);
    }
  };

  options.forEach(function (opt) {
    opt.addEventListener('click', function () {
      opt.classList.toggle('is-selected');
      updatePlanner();
    });
  });

  updatePlanner();
}
initSprintPlanner();

/* ==========================================================================
   Typewriter Text Cycling Animation
   ========================================================================== */
function initTypewriter() {
  var typewriterElements = document.querySelectorAll('.typewriter-text:not([data-typewriter-bound])');
  if (!typewriterElements.length) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  typewriterElements.forEach(function (el) {
    el.dataset.typewriterBound = 'true';
    var rawWords = el.getAttribute('data-words');
    var words = ["numbers", "leads", "customers", "clients", "revenue"];
    if (rawWords) {
      try {
        words = JSON.parse(rawWords);
      } catch (e) {
        words = rawWords.split(',').map(function (w) { return w.trim(); });
      }
    }

    var cursor = el.parentElement ? el.parentElement.querySelector('.typewriter-cursor') : null;
    var wordIndex = 0;
    var charIndex = words[0].length;
    var isDeleting = false;
    var isVisible = true;
    var timeoutId = null;

    var typeSpeed = 90;
    var deleteSpeed = 45;
    var holdDuration = 2200;
    var pauseBeforeType = 400;

    function setCursorTyping(typing) {
      if (cursor) {
        if (typing) {
          cursor.classList.add('is-typing');
        } else {
          cursor.classList.remove('is-typing');
        }
      }
    }

    function tick() {
      if (!isVisible) {
        timeoutId = setTimeout(tick, 300);
        return;
      }

      var currentWord = words[wordIndex];

      if (isDeleting) {
        setCursorTyping(true);
        charIndex--;
        el.textContent = currentWord.substring(0, charIndex);

        if (charIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          setCursorTyping(false);
          timeoutId = setTimeout(tick, pauseBeforeType);
          return;
        }

        timeoutId = setTimeout(tick, deleteSpeed);
      } else {
        setCursorTyping(true);
        charIndex++;
        el.textContent = currentWord.substring(0, charIndex);

        if (charIndex === currentWord.length) {
          isDeleting = true;
          setCursorTyping(false);
          timeoutId = setTimeout(tick, holdDuration);
          return;
        }

        var jitter = Math.floor(Math.random() * 30) - 15;
        timeoutId = setTimeout(tick, typeSpeed + jitter);
      }
    }

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          isVisible = entry.isIntersecting;
        });
      }, { threshold: 0.1 });
      observer.observe(el);
    }

    timeoutId = setTimeout(function () {
      isDeleting = true;
      tick();
    }, 1800);
  });
}
initTypewriter();

/* ==========================================================================
   Services Page Dedicated Design Spells Suite
   ========================================================================== */
function initServicesSpells() {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasHover = window.matchMedia('(hover: hover)').matches;

  // Spell 1: Telemetry Reading Progress Beam in Sticky Subnav
  var telemetry = document.getElementById('servicesTelemetry');
  if (telemetry && !telemetry.dataset.telemetryInit && !reduceMotion) {
    telemetry.dataset.telemetryInit = 'true';
    var updateTelemetry = function () {
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      if (docH <= 0) return;
      var scrollY = window.scrollY || window.pageYOffset;
      var progress = Math.min(1, Math.max(0, scrollY / docH));
      telemetry.style.transform = 'scaleX(' + progress.toFixed(4) + ')';
    };

    window.addEventListener('scroll', updateTelemetry, { passive: true });
    window.addEventListener('resize', updateTelemetry, { passive: true });
    updateTelemetry();
  }

  // Spell 2: Radial Cursor Spotlight on Cards
  if (hasHover && !reduceMotion) {
    var spotlightCards = document.querySelectorAll('[data-spell="card-spotlight"]:not([data-spot-bound])');
    spotlightCards.forEach(function (card) {
      card.dataset.spotBound = 'true';
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        card.style.setProperty('--spot-x', x + 'px');
        card.style.setProperty('--spot-y', y + 'px');
      }, { passive: true });
    });
  }

  // Spell 5: Haptic Click-Ripple on Planner Diagnostic Options
  var plannerOptions = document.querySelectorAll('.planner-option:not([data-ripple-bound])');
  if (plannerOptions.length && !reduceMotion) {
    plannerOptions.forEach(function (opt) {
      opt.dataset.rippleBound = 'true';
      opt.addEventListener('click', function (e) {
        var rect = opt.getBoundingClientRect();
        var ripple = document.createElement('span');
        ripple.className = 'spell-ripple-fx';
        var size = Math.max(rect.width, rect.height);
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

        opt.appendChild(ripple);
        setTimeout(function () {
          if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
        }, 600);
      });
    });
  }
}
initServicesSpells();

/* /* ==========================================================================
   Design Spells & Interactive Systems: Work & Case Studies Page
   ========================================================================== */
function initWorkSpells() {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasHover = window.matchMedia('(hover: hover)').matches;

  var filterWrap = document.getElementById('workFilterBar');
  if (filterWrap && !filterWrap.dataset.filterInit) {
    filterWrap.dataset.filterInit = 'true';

    var filterButtons = filterWrap.querySelectorAll('.work-filter-btn');
    var workItems = document.querySelectorAll('[data-work-category]');
    var sectionBlocks = document.querySelectorAll('.work-section-block');
    var tabWrap = filterWrap.querySelector('.work-filter-wrap');

    // Spell 1: Sliding Morphing Filter Thumb
    var thumb = filterWrap.querySelector('.work-filter-thumb');
    if (!thumb && tabWrap) {
      thumb = document.createElement('div');
      thumb.className = 'work-filter-thumb';
      tabWrap.appendChild(thumb);
    }

    var updateThumb = function () {
      if (!thumb || !tabWrap) return;
      var activeBtn = tabWrap.querySelector('.work-filter-btn.active');
      if (activeBtn) {
        thumb.style.transform = 'translateX(' + activeBtn.offsetLeft + 'px)';
        thumb.style.width = activeBtn.offsetWidth + 'px';
        thumb.style.opacity = '1';
      } else {
        thumb.style.opacity = '0';
      }
    };

    var applyFilter = function (category) {
      filterButtons.forEach(function (btn) {
        var match = btn.getAttribute('data-filter') === category;
        btn.classList.toggle('active', match);
        btn.setAttribute('aria-selected', match ? 'true' : 'false');
      });

      updateThumb();

      var visibleIdx = 0;
      workItems.forEach(function (item) {
        var itemCategories = (item.getAttribute('data-work-category') || '').split(' ');
        var shouldShow = category === 'all' || itemCategories.indexOf(category) !== -1;

        if (shouldShow) {
          item.classList.remove('is-hidden');
          item.style.display = '';
          var delay = reduceMotion ? 0 : Math.min(visibleIdx * 35, 200);
          visibleIdx++;
          setTimeout(function () {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0) scale(1)';
          }, delay);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(8px) scale(0.98)';
          item.classList.add('is-hidden');
          item.style.display = 'none';
        }
      });

      sectionBlocks.forEach(function (sec) {
        var secCat = sec.getAttribute('data-section-category');
        if (!secCat || category === 'all' || secCat.split(' ').indexOf(category) !== -1) {
          sec.classList.remove('is-hidden');
        } else {
          sec.classList.add('is-hidden');
        }
      });
    };

    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = this.getAttribute('data-filter');
        applyFilter(filter);
        if (history.pushState) {
          history.pushState(null, null, filter === 'all' ? window.location.pathname : '#' + filter);
        }
      });
    });

    window.addEventListener('resize', updateThumb, { passive: true });

    var handleHash = function () {
      var hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash && filterWrap.querySelector('[data-filter="' + hash + '"]')) {
        applyFilter(hash);
      } else {
        applyFilter('all');
      }
    };

    window.addEventListener('popstate', handleHash);
    setTimeout(function () {
      handleHash();
      updateThumb();
    }, 60);
  }

  // Spell 2: 3D Perspective Tilt & Specular Bezel Glare on Mockup Windows
  if (hasHover && !reduceMotion) {
    var mockupWindows = document.querySelectorAll('.work-mockup-window:not([data-tilt-bound])');
    mockupWindows.forEach(function (win) {
      win.dataset.tiltBound = 'true';
      var glare = win.querySelector('.work-mockup-glare');
      if (!glare) {
        glare = document.createElement('div');
        glare.className = 'work-mockup-glare';
        win.appendChild(glare);
      }

      win.addEventListener('mousemove', function (e) {
        var rect = win.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = ((y - centerY) / centerY) * -5.5;
        var rotateY = ((x - centerX) / centerX) * 5.5;

        win.style.transform = 'perspective(1000px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) translateY(-4px)';
        win.style.setProperty('--glare-x', x + 'px');
        win.style.setProperty('--glare-y', y + 'px');
      }, { passive: true });

      win.addEventListener('mouseleave', function () {
        win.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }

  // Spell 3: Rolling Stat Counters with Easing
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var counters = document.querySelectorAll('[data-spell="counter"]:not([data-counter-bound])');
    if (counters.length) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            observer.unobserve(el);
            var targetVal = parseFloat(el.getAttribute('data-val') || '0');
            var prefix = el.getAttribute('data-prefix') || '';
            var suffix = el.getAttribute('data-suffix') || '';
            var duration = 1300;
            var startTime = performance.now();

            var hasLeadingSpace = suffix.charAt(0) === ' ' || el.getAttribute('data-suffix-space') === 'true' || suffix.toLowerCase() === 'days';
            var cleanSuffix = suffix.trim();
            var renderSuffix = function (val) {
              return prefix + val + (hasLeadingSpace ? '&nbsp;' : '') + '<span class="signal">' + cleanSuffix + '</span>';
            };

            var step = function (currentTime) {
              var progress = Math.min((currentTime - startTime) / duration, 1);
              var ease = 1 - Math.pow(1 - progress, 3);
              var currentVal = Math.round(targetVal * ease);
              el.innerHTML = renderSuffix(currentVal);
              if (progress < 1) {
                requestAnimationFrame(step);
              } else {
                el.innerHTML = renderSuffix(targetVal);
              }
            };
            requestAnimationFrame(step);
          }
        });
      }, { threshold: 0.2 });

      counters.forEach(function (c) {
        c.dataset.counterBound = 'true';
        observer.observe(c);
      });
    }
  }

  // Spell 4: Zero-Latency High-Res Lightbox Modal
  var lightbox = document.querySelector('.work-lightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.className = 'work-lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.innerHTML =
      '<div class="work-lightbox-dialog">' +
        '<div class="work-lightbox-header">' +
          '<span class="work-lightbox-title" id="lightboxTitle">Project Inspection</span>' +
          '<button class="work-lightbox-close" type="button" aria-label="Close preview"><i class="fa-solid fa-xmark"></i></button>' +
        '</div>' +
        '<div class="work-lightbox-body">' +
          '<img class="work-lightbox-img" id="lightboxImg" src="" alt="Expanded preview">' +
        '</div>' +
        '<div class="work-lightbox-footer">' +
          '<span class="work-lightbox-meta" id="lightboxMeta"></span>' +
          '<div style="display:flex; align-items:center; gap:12px;">' +
            '<span class="work-lightbox-counter" id="lightboxCounter" style="font-family:var(--font-mono, monospace); font-size:11.5px; color:var(--ink-300);"></span>' +
            '<div style="display:flex; gap:8px;">' +
              '<button class="work-lightbox-nav-btn" id="lightboxPrev" type="button"><i class="fa-solid fa-chevron-left"></i> Prev</button>' +
              '<button class="work-lightbox-nav-btn" id="lightboxNext" type="button">Next <i class="fa-solid fa-chevron-right"></i></button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(lightbox);

    var lbClose = lightbox.querySelector('.work-lightbox-close');
    var lbPrev = document.getElementById('lightboxPrev');
    var lbNext = document.getElementById('lightboxNext');

    var closeLightbox = function () {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    lbPrev.addEventListener('click', function () {
      var items = window.__lbActiveItems || [];
      if (items.length <= 1) return;
      window.__lbCurrentIdx = (window.__lbCurrentIdx - 1 + items.length) % items.length;
      renderLightboxItem(window.__lbCurrentIdx);
    });

    lbNext.addEventListener('click', function () {
      var items = window.__lbActiveItems || [];
      if (items.length <= 1) return;
      window.__lbCurrentIdx = (window.__lbCurrentIdx + 1) % items.length;
      renderLightboxItem(window.__lbCurrentIdx);
    });

    window.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lbPrev.click();
      if (e.key === 'ArrowRight') lbNext.click();
    });
  }

  function getScopedLightboxGroup(item) {
    // 1. Explicit data-lightbox-group
    var groupName = item.getAttribute('data-lightbox-group');
    if (groupName) {
      return Array.from(document.querySelectorAll('[data-lightbox-group="' + groupName + '"]:not(.is-hidden)'));
    }
    // 2. Inside Interface Gallery Grid
    var galleryGrid = item.closest('.work-gallery-grid');
    if (galleryGrid) {
      return Array.from(galleryGrid.querySelectorAll('.work-gallery-item:not(.is-hidden)'));
    }
    // 3. Inside Performance Marketing Cards
    var perfGrid = item.closest('.work-perf-grid, section[data-section-category="marketing"]');
    if (perfGrid) {
      return Array.from(perfGrid.querySelectorAll('[data-spell="lightbox"]:not(.is-hidden)'));
    }
    // 4. Standalone element
    return [item];
  }

  function renderLightboxItem(idx) {
    var items = window.__lbActiveItems || [];
    if (idx < 0 || idx >= items.length) return;
    window.__lbCurrentIdx = idx;
    var item = items[idx];
    var img = item.querySelector('img');
    var titleEl = item.querySelector('.work-gallery-name, .work-card-title, h3');
    var metaEl = item.querySelector('.work-gallery-role, .stat-highlight, .work-tag-pill');

    var lbImg = document.getElementById('lightboxImg');
    var lbTitle = document.getElementById('lightboxTitle');
    var lbMeta = document.getElementById('lightboxMeta');
    var lbCounter = document.getElementById('lightboxCounter');
    var lbPrev = document.getElementById('lightboxPrev');
    var lbNext = document.getElementById('lightboxNext');

    if (lbImg) lbImg.src = img ? (item.getAttribute('data-full-src') || img.src) : '';
    if (lbTitle) lbTitle.textContent = titleEl ? titleEl.textContent : 'Project Inspection';
    if (lbMeta) lbMeta.textContent = metaEl ? metaEl.textContent : '';

    if (lbCounter) {
      if (items.length > 1) {
        lbCounter.textContent = (idx + 1) + ' / ' + items.length;
        lbCounter.style.display = '';
      } else {
        lbCounter.textContent = '';
        lbCounter.style.display = 'none';
      }
    }

    if (lbPrev && lbNext) {
      if (items.length <= 1) {
        lbPrev.style.display = 'none';
        lbNext.style.display = 'none';
      } else {
        lbPrev.style.display = '';
        lbNext.style.display = '';
      }
    }

    var lb = document.querySelector('.work-lightbox');
    if (lb) lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function openLightboxForItem(item) {
    var group = getScopedLightboxGroup(item);
    window.__lbActiveItems = group;
    var idx = group.indexOf(item);
    renderLightboxItem(idx >= 0 ? idx : 0);
  }

  var galleryItems = Array.from(document.querySelectorAll('.work-gallery-item:not([data-lb-bound]), [data-spell="lightbox"]:not([data-lb-bound])'));
  galleryItems.forEach(function (item) {
    item.dataset.lbBound = 'true';
    item.style.cursor = 'pointer';
    item.addEventListener('click', function () {
      openLightboxForItem(item);
    });
  });

  // Spell 5: URL Pill Clipboard Copy with Live Ping Feedback
  var urlPills = document.querySelectorAll('[data-spell="copy-url"]:not([data-copy-bound])');
  urlPills.forEach(function (pill) {
    pill.dataset.copyBound = 'true';
    pill.addEventListener('click', function (e) {
      e.stopPropagation();
      var url = pill.getAttribute('data-url') || ('https://' + pill.textContent.trim());
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () {
          var toast = pill.querySelector('.work-url-copied-toast');
          if (toast) {
            toast.classList.add('is-visible');
            setTimeout(function () {
              toast.classList.remove('is-visible');
            }, 1800);
          }
        });
      }
    });
  });

  // Spell 6: Interactive Sprint Scope Matrix Switcher
  var scopeTabs = document.querySelectorAll('.sprint-calc-tab:not([data-scope-bound])');
  var scopeTitle = document.getElementById('sprintCalcTitle');
  var scopeBadge = document.getElementById('sprintCalcBadge');
  var scopeList = document.getElementById('sprintCalcList');

  if (scopeTabs.length && scopeTitle && scopeBadge && scopeList) {
    var scopeData = {
      mvp: {
        title: 'Rapid Market Entry Sprint',
        badge: '<i class="fa-solid fa-bolt"></i> 14 Days Delivery',
        items: [
          'High-conversion landing page architecture',
          'Full-fidelity Figma UI design system',
          'Sub-second Framer / Static HTML deployment',
          'Direct founder execution (Zero handoffs)'
        ]
      },
      full: {
        title: 'Full Brand & Technical Ecosystem',
        badge: '<i class="fa-solid fa-shield-halved"></i> 4 Weeks Delivery',
        items: [
          'Multi-page responsive web platform',
          'Schema.org Knowledge Graph & AI Visibility (GEO)',
          'Automated Lead Triage / CRM sync pipeline',
          '100/100 Lighthouse Performance audit guarantee'
        ]
      },
      growth: {
        title: 'Direct-Response Growth Retainer',
        badge: '<i class="fa-solid fa-chart-line"></i> Monthly Sprint Engine',
        items: [
          'Meta Ads creative testing (Sub-₹50 CPL funnels)',
          'Weekly budget re-allocation to winning ad sets',
          'Search Engine commercial buyer cluster ranking',
          'Live Slack access & weekly async video walkthroughs'
        ]
      }
    };

    scopeTabs.forEach(function (tab) {
      tab.dataset.scopeBound = 'true';
      tab.addEventListener('click', function () {
        scopeTabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        var key = tab.getAttribute('data-scope');
        var data = scopeData[key];
        if (data) {
          scopeTitle.textContent = data.title;
          scopeBadge.innerHTML = data.badge;
          scopeList.innerHTML = data.items.map(function (txt) {
            return '<li class="sprint-calc-item"><i class="fa-solid fa-circle-check"></i> ' + txt + '</li>';
          }).join('');
        }
      });
    });
  }
}
initWorkSpells();

/* ==========================================================================
   MASTER DESIGN SPELLS REHYDRATION LIFECYCLE
   ========================================================================== */
window.initPageSpells = function () {
  if (typeof initFaq === 'function') initFaq();
  if (typeof initCounters === 'function') initCounters();
  if (typeof initStack === 'function') initStack();
  if (typeof initMagnetics === 'function') initMagnetics();
  if (typeof initFieldSpotlights === 'function') initFieldSpotlights();
  if (typeof initCardSpotlights === 'function') initCardSpotlights();
  if (typeof initCaseShowcase === 'function') initCaseShowcase();
  if (typeof initDisciplineShowcase === 'function') initDisciplineShowcase();
  if (typeof initFooterReveal === 'function') initFooterReveal();
  if (typeof initServicesSubnav === 'function') initServicesSubnav();
  if (typeof initEngagementModels === 'function') initEngagementModels();
  if (typeof initSprintPlanner === 'function') initSprintPlanner();
  if (typeof initTypewriter === 'function') initTypewriter();
  if (typeof initServicesSpells === 'function') initServicesSpells();
  if (typeof initWorkSpells === 'function') initWorkSpells();
  if (typeof initAnchorScrolls === 'function') initAnchorScrolls();
};

/* ==========================================================================
   DESIGN SPELL: KINETIC TELEMETRY PAGE TRANSITION ENGINE
   ========================================================================== */
(function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var pageCache = new Map();
  var isNavigating = false;

  // 1. Ensure Telemetry Beam and Kinetic Shutter exist in DOM
  var beam = document.getElementById('spellTransitBeam');
  if (!beam) {
    beam = document.createElement('div');
    beam.id = 'spellTransitBeam';
    document.body.appendChild(beam);
  }

  // Clean up any legacy curtain element
  var oldCurtain = document.getElementById('spellTransitCurtain');
  if (oldCurtain && oldCurtain.parentNode) {
    oldCurtain.parentNode.removeChild(oldCurtain);
  }

  var navCounter = 0;
  var pendingTimer = null;

  function normalizeUrl(url) {
    try {
      var u = new URL(url, window.location.origin);
      var path = u.pathname;
      if (path !== '/' && path.endsWith('/')) path = path.slice(0, -1);
      return path + u.search;
    } catch (e) {
      return url;
    }
  }

  // Pre-seed current page HTML into cache and warm up primary routes immediately
  pageCache.set(normalizeUrl(window.location.href), document.documentElement.outerHTML);
  ['/', '/services', '/work', '/contact'].forEach(function (path) {
    try {
      var full = window.location.origin + path;
      if (normalizeUrl(full) !== normalizeUrl(window.location.href)) {
        prefetch(full);
      }
    } catch (e) {}
  });

  function isInternalLink(a) {
    if (!a || !a.href) return false;
    if (a.target && a.target !== '_self' && a.target !== '') return false;
    if (a.hasAttribute('download')) return false;
    var rawHref = a.getAttribute('href') || '';
    if (rawHref.startsWith('javascript:') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:')) return false;

    try {
      var targetUrl = new URL(a.href, window.location.origin);
      return targetUrl.origin === window.location.origin;
    } catch (e) {
      return false;
    }
  }

  // Pre-Cognitive Link Warmup: Prefetch on hover or touchstart
  function prefetch(url) {
    var key = normalizeUrl(url);
    if (pageCache.has(key)) return Promise.resolve(pageCache.get(key));

    return fetch(url, { credentials: 'same-origin', headers: { 'X-Requested-With': 'FlexFlowTransit' } })
      .then(function (res) {
        if (!res.ok) throw new Error('Status ' + res.status);
        return res.text();
      })
      .then(function (html) {
        pageCache.set(key, html);
        return html;
      })
      .catch(function (err) {
        return null;
      });
  }

  function attachPrefetchListeners() {
    var links = document.querySelectorAll('a[href]');
    links.forEach(function (link) {
      if (isInternalLink(link) && !link.dataset.prefetchBound) {
        link.dataset.prefetchBound = 'true';
        var triggerPrefetch = function () {
          var href = link.getAttribute('href');
          if (href && !href.startsWith('#')) {
            prefetch(link.href);
          }
        };
        link.addEventListener('mouseenter', triggerPrefetch, { passive: true });
        link.addEventListener('touchstart', triggerPrefetch, { passive: true });
        link.addEventListener('focus', triggerPrefetch, { passive: true });
      }
    });
  }

  function updateNavActiveStates(targetPath) {
    var normalized = targetPath.toLowerCase();
    if (normalized.endsWith('.html')) normalized = normalized.replace('.html', '');
    if (normalized === '/index') normalized = '/';

    var navLinks = document.querySelectorAll('#siteNav .navigation-links a, #navMenu .navigation-menu-links a');
    navLinks.forEach(function (link) {
      var linkPath = link.getAttribute('href');
      if (!linkPath) return;
      var cleanLink = linkPath.toLowerCase();
      if (cleanLink.endsWith('.html')) cleanLink = cleanLink.replace('.html', '');
      if (cleanLink === '/index') cleanLink = '/';

      var isActive = false;
      if (normalized === '/' && (cleanLink === '/' || cleanLink === '/index')) {
        isActive = true;
      } else if (normalized !== '/' && cleanLink === normalized) {
        isActive = true;
      }

      if (isActive) {
        link.setAttribute('aria-current', 'page');
        link.classList.add('active');
      } else {
        link.removeAttribute('aria-current');
        link.classList.remove('active');
      }
    });
  }

  function navigateTo(url, isPopState) {
    var targetUrl;
    try {
      targetUrl = new URL(url, window.location.origin);
    } catch (e) {
      window.location.href = url;
      return;
    }

    var currentUrl = new URL(window.location.href);

    // 1. Same-page hash anchor smooth scroll
    if (targetUrl.pathname === currentUrl.pathname && targetUrl.hash) {
      var anchor = document.querySelector(targetUrl.hash);
      if (anchor) {
        if (window.__lenis) {
          window.__lenis.scrollTo(anchor, { offset: -80, duration: 0.8 });
        } else {
          anchor.scrollIntoView({ behavior: 'smooth' });
        }
        if (!isPopState && history.pushState) {
          history.pushState(null, null, targetUrl.href);
        }
        return;
      }
    }

    // 2. Same-page scroll to top
    if (targetUrl.pathname === currentUrl.pathname && !targetUrl.hash) {
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { duration: 0.6 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    // 3. Special handling for /about when already on homepage
    if (targetUrl.pathname === '/about' && (currentUrl.pathname === '/' || currentUrl.pathname === '/index.html')) {
      var aboutEl = document.querySelector('#about');
      if (aboutEl) {
        if (window.__lenis) {
          window.__lenis.scrollTo(aboutEl, { offset: -90, duration: 0.8 });
        } else {
          aboutEl.scrollIntoView({ behavior: 'smooth' });
        }
        updateNavActiveStates('/about');
        if (!isPopState && history.pushState) {
          history.pushState(null, null, targetUrl.href);
        }
        return;
      }
    }

    // 4. Special handling for /about when on other pages
    var customDisplayPath = null;
    if (targetUrl.pathname === '/about') {
      targetUrl = new URL('/index.html#about', window.location.origin);
      customDisplayPath = '/about';
    }

    // Incremental navigation counter to cancel / supersede any previous in-flight transition
    var thisNavId = ++navCounter;
    if (pendingTimer) {
      clearTimeout(pendingTimer);
      pendingTimer = null;
    }

    // Telemetry Laser Beam starts immediately
    beam.classList.add('is-active');
    beam.style.width = '70%';

    var currentMain = document.getElementById('main') || document.querySelector('.site-main');
    if (currentMain && !reduceMotion) {
      currentMain.classList.add('page-is-leaving');
    }

    // Fetch page HTML
    var fetchPromise = prefetch(targetUrl.href).then(function (html) {
      if (!html) throw new Error('Empty response');
      return html;
    }).catch(function (err) {
      console.warn('Transition fallback to native reload:', err);
      window.location.href = targetUrl.href;
      return null;
    });

    var minExitDelay = new Promise(function (resolve) {
      setTimeout(resolve, reduceMotion ? 0 : 70);
    });

    Promise.all([fetchPromise, minExitDelay]).then(function (results) {
      if (thisNavId !== navCounter) return; // Superseded by a newer navigation click
      var html = results[0];
      if (!html) return;

      beam.style.width = '100%';

      swapPageDOM(html, targetUrl, isPopState, customDisplayPath);

      var newMain = document.getElementById('main') || document.querySelector('.site-main');
      if (newMain) {
        newMain.style.backgroundColor = '#0C0B12';
        if (!reduceMotion) {
          newMain.classList.add('page-is-entering');
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              newMain.classList.remove('page-is-entering');
            });
          });
        }
      }

      pendingTimer = setTimeout(function () {
        beam.classList.remove('is-active');
        beam.style.width = '0%';
      }, 160);
    });
  }

  function swapPageDOM(html, targetUrl, isPopState, customDisplayPath) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, 'text/html');

    // 1. Update document title
    if (doc.title) {
      document.title = doc.title;
    }

    // 2. Update meta description
    var currentMetaDesc = document.querySelector('meta[name="description"]');
    var newMetaDesc = doc.querySelector('meta[name="description"]');
    if (currentMetaDesc && newMetaDesc) {
      currentMetaDesc.setAttribute('content', newMetaDesc.getAttribute('content'));
    }

    // 3. Swap <main id="main">
    var currentMain = document.getElementById('main') || document.querySelector('.site-main');
    var newMain = doc.getElementById('main') || doc.querySelector('.site-main');
    if (currentMain && newMain) {
      newMain.style.backgroundColor = '#0C0B12';
      currentMain.parentNode.replaceChild(newMain, currentMain);
    }

    // 4. Update Footer if present
    var currentFooter = document.querySelector('.footer, .site-footer');
    var newFooter = doc.querySelector('.footer, .site-footer');
    if (currentFooter && newFooter) {
      currentFooter.innerHTML = newFooter.innerHTML;
    }

    // 5. Update Navigation active links
    var displayPath = customDisplayPath || targetUrl.pathname;
    updateNavActiveStates(displayPath);

    // 6. Push history state if not popstate
    if (!isPopState && history.pushState) {
      var historyUrl = customDisplayPath ? (window.location.origin + customDisplayPath) : targetUrl.href;
      history.pushState({ url: historyUrl }, '', historyUrl);
    }

    // 7. Scroll position reset or scroll to target hash
    if (targetUrl.hash) {
      var anchor = document.querySelector(targetUrl.hash);
      if (anchor) {
        if (window.__lenis) {
          window.__lenis.scrollTo(anchor, { offset: -90, duration: 0.8 });
        } else {
          anchor.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
        else window.scrollTo(0, 0);
      }
    } else {
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    }

    // 8. Rehydrate all interactive Design Spells on the new page
    if (typeof window.initPageSpells === 'function') {
      window.initPageSpells();
    }

    // Reattach prefetch listeners to all links
    attachPrefetchListeners();

    // Dispatch global event for any external consumers
    window.dispatchEvent(new CustomEvent('flexflow:pagetransition', {
      detail: { url: targetUrl.href }
    }));
  }

  // Intercept internal link clicks
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a');
    if (!link) return;

    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) return;

    if (!isInternalLink(link)) return;

    var rawHref = link.getAttribute('href');
    if (!rawHref || rawHref.startsWith('#')) return;

    e.preventDefault();

    if (typeof window.closeMobileNav === 'function') {
      window.closeMobileNav();
    }

    navigateTo(link.href, false);
  });

  // Handle browser Back / Forward buttons
  window.addEventListener('popstate', function () {
    navigateTo(window.location.href, true);
  });

  // Handle direct loads of /about
  if (window.location.pathname === '/about') {
    updateNavActiveStates('/about');
    setTimeout(function () {
      var aboutEl = document.querySelector('#about');
      if (aboutEl) {
        if (window.__lenis) window.__lenis.scrollTo(aboutEl, { offset: -90, duration: 0.8 });
        else aboutEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  }

  // Initial prefetch binding
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachPrefetchListeners);
  } else {
    attachPrefetchListeners();
  }

  // Expose API on window
  window.__spellTransition = {
    navigateTo: navigateTo,
    prefetch: prefetch
  };
})();




