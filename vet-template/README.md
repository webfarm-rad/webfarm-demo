# Ветеринарная клиника — Шаблон многостраничного сайта

Премиум-шаблон для ветеринарных клиник полного цикла. Современный дизайн, полная адаптивность, богатая интерактивность.

## 📁 Структура файлов

```
vet-template/
├── index.html              # Главная страница (748 строк)
├── services.html           # Все услуги (744 строки)
├── team.html               # Специалисты (создать)
├── prices.html             # Прайс-лист (создать)
├── about.html              # О клинике (создать)
├── contacts.html           # Контакты (создать)
├── css/
│   └── style.css           # Единый стиль (1977 строк)
├── js/
│   └── script.js           # Вся интерактивность (530 строк)
├── img/                    # Изображения (заполнять при деплое)
└── fa/                     # Font Awesome (скопировать из другого шаблона)
```

## 🎨 Дизайн

**Цветовая схема:**
- Primary: `#0d9488` (Teal — чистота, медицина, доверие)
- Secondary: `#f97316` (Orange — тепло, забота)
- Фоны: белый, мятный (`#f0fdfa`), тёмно-бирюзовый

**Шрифты:**
- Заголовки: Nunito (мягкий, современный, дружелюбный)
- Текст: PT Sans (отличная кириллица, читаемость)

**Особенности:**
- 10+ секций на главной
- Glassmorphism-карточки
- Bento Grid для услуг
- Scroll-triggered animations
- Animated counters
- Carousel отзывов
- FAQ-аккордеон
- Модальные окна

## 🔧 Переменные для подстановки

### Основная информация

```
{{clinic_name}}            // "ВетКлиника+"
{{city}}                   // "Москва"
{{city_prep}}              // "в Москве" (предложный падеж)
{{slug}}                   // "vetklinika-plus-msk"
```

### Контакты

```
{{phone}}                  // "+7 (495) 123-45-67"
{{phone_raw}}              // "74951234567"
{{phone_wa}}               // "74951234567" (для WhatsApp)
{{email}}                  // "info@vetklinika.ru" (опционально)
{{whatsapp_url}}           // "https://wa.me/74951234567"
{{telegram_url}}           // "https://t.me/vetklinika" (опционально)
{{vk_url}}                 // "https://vk.com/vetklinika" (опционально)
{{instagram_url}}          // НЕ использовать (РФ рынок)
```

### Адрес

```
{{address}}                // "г. Москва, ул. Ленина, д. 15"
{{street}}                 // "ул. Ленина, д. 15"
{{region}}                 // "Москва"
{{postal_code}}            // "123456"
{{latitude}}               // "55.751244"
{{longitude}}              // "37.618423"
```

### Часы работы

```
{{working_hours}}          // "Пн-Вс: 9:00-21:00" или "круглосуточно"
{{working_hours_emergency}} // "24/7" (если круглосуточно)
{{opening_days}}           // ["Monday","Tuesday",...] (JSON для Schema)
{{opens}}                  // "09:00"
{{closes}}                 // "21:00"
```

### Статистика

```
{{years}}                  // "15" (лет на рынке)
{{year_founded}}           // "2009"
{{specialists_count}}      // "8" (количество ветеринаров)
{{rating}}                 // "4.8"
{{review_count}}           // "245"
{{review_source_text}}     // "Яндекс Карты"
```

### Специалисты (для главной страницы)

```
{{specialist_1_name}}      // "Иванова Анна Сергеевна"
{{specialist_2_name}}      // "Петров Игорь Владимирович"
{{specialist_3_name}}      // "Сидорова Елена Михайловна"
{{specialist_4_name}}      // "Козлов Дмитрий Андреевич"
```

### Цены

```
{{primary_appointment_price}} // "1500" (первичный приём в рублях)
```

### SEO и метаданные

```
{{current_year}}           // "2026"
{{inn}}                    // "7701234567"
{{ogrn}}                   // "1177700000001"
```

### Яндекс.Карты

```
{{yandex_map_embed}}       // HTML код embed карты
```

## 📋 Условные блоки

Используйте для опциональных элементов:

```html
<!-- IF:telegram_url -->
<a href="{{telegram_url}}">Telegram</a>
<!-- /IF:telegram_url -->

<!-- IF:email -->
<a href="mailto:{{email}}">{{email}}</a>
<!-- /IF:email -->

<!-- IF:working_hours_emergency -->
<span>Работаем {{working_hours_emergency}}</span>
<!-- /IF:working_hours_emergency -->
```

## 🎯 Интерактивные элементы

1. **Мобильное меню** — гамбургер с анимацией
2. **Sticky header** — прозрачность при скролле
3. **Scroll animations** — fade-in-up для секций
4. **Animated counters** — числа "набегают" при скролле
5. **FAQ accordion** — раскрывающиеся ответы
6. **Modal windows** — запись на приём, заказ звонка
7. **Reviews carousel** — автопрокрутка, свайп на мобильных
8. **Services tabs** — переключение категорий услуг
9. **Floating buttons** — WhatsApp, звонок, наверх
10. **Smooth scroll** — плавная прокрутка к якорям

## 🚀 Использование

### 1. Подготовка данных

Собрать всю информацию о клинике:
- Полное название
- Адрес с координатами
- Телефон, email, соцсети
- Часы работы
- Количество специалистов
- Рейтинг на Яндекс.Картах
- Цены (минимум — первичный приём)

