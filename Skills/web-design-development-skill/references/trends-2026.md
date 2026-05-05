# Тренды веб-дизайна 2025–2026 — Полный справочник

## Содержание
1. [Scrollytelling](#1-scrollytelling)
2. [3D-анимации и WebGL](#2-3d-анимации-и-webgl)
3. [Motion Design](#3-motion-design)
4. [Glassmorphism](#4-glassmorphism)
5. [Neo-brutalism](#5-neo-brutalism)
6. [Bento Grid](#6-bento-grid)
7. [Aurora Gradients](#7-aurora-gradients)
8. [Dark Mode](#8-dark-mode)
9. [Parallax и иммерсивный скроллинг](#9-parallax)
10. [AI-powered дизайн](#10-ai-powered-дизайн)
11. [Типографика — Variable Fonts и кинетика](#11-типографика)
12. [Курсорные эффекты](#12-курсорные-эффекты)
13. [Accessibility + Performance](#13-accessibility--performance)

---

## 1. Scrollytelling

**Статус**: +400% time-on-page vs статический контент.

**Суть**: Позиция скролла управляет прогрессией истории, триггерит анимации и раскрывает контент.

**Типы**:
- Linear narrative — последовательная история (Apple iPhone pages)
- Parallax layers — слои двигаются с разной скоростью
- Scroll-triggered — элементы появляются при скролле
- Horizontal scroll — горизонтальная прокрутка секций
- Pinned sections — секция «прибивается» и меняется внутри

**Инструменты**:
- GSAP ScrollTrigger — золотой стандарт (https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- Intersection Observer API — нативное отслеживание видимости
- Scrollama — лёгкие нарративы (https://github.com/russellsamora/scrollama)
- Locomotive Scroll — плавный скроллинг (https://locomotivemtl.github.io/locomotive-scroll/)
- No-code: Shorthand, Maglr, Genially

**Лучшие практики** (The Pudding — https://pudding.cool/process/responsive-scrollytelling/):
- Планировать mobile-first или одновременно с desktop
- Избегать steppers и swipe/tap, переопределяющих дефолтный скролл
- Каждая анимация должна нести смысл
- Тестировать на реальных устройствах

**Примеры**: NYT «Snow Fall» (пионер формата), Kriss.ai (Awwwards SOTM 2024 — 3D-экскурсия по клинике), Apple iPhone pages, Lando Norris F1

**Источники**: https://ui-deploy.com/blog/complete-scrollytelling-guide-how-to-create-interactive-web-narratives-2025 | https://shorthand.com/the-craft/scrollytelling-examples/index.html | https://www.mockplus.com/blog/post/scrollytelling-website-design

---

## 2. 3D-анимации и WebGL

**Статус**: Индустриальный стандарт, не эксперимент. Все Site of the Year используют real-time 3D.

**Технологии**:
- **Three.js** — 100K+ звёзд GitHub, ~95% веб-3D (https://threejs.org/)
- **React Three Fiber** — декларативный React-wrapper (https://r3f.docs.pmnd.rs/)
- **Spline** — no-code 3D-редактор в браузере (https://spline.design/)
- **WebGPU** — преемник WebGL, 120+ FPS (портфолио Samsy)
- **Babylon.js** — альтернатива Three.js

**Паттерны применения**:
- Product configurators: Nike, IKEA — AR/3D-примерка
- Scroll-driven 3D: камера движется по сцене при скролле
- Hero 3D-сцены: интерактивный 3D-объект как главный визуал (Lusion, Igloo Inc)
- Data visualization: globe-визуализации (GitHub Globe)
- Интерактивные 3D-карточки: Codrops (Three.js + Webflow)

**Как воспроизвести**:
- Быстро: Spline → embed через iframe / React-компонент
- Средне: React Three Fiber + Drei (100+ хелперов)
- Продвинуто: Three.js + GLSL-шейдеры + custom post-processing

**Обязательно**: оптимизировать GLB-модели, lazy loading, fallback для слабых устройств.

**Тренд 2026**: AI-генерация 3D-ассетов, real-time product configurators — стандарт e-commerce.

**Источники**: https://threejsresources.com/blog/the-future-of-the-3d-web-trends-for-2025-and-beyond | https://mivibzzz.com/resources/web-development/3d-web-design-threejs-modern-libraries | https://cssauthor.com/best-3d-web-design-tools/ | https://www.figma.com/resource-library/web-design-trends/ | https://tympanus.net/codrops/2025/05/31/building-interactive-3d-cards-in-webflow-with-three-js/

---

## 3. Motion Design

**Статус**: Присутствует в 100% award-winning сайтов. Не опция — ожидание.

**Данные**: Анимированная обратная связь снижает ошибки пользователей на 22%. Staggered GSAP-анимации в онбординге повысили completion rate на 31%.

**Сравнение инструментов**:

| Инструмент | Подход | Лучшее применение | Размер |
|---|---|---|---|
| **GSAP** | Императивный, таймлайн | Сложные таймлайны, SVG-морфинг, ScrollTrigger | ~23 KB |
| **Motion** (ex Framer Motion) | Декларативный, React-first | UI-переходы, layout-анимации, жесты | ~32 KB |
| **Lottie** | JSON из After Effects | Онбординг, empty states, иконки | Зависит от JSON |

**GSAP** (https://gsap.com/) — стандарт индустрии для сложных анимаций. Плагины: ScrollTrigger, SplitText, Draggable, MotionPath, MorphSVG. Совместим с React, Vue, Three.js, Webflow.

**Motion** (https://motion.dev/) — бывший Framer Motion, стал фреймворк-агностичным (JS, Vue, React). 30M+ npm-загрузок/мес. Spring-физика, layout-анимации, AnimatePresence, жесты.

**LottieFiles** (https://lottiefiles.com/) — 500K+ анимаций, плагины для Figma, Webflow, Framer, Canva. 16M+ пользователей.

**Обязательное правило**: уважать `prefers-reduced-motion`.

**Источники**: https://medium.com/@toukir.ahamed.pigeon/interactive-ui-animations-with-gsap-framer-motion-f2765ae8a051 | https://teacher.it.com/creating-engaging-motion-ui-and-micro-interactions-a-practical-guide-with-framer-motion-gsap/ | https://motion.dev/docs/gsap-vs-motion

---

## 4. Glassmorphism

**Статус**: Эволюционирует — стеклянные текстуры на скульптурной типографике, приглушённые пастельные тона, полупрозрачные плавающие панели.

**Характеристики**: полупрозрачный фон (`backdrop-filter: blur()`), тонкие borders, тени, frosted glass эффект.

**Примеры**: Apple Vision Pro, Reflect, Contra.

**Риски**: избыточная прозрачность снижает читаемость — контраст **4.5:1** минимум.

**CSS-реализация**:
```css
.glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}
```

**Источники**: https://www.lummi.ai/blog/web-design-trends-2025 | https://fineartdesign.agency/how-to-use-neo-brutalism-and-glassmorphism-without-ruining-your-ux/

---

## 5. Neo-brutalism

**Статус**: Нишевый, но мощный — визуальный ответ на «стерильный» минимализм. Резонирует с Gen Z.

**Характеристики**: толстые чёрные обводки (2–4px), резкие тени без blur, насыщенные ретро-цвета, monospace-шрифты, raw/unpolished эстетика.

**Примеры**: Gumroad, Figma community pages, Yale School of Art, OffGROUND.

**Не подходит**: для корпоративных финансовых сайтов, luxury-брендов.

**CSS-реализация**:
```css
.brutal-card {
  border: 3px solid #000;
  box-shadow: 6px 6px 0 #000;
  background: #FFE66D;
  font-family: 'Space Mono', monospace;
}
```

**Источники**: https://innovartfoundry.com/neo-brutalism-trending-in-design-in-2025/ | https://blog.logrocket.com/ux-design/flat-brutalist-glassy-do-ux-design-trends-even-matter/

---

## 6. Bento Grid

**Статус**: Mainstream. Модульная асимметричная сетка, вдохновлённая японским бенто-боксом.

**Кто использует**: Apple, IKEA, Procreate, Shopify Editions, Replit Agent.

**В 2025–2026**: обогащается hover-анимациями и responsive resizing. Значительно лучше banner sliders по UX.

**Реализация**: CSS Grid с `grid-template-areas` или `grid-template-columns` + span.

**Источники**: https://medium.com/@support_82111/from-bento-boxes-to-brutalism-decoding-the-top-ui-design-trends-for-2025-f524d0a49569 | https://www.wearetenet.com/blog/ui-ux-design-trends

---

## 7. Aurora Gradients

**Статус**: «Визитная карточка» SaaS-лендингов. Stripe — пионер.

**Суть**: Органические, размытые цветовые переходы, имитирующие северное сияние.

**Реализация**: overlapping blurred ovals, mesh gradients, CSS `filter: blur()` + `@keyframes`. Grainy-текстуры (noise) для глубины.

**Инструменты**: SyntaxSnap Aurora Generator (https://syntaxsnap.com/tools/aurora-gradient), Mesh Gradient generators.

**Источники**: https://syntaxsnap.com/tools/aurora-gradient | https://www.kittl.com/article/gradient-graphic-design-trend

---

## 8. Dark Mode

**Статус**: Стандартное ожидание пользователей. Не тренд — норма.

**Фокус 2026**: нюансированные тёмные темы с тонкими цветовыми вариациями. Smart dark mode адаптируется к условиям освещения.

**Кто доминирует**: AI-сайты (Deepgram, Stax.ai), SaaS-платформы (Trustwave), digital-агентства.

**Реализация**: CSS `prefers-color-scheme: dark`, CSS custom properties, toggle.

---

## 9. Parallax и иммерсивный скроллинг

**Статус**: Жив и актуален в 2026, но стал **тоньше и целенаправленнее**.

**Кто использует**: Apple (каждая продуктовая страница iPhone).

**Инструменты**: CSS `transform`/`perspective`, GSAP ScrollTrigger, Locomotive Scroll, Webflow (встроенная поддержка).

**Будущее**: AI-генерация параллакс-сцен, параллакс в WebXR.

**Обязательно**: toggle для отключения эффектов, тестирование LCP и TBT.

**Источники**: https://www.webbb.ai/blog/parallax-scrolling-still-cool-in-2026 | https://webflow.com/blog/parallax-scrolling | https://www.creativebloq.com/web-design/parallax-scrolling-1131762 | https://www.memberstack.com/blog/14-of-the-best-parallax-scroll-examples-for-2025

---

## 10. AI-powered дизайн

**Статус**: Трансформирует весь дизайн-пайплайн — от идеи до кода.

**Ключевые инструменты**:

| Инструмент | Что делает | Цена |
|---|---|---|
| **Figma AI (Make)** | Генерация прототипов из текста, авто-переименование слоёв | Включено в Figma |
| **Google Stitch** | Промпт/скетч → UI + фронтенд-код, до 350 экранов/мес | Бесплатно (Google Labs) |
| **Relume** | AI sitemap → wireframes → style guide, экспорт Figma/Webflow/React | От $39/мес |
| **v0.dev** | Промпт → React/Tailwind UI-код | Freemium |
| **UX Pilot** | AI UI-генератор + Figma-плагин | От $12/мес |

**URL**:
- Google Stitch: https://stitch.withgoogle.com
- Relume: https://www.relume.io/
- v0.dev: https://v0.dev/
- UX Pilot: https://uxpilot.ai/

**Направления 2026**: гиперперсонализация UI, мультимодальный вход (скетч → код), conversational site building.

**Критический взгляд**: AI-вывод оптимизирован скорее для демо — требует значительной ручной доработки.

**Источники**: https://uxpilot.ai/blogs/best-ai-ui-generators | https://uxpilot.ai/blogs/google-stitch-ai | https://www.aicotra.com/how-ai-is-revolutionizing-web-design/ | https://www.sayenkodesign.com/ai-web-design-2026/

---

## 11. Типографика — Variable Fonts и кинетика

**Variable Fonts**: 1 файл = 5–10 static, CSS `font-variation-settings`. Ключевые шрифты: Inter Variable, Roboto Flex, Fragment (Pangram Pangram).

**Кинетическая типографика**: текст движется и реагирует на скролл/hover. Увеличивает время на сайте. Пример: Stripe BFCM Machine (Awwwards Typography Honors 2024).

**Тренд 2026**: broken grids + типографика (Envato), kinetic type как главный визуальный элемент.

**Источники**: https://www.theinkorporated.com/insights/future-of-typography/ | https://www.figma.com/resource-library/web-design-trends/ | https://elements.envato.com/learn/web-design-trends | https://www.linearity.io/blog/trending-fonts/

---

## 12. Курсорные эффекты

**Статус**: Элемент бренда digital-агентств.

**Типы**: магнитные курсоры (Obys), flashlight-эффекты (Moooi), spotlight-курсоры (Basis Agency), радужные водные эффекты (Advanced Team).

**Инструменты**: CSS `cursor` + pseudo-элементы, GSAP, Three.js, Anime.js.

**Обязательно**: fallback для мобильных, `aria-hidden="true"`, возможность отключения.

**Источники**: https://blog.hubspot.com/website/animated-cursor | https://www.sliderrevolution.com/resources/cursor-animations/ | https://blog.logrocket.com/custom-cursor-css/

---

## 13. Accessibility + Performance

### Accessibility

**European Accessibility Act (EAA)** вступил в силу **28 июня 2025** — юридическое требование в ЕС. В США — 4500+ ADA-исков в 2024.

**WCAG 2.2** — базовый стандарт:
- Focus Appearance — видимый фокус
- Target Size — минимум **24×24 CSS-пикселя**
- Dragging Movements — альтернативы для drag
- Контраст **4.5:1** для текста

**Инструменты**: Radix UI, Headless UI, Lighthouse, axe DevTools.
**Принцип**: семантический HTML first, ARIA second.

**Источники**: https://medium.com/design-bootcamp/2025-accessibility-regulations-for-designers-how-wcag-eaa-and-ada-impact-ux-ui-eb785daf4436 | https://www.broworks.net/blog/web-accessibility-best-practices-2025-guide | https://blog.accessify.app/accessibility-in-web-design-wcag-guidelines/

### Core Web Vitals

Только **47% сайтов** проходят все 3 метрики. Переход от FID к **INP** (март 2024).

| Метрика | Что измеряет | Порог «хорошо» |
|---|---|---|
| **LCP** | Скорость загрузки главного контента | ≤ 2.5 сек |
| **INP** | Отзывчивость при взаимодействии | ≤ 200 мс |
| **CLS** | Визуальная стабильность | ≤ 0.1 |

**Бизнес-влияние**: Pinterest LCP −40% → трафик +15%, регистрации +15%. Vodafone LCP −31% → продажи +8%.

**Решения**: WebP/AVIF, `srcset`, 1–2 variable fonts, `font-display: swap`, фиксированные `width/height`, lazy loading, SSR/SSG (Next.js, SvelteKit).

**Источники**: https://www.ateamsoftsolutions.com/core-web-vitals-optimization-guide-2025-showing-lcp-inp-cls-metrics-and-performance-improvement-strategies-for-web-applications/ | https://skyseodigital.com/core-web-vitals-optimization-complete-guide-for-2026/

---

## No-code / low-code инструменты

| Платформа | Пользователи / доля | Для кого | Цена |
|---|---|---|---|
| **Webflow** (https://webflow.com) | 720K+ сайтов, ~1.2% CMS | Агентства, средний/крупный бизнес | От $18/мес |
| **Framer** (https://www.framer.com/) | Лидер стартапов | Стартапы, маркетинговые лендинги | От $10/мес |
| **Readymag** (https://readymag.com/) | 3000+ шрифтов | Портфолио, digital-журналы | От $14/мес |

**Тренд**: AI-ассистенты внутри платформ, headless CMS, стирание границ дизайн/код.

**Источники**: https://www.pixeto.co/blog/framer-vs-webflow-which-no-code-builder-wins | https://framerbite.com/blog/best-no-code-web-design-tools-in-2025 | https://www.nixar.io/blog-posts/the-future-of-no-code-where-webflow-framer-ai-are-headed-2025-2026

---

## Design Systems и Atomic Design

**Atomic Design** (Брэд Фрост) трансформировался в гибкий фреймворк. **Design Tokens** — фундамент: цвет, типографика, отступы версионируются через CI/CD.

**Лидеры**: Shopify Polaris (tokens-first), Atlassian ADG (поведенческие паттерны), IBM Carbon (модульные организмы).

**Правило**: не следовать Atomic Design буквально — адаптировать под команду.

**Источники**: https://medium.com/design-bootcamp/atomic-design-in-2025-from-rigid-theory-to-flexible-practice-91f7113b9274 | https://www.qt.io/software-insights/atomic-design-systems-why-the-labels-dont-matter

---

## Доминирующие парадигмы 2026

- **«Barely-there UI»**: чистые лейауты, 2–3 тона, 1 шрифт — для AI-стартапов
- **Контролируемый максимализм**: крупная типографика, «дофаминовые» палитры, Y2K — точечно
- **Pantone 2026 — Cloud Dancer** (11-4201): природные, приглушённые тона
- **Sustainability-дизайн**: лёгкий код, сжатые изображения, минимум тяжёлых анимаций

**Источники**: https://elements.envato.com/learn/web-design-trends | https://graphicdesignjunction.com/2025/12/web-design-trends-of-2026/ | https://www.wix.com/blog/web-design-trends | https://www.organica.agency/en/magazine/web-design-2026-what-we-learned-in-2025-and-the-trends-shaping-modern-websites/ | https://pros.squarespace.com/blog/design-trends | https://www.theedigital.com/blog/web-design-trends
