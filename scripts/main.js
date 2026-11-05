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
      "meta.title": "Данил Момот — SRE / Python",
      "hero.name": "Данил Момот",
      "hero.role": "SRE (junior) · Python · Linux · Docker · CI/CD",
      "nav.about": "О себе",
      "nav.experience": "Опыт",
      "nav.skills": "Стек",
      "nav.infra": "Инфраструктура",

      "about.title": "О себе",
      "about.note": "кратко",
      "about.p1": "SRE — направление, куда иду осознанно: меньше ручной работы, больше автоматизации и надёжности. Python — <strong>7 лет</strong>; Linux — рабочая среда: администрирую собственный сервер, разворачиваю сервисы через Docker/Compose и bash.",
      "about.p2": "Строю <strong>ClicKit</strong>: <strong>274 автотеста</strong>, CI/CD на GitHub Actions, Docker-образы, релиз 1.0.0. Сейчас добавляю сервисный слой: FastAPI + PostgreSQL, метрики, логи и трейсы, SLO и Terraform / k3s.",
      "about.p3": "Ищу стажировку SRE, чтобы отвечать за надёжность на реальном масштабе. Готов к офису, удалёнке или гибриду — Санкт-Петербург.",

      "hubs.title": "Контакты",
      "hubs.release": "Релизы",

      "exp.title": "Опыт и проекты",
      "exp.note": "разработка + эксплуатация",
      "exp.role.devops": "разработчик и эксплуатант",

      "exp.clikit.subtitle": "Windows-приложение для автоматизации",
      "exp.clikit.period": "2026 — настоящее время",
      "exp.clikit.1": "Сценарии автоматизации собираются из визуальных блоков (Python 3.11+, PySide6, Blockly) — без кода и без исполнения произвольного кода.",
      "exp.clikit.2": "274 автотеста, ruff; CI/CD на GitHub Actions: линт, тесты 3.11–3.13, тесты в Linux-контейнере, релиз по тегу.",
      "exp.clikit.3": "Docker: Linux-образ тестов (Xvfb) и Windows-образ сборки (servercore), .dockerignore, воспроизводимая сборка.",
      "exp.clikit.4": "Релиз 1.0.0: PyInstaller, SHA-256, NOTICE, smoke-запуск собранного приложения.",
      "exp.clikit.5": "Надёжность: аварийный стоп, валидируемый IR-формат .acl.json, лимиты, атомарные сохранения, ротация логов.",
      "exp.clikit.repo": "Репозиторий и релиз 1.0.0",

      "exp.theatre.title": "Генератор иммерсивного театра — ВКР",
      "exp.theatre.period": "2024 — 2026",
      "exp.theatre.1": "FastAPI + PostgreSQL: 4 сущности, миграции при смене схемы.",
      "exp.theatre.2": "Docker Compose dev/prod, конфигурация через .env — одинаковое окружение локально и на сервере.",
      "exp.theatre.3": "75+ автотестов pytest на API и бизнес-логику.",
      "exp.theatre.4": "n8n как отдельный сервис, интеграция через вебхуки.",
      "exp.theatre.5": "Развёртывание и сопровождение на собственном Linux-сервере: SSH, firewall, обновление и перезапуск сервисов.",

      "exp.bots.title": "Telegram- и Discord-боты на собственном сервере",
      "exp.bots.period": "ранее",
      "exp.bots.1": "Боты для сообществ до 1000+ пользователей: модерация, роли, уведомления.",
      "exp.bots.2": "Развёртывание, обновление и перезапуск через SSH и bash-скрипты.",
      "exp.bots.3": "Настройка firewall и контроль доступных портов.",

      "exp.teach.title": "Преподаватель IT-дисциплин",
      "exp.teach.period": "около 2 лет",
      "exp.teach.desc": "Объясняю сложное простыми словами — навык, который помогает и в документации, и в разборах инцидентов.",

      "skills.title": "Ключевые навыки",
      "skills.years": "лет",
      "skills.langs": "Языки",
      "skills.containers": "Контейнеры и CI/CD",
      "skills.linux": "Linux и сети",
      "skills.chip.linuxServers": "Linux-серверы",
      "skills.chip.routing": "Маршрутизация",
      "skills.backend": "Бэкенд",
      "skills.db": "Базы данных",
      "skills.quality": "Тесты и качество",
      "skills.chip.gates": "CI-гейты",
      "skills.sre": "Наблюдаемость и SRE",
      "skills.chip.learning": "изучаю Prometheus и Grafana",
      "skills.ai": "ИИ-инструменты",

      "infra.title": "Инфраструктура и сеть",
      "infra.1": "Домашняя лаборатория на OpenWRT: прошивка роутеров, маршрутизация, firewall, VPN/WARP-туннели, разделение трафика между сервисами.",
      "infra.2": "Собственный Linux-сервер: SSH, обновление и перезапуск сервисов, bash-скрипты, firewall.",
      "infra.3": "Cisco Packet Tracer — моделирование сетей (учебные лабораторные).",

      "edu.title": "Образование",
      "edu.1": "<strong>РГПУ им. А. И. Герцена</strong> — магистратура, 2028: «Цифровая образовательная среда и цифровые технологии» (44.04.01), 1 курс",
      "edu.2": "<strong>РГПУ им. А. И. Герцена</strong> — бакалавриат, 2026: «Информационные системы и технологии» (09.03.02)",
      "edu.3": "<strong>Английский</strong> — B2",

      "footer.nav": "Навигация",
      "footer.about": "✦ О себе",
      "footer.experience": "⚙ Опыт",
      "footer.skills": "◆ Стек",
      "footer.infra": "⚡ Инфраструктура",
      "footer.links": "Ссылки",
      "footer.cta": "Ищу стажировку SRE",
      "footer.write": "Написать мне",
      "footer.made": "сделано на Python и 💚",
    },
    en: {
      "meta.title": "Danil Momot — SRE / Python",
      "hero.name": "Danil Momot",
      "hero.role": "SRE (junior) · Python · Linux · Docker · CI/CD",
      "nav.about": "About",
      "nav.experience": "Experience",
      "nav.skills": "Stack",
      "nav.infra": "Infrastructure",

      "about.title": "About",
      "about.note": "short version",
      "about.p1": "SRE is a deliberate choice for me: less manual work, more automation and reliability. Python — <strong>7 years</strong>; Linux is my daily environment: I administer my own server and deploy services with Docker/Compose and bash.",
      "about.p2": "I build <strong>ClicKit</strong>: <strong>274 automated tests</strong>, CI/CD on GitHub Actions, Docker images, a 1.0.0 release. Right now I'm adding the service layer: FastAPI + PostgreSQL, metrics, logs and traces, SLOs and Terraform / k3s.",
      "about.p3": "Looking for an SRE internship to own reliability at real scale. Open to office, remote or hybrid — Saint Petersburg, Russia.",

      "hubs.title": "Hubs",
      "hubs.release": "Releases",

      "exp.title": "Experience & Projects",
      "exp.note": "building + operating",
      "exp.role.devops": "developer & operator",

      "exp.clikit.subtitle": "a Windows automation app",
      "exp.clikit.period": "2026 — present",
      "exp.clikit.1": "Automation scenarios are assembled from visual blocks (Python 3.11+, PySide6, Blockly) — no coding and no arbitrary code execution.",
      "exp.clikit.2": "274 automated tests, ruff; CI/CD on GitHub Actions: lint, tests on 3.11–3.13, tests inside a Linux container, release by tag.",
      "exp.clikit.3": "Docker: a Linux test image (Xvfb) and a Windows build image (servercore), .dockerignore, reproducible builds.",
      "exp.clikit.4": "1.0.0 release: PyInstaller, SHA-256, NOTICE, a smoke launch of the built application.",
      "exp.clikit.5": "Reliability: emergency stop, a validated .acl.json IR format, limits, atomic saves, log rotation.",
      "exp.clikit.repo": "Repository and the 1.0.0 release",

      "exp.theatre.title": "Immersive theatre generator — master's thesis",
      "exp.theatre.period": "2024 — 2026",
      "exp.theatre.1": "FastAPI + PostgreSQL: 4 entities, migrations whenever the schema changes.",
      "exp.theatre.2": "Docker Compose dev/prod, configuration via .env — the same environment locally and on the server.",
      "exp.theatre.3": "75+ pytest tests covering the API and business logic.",
      "exp.theatre.4": "n8n as a separate service, integrated through webhooks.",
      "exp.theatre.5": "Deployment and maintenance on my own Linux server: SSH, firewall, updating and restarting services.",

      "exp.bots.title": "Telegram and Discord bots on my own Linux server",
      "exp.bots.period": "earlier",
      "exp.bots.1": "Bots for communities of 1000+ users: moderation, roles, notifications.",
      "exp.bots.2": "Deployment, updates and restarts over SSH and bash scripts.",
      "exp.bots.3": "Firewall configuration and control of exposed ports.",

      "exp.teach.title": "IT instructor",
      "exp.teach.period": "about 2 years",
      "exp.teach.desc": "Explaining complex things in plain words — a skill that helps with both documentation and incident reviews.",

      "skills.title": "Key skills",
      "skills.years": "years",
      "skills.langs": "Languages",
      "skills.containers": "Containers & CI/CD",
      "skills.linux": "Linux & Networking",
      "skills.chip.linuxServers": "Linux servers",
      "skills.chip.routing": "Routing",
      "skills.backend": "Backend",
      "skills.db": "Databases",
      "skills.quality": "Testing & Quality",
      "skills.chip.gates": "CI gates",
      "skills.sre": "Observability & SRE",
      "skills.chip.learning": "learning Prometheus & Grafana",
      "skills.ai": "AI tooling",

      "infra.title": "Infrastructure & Networking",
      "infra.1": "Home lab on OpenWRT: router firmware, routing, firewall, VPN/WARP tunnels, per-service traffic splitting.",
      "infra.2": "My own Linux server: SSH, updating and restarting services, bash scripts, firewall.",
      "infra.3": "Cisco Packet Tracer — network modelling (university labs).",

      "edu.title": "Education",
      "edu.1": "<strong>Herzen State Pedagogical University</strong> — master's degree, 2028: Digital Educational Environment and Digital Technologies (44.04.01), year 1",
      "edu.2": "<strong>Herzen State Pedagogical University</strong> — bachelor's degree, 2026: Information Systems and Technologies (09.03.02)",
      "edu.3": "<strong>English</strong> — B2",

      "footer.nav": "Navigation",
      "footer.about": "✦ About me",
      "footer.experience": "⚙ Experience",
      "footer.skills": "◆ Stack",
      "footer.infra": "⚡ Infrastructure",
      "footer.links": "Links",
      "footer.cta": "Looking for an SRE internship",
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