### 2. Замена переменных

Используйте скрипт подстановки или вручную:

```bash
# Пример для sed (Linux/macOS)
sed -i 's/{{clinic_name}}/ВетКлиника+/g' *.html
sed -i 's/{{phone}}/+7 (495) 123-45-67/g' *.html
# ... и т.д. для всех переменных
```

### 3. Добавление реальных фото

Заменить Unsplash URL на реальные фото клиники:

**Необходимые фото:**
- `hero-bg.jpg` — главный баннер (1920x1080)
- `team-1.jpg` до `team-4.jpg` — фото специалистов (400x400)
- `service-diagnostics.jpg` — диагностическое оборудование
- `service-surgery.jpg` — операционная
- `service-dentistry.jpg` — стоматология
- `service-grooming.jpg` — груминг
- `service-hospital.jpg` — стационар
- `about-clinic.jpg` — фото клиники снаружи/внутри
- `og-image.jpg` — для соцсетей (1200x630)

### 4. Font Awesome

Скопировать папку `fa/` из любого существующего шаблона:

```bash
cp -r ../auto-template/fa ./fa
```

Или подключить CDN (уже в коде):
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
```

### 5. Яндекс.Карты

Получить код вставки карты:
1. Открыть https://yandex.ru/map-constructor/
2. Указать адрес клиники
3. Настроить метку, масштаб
4. Получить HTML-код
5. Вставить в `contacts.html` вместо `{{yandex_map_embed}}`

## 📱 Адаптивность

Полностью адаптивен для всех устройств:

- **Десктоп (1920px+)** — полная версия, все элементы
- **Ноутбук (1024-1440px)** — оптимизированные отступы
- **Планшет (768-1024px)** — скрытие части навигации, двухколоночные сетки
- **Мобильный (320-768px)** — одна колонка, гамбургер-меню, увеличенные зоны нажатия

## 🎨 Цветовые вариации

Для разных клиник можно менять цветовую схему в `style.css`:

**Вариант 1: Синий + Оранжевый (сейчас)**
```css
--color-primary: #0d9488;
--color-secondary: #f97316;
```

**Вариант 2: Голубой + Зелёный**
```css
--color-primary: #3b82f6;
--color-secondary: #10b981;
```

**Вариант 3: Фиолетовый + Розовый**
```css
--color-primary: #8b5cf6;
--color-secondary: #ec4899;
```

## ✅ Чеклист перед деплоем

- [ ] Все переменные `{{...}}` заменены на реальные данные
- [ ] Добавлены реальные фото клиники (минимум 15 штук)
- [ ] Проверены все ссылки (телефон, email, соцсети)
- [ ] Яндекс.Карта вставлена и проверена
- [ ] ИНН и ОГРН указаны корректно
- [ ] Цены актуальны
- [ ] Протестирована на мобильных устройствах
- [ ] Все формы работают (модальные окна)
- [ ] SEO-теги заполнены (title, description, og:image)
- [ ] Favicon добавлен
- [ ] Проверено в Chrome, Safari, Firefox

## 🔍 SEO

**Встроенная оптимизация:**
- ✅ Schema.org разметка (VeterinaryCare + LocalBusiness)
- ✅ Open Graph метатеги
- ✅ Semantic HTML5
- ✅ Alt-теги на всех изображениях
- ✅ Один H1 на странице
- ✅ Корректная иерархия заголовков
- ✅ Мета-теги title и description
- ✅ Canonical URL
- ✅ Адаптивный дизайн (mobile-first)

**Добавить при деплое:**
- `robots.txt`
- `sitemap.xml`
- Google Analytics / Яндекс.Метрика
- Favicon и иконки для разных устройств

## 📊 Производительность

**Оптимизации:**
- CSS и JS в отдельных файлах
- Lazy loading изображений (через IntersectionObserver)
- Оптимизированные анимации (GPU-acceleration)
- Минимум сторонних библиотек (только Font Awesome)
- Критичный CSS инлайн (можно добавить)
- Debouncing на scroll events
- Passive event listeners

**Целевые показатели:**
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

## 🆘 Поддержка браузеров

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ iOS Safari 14+
- ✅ Android Chrome 90+

**Graceful degradation:**
- Backdrop-filter (glassmorphism) — fallback на opacity
- CSS Grid — fallback на flexbox
- IntersectionObserver — анимации сразу видны

## 📧 Формы

Две формы в шаблоне:

1. **Запись на приём** (`#appointmentModal`)
   - Имя клиента
   - Телефон
   - Вид животного
   - Кличка
   - Причина обращения

2. **Заказ звонка** (`#callModal`)
   - Имя
   - Телефон

**Обработка:**
- Клиентская валидация (HTML5)
- Форматирование телефона (автоматическое)
- TODO: Подключить отправку на backend/почту

## 🔗 Полезные ссылки

- Font Awesome иконки: https://fontawesome.com/icons
- Unsplash фото: https://unsplash.com/s/photos/veterinary
- Google Fonts: https://fonts.google.com
- Яндекс.Карты конструктор: https://yandex.ru/map-constructor/
- Schema.org VeterinaryCare: https://schema.org/VeterinaryCare

---

**Создано:** Март 2026
**Автор:** Claude Code
**Версия:** 1.0
**Лицензия:** Для использования в проекте WebFarm
