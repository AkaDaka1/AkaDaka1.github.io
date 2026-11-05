/*
 * AkaDaka1.github.io — интерактив страницы.
 *
 * Модули:
 *   1. Переключатель языка RU/EN (без перезагрузки, выбор сохраняется).
 *   2. Подсветка активного пункта меню при прокрутке.
 *   3. Появление карточек при скролле (IntersectionObserver).
 *   4. Анимированный фон: точки + тонкие связи, пауза на скрытой вкладке
 *      и при prefers-reduced-motion.
 */

(() => {
  "use strict";

  document.documentElement.classList.add("js");

  /* =======================================================
     1. Локализация
     ======================================================= */

  const translations = {
    ru: {
      "meta.title": "Данил Момот — Python-разработчик",
      "hero.name": "Данил Момот",
      "nav.about": "О себе",
      "nav.projects": "Проекты",
      "nav.skills": "Навыки",
      "about.title": "О себе",
      "about.note": "кратко",
      "about.p1": "Привет, я Данил — Python-разработчик. Делаю десктопные приложения и бэкенд: от идеи и архитектуры до релиза с автотестами и CI/CD.",
      "about.p2": "Автор <strong>ClicKit</strong> — автокликера для Windows с визуальным блочным редактором сценариев. Внутри — Python, PySide6/Qt, Blockly и облачный REST-сервис на FastAPI с PostgreSQL.",
      "about.p3": "Больше всего люблю полный цикл: понятная архитектура, тесты, которые реально ловят баги, контейнеры, собирающиеся одинаково на любой машине, и интерфейс, к которому не нужна инструкция.",
      "hubs.title": "Контакты",
      "hubs.release": "Релизы",
      "projects.title": "Проекты",
      "projects.note": "то, что уже работает",
      "projects.clikit": "Автокликер для Windows с блочным редактором сценариев: собираешь клики, паузы и циклы из блоков — без кода.",
      "projects.leetcode": "Коллекция моих решений задач LeetCode на Python: алгоритмы, структуры данных, разбор сложности.",
      "projects.chip.algo": "Алгоритмы",
      "projects.more": "Следующий проект",
      "projects.moreDesc": "уже собирается...",
      "skills.title": "Навыки",
      "skills.langs": "Языки",
      "skills.backend": "Бэкенд",
      "skills.desktop": "Десктоп",
      "skills.tools": "Инструменты",
      "footer.nav": "Навигация",
      "footer.about": "✦ О себе",
      "footer.projects": "⚡ Проекты",
      "footer.skills": "◆ Навыки",
      "footer.links": "Ссылки",
      "footer.cta": "Есть идея?",
      "footer.write": "Написать мне",
      "footer.made": "сделано на Python и 💚",
    },
    en: {
      "meta.title": "Danil Momot — Python Developer",
      "hero.name": "Danil Momot",
      "nav.about": "About",
      "nav.projects": "Projects",
      "nav.skills": "Skills",
      "about.title": "About",
      "about.note": "short version",
      "about.p1": "Hi, I'm Danil — a Python developer. I build desktop apps and backends: from idea and architecture to a release with tests and CI/CD.",
      "about.p2": "Author of <strong>ClicKit</strong>, an auto-clicker for Windows with a visual block-based scenario editor. Under the hood: Python, PySide6/Qt, Blockly and a cloud REST service on FastAPI with PostgreSQL.",
      "about.p3": "What I enjoy most is the full cycle: a clear architecture, tests that actually catch bugs, containers that build the same on every machine, and an interface that needs no manual.",
      "hubs.title": "Hubs",
      "hubs.release": "Releases",
      "projects.title": "Projects",
      "projects.note": "things that already work",
      "projects.clikit": "A Windows auto-clicker with a block-based scenario editor: snap clicks, delays and loops together — no code required.",
      "projects.leetcode": "My collection of LeetCode solutions in Python: algorithms, data structures and complexity notes.",
      "projects.chip.algo": "Algorithms",
      "projects.more": "More Projects",
      "projects.moreDesc": "currently building...",
      "skills.title": "Skills",
      "skills.langs": "Languages",
      "skills.backend": "Backend",
      "skills.desktop": "Desktop",
      "skills.tools": "Tools",
      "footer.nav": "Navigation",
      "footer.about": "✦ About me",
      "footer.projects": "⚡ Projects",
      "footer.skills": "◆ Skills",
      "footer.links": "Links",
      "footer.cta": "Have an idea?",
      "footer.write": "Write message",
      "footer.made": "made with Python 💚",
    },
  };

  const STORAGE_KEY = "akadaka1.lang";
  const langButtons = Array.from(document.querySelectorAll(".lang-btn"));
  const translatable = Array.from(document.querySelectorAll("[data-i18n]"));

  /** Язык по умолчанию: сохранённый выбор → язык браузера → русский. */
  function pickInitialLang() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "ru" || saved === "en") return saved;
    } catch (_) {
      /* приватный режим — localStorage недоступен */
    }
    const browser = (navigator.language || "ru").toLowerCase();
    return browser.startsWith("ru") ? "ru" : "en";
  }

  function applyLang(lang) {
    const dict = translations[lang] || translations.ru;

    translatable.forEach((el) => {
      const value = dict[el.dataset.i18n];
      if (value !== undefined) el.innerHTML = value;
    });

    document.documentElement.lang = lang;

    const title = document.querySelector('meta[name="description"]');
    if (title && dict["meta.title"]) document.title = dict["meta.title"];

    langButtons.forEach((btn) => {
      const isActive = btn.dataset.lang === lang;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (_) {
      /* игнорируем */
    }
  }

  langButtons.forEach((btn) => {
    btn.addEventListener("click", () => applyLang(btn.dataset.lang));
  });

  applyLang(pickInitialLang());

  /* =======================================================
     2. Активный пункт меню при прокрутке
     ======================================================= */

  const navLinks = Array.from(document.querySelectorAll("a.nav-link"));
  const sections = Array.from(document.querySelectorAll("main .section"));

  function setActive(link) {
    navLinks.forEach((l) => l.classList.toggle("active", l === link));
  }

  function onScroll() {
    const probe = window.scrollY + 160;
    let current = null;
    sections.forEach((sec) => {
      if (probe >= sec.offsetTop && probe < sec.offsetTop + sec.offsetHeight) {
        current = sec.id;
      }
    });
    if (current) {
      setActive(navLinks.find((l) => l.getAttribute("href") === "#" + current) || null);
    }
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => setActive(link));
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* =======================================================
     3. Появление карточек при скролле
     ======================================================= */

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = document.querySelectorAll(".reveal");

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((el) => el.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealItems.forEach((el) => observer.observe(el));
  }

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* =======================================================
     4. Анимированный фон
     ======================================================= */

  const canvas = document.getElementById("bgCanvas");
  if (!canvas || reducedMotion) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let dots = [];
  let frameId = 0;

  const LINK_DISTANCE = 130;

  function createDots() {
    // Плотность точек зависит от площади экрана; на телефоне их сильно меньше.
    const count = Math.min(160, Math.round((width * height) / 16000));
    dots = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 0.6 + Math.random() * 1.1,
      dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.35,
      alpha: 0.18 + Math.random() * 0.5,
      green: Math.random() < 0.25,
    }));
  }

  function resize() {
    dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createDots();
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (const d of dots) {
      d.x += d.dx;
      d.y += d.dy;
      if (d.x < -20) d.x = width + 20;
      if (d.x > width + 20) d.x = -20;
      if (d.y < -20) d.y = height + 20;
      if (d.y > height + 20) d.y = -20;
    }

    // Тонкие линии между близкими точками — как связка блоков в ClicKit.
    ctx.lineWidth = 0.6;
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const a = dots[i];
        const b = dots[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 > LINK_DISTANCE * LINK_DISTANCE) continue;
        const strength = 1 - Math.sqrt(dist2) / LINK_DISTANCE;
        ctx.strokeStyle = `rgba(88, 101, 242, ${0.13 * strength})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    for (const d of dots) {
      ctx.globalAlpha = d.alpha;
      ctx.fillStyle = d.green ? "#41cd52" : "#8b96ff";
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    frameId = window.requestAnimationFrame(draw);
  }

  function start() {
    if (!frameId) frameId = window.requestAnimationFrame(draw);
  }

  function stop() {
    window.cancelAnimationFrame(frameId);
    frameId = 0;
  }

  resize();
  start();

  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resize, 150);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });
})();
