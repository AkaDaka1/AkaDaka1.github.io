# AkaDaka1.github.io

Личная страница-визитка на GitHub Pages: **https://akadaka1.github.io**

Стиль — «тёмное стекло» + bento-сетка в цветах проекта
[ClicKit](https://github.com/AkaDaka1/ClicKit): синий `#5865f2` и зелёный `#41cd52`,
анимированный фон из точек, переключение языка **RU / EN** без перезагрузки.

## Структура

```
index.html          — разметка страницы
style.css           — тема, сетка, адаптив, анимации
scripts/main.js     — язык, подсветка меню, появление карточек, фон
icons/avatar.png    — аватар (из профиля GitHub)
icons/favicon.svg   — фавикон
```

Внешние зависимости — только CDN: шрифты (Inter, JetBrains Mono) и
Font Awesome 6. Без сборки и бандлеров: GitHub Pages отдаёт файлы как есть.

## Как менять

- **Тексты:** в `index.html` у элементов есть `data-i18n="ключ"`, а сами строки
  лежат в объекте `translations` в `scripts/main.js` — правь RU и EN рядом.
- **Проекты:** блок `<div class="cards-grid">` в секции `#projects`.
- **Навыки:** чипы `<span class="skill-chip">` в секции `#skills`.
- **Цвета:** переменные `--accent`, `--accent-2`, `--bg` в начале `style.css`.
- **Язык по умолчанию:** берётся сохранённый выбор, иначе язык браузера.

## Публикация

Репозиторий назван `AkaDaka1.github.io`, поэтому Pages отдаёт `master` (или `main`)
автоматически — без workflow. Любой push в ветку обновляет сайт.

```bash
git add .
git commit -m "feat: личная страница"
git push
```

Свой домен не нужен — `*.github.io` бесплатен. Если позже захочешь свой домен,
достаточно добавить файл `CNAME` с доменом и DNS-записи у регистратора.
