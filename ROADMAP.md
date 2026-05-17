# Blue — Технічний аудит та план розробки

> Складено: 2026-05-17  
> Стек: Next.js 16.2.6 · React 19 · MySQL 8 · Tailwind CSS 4 · TypeScript 5  
> Деплой: VPS (root) · Standalone output · mysql2 pool

---

## 1. Поточний стан

Проект знаходиться в стані MVP: каталог товарів з дерево-структурою в MySQL, SSR-рендеринг,
базова навігація по категоріях, мобільне меню. Функції кошика, оплати та адмін-панелі відсутні.

**Що вже зроблено добре:**
- Tree-структура БД (гнучка, підходить для вкладених категорій)
- Параметризовані SQL-запити (захист від SQL-injection) ✓
- Standalone output для Docker/VPS ✓
- `proxy.ts` для редиректу числових ID → slug ✓
- `next/image` з оптимізацією ✓
- Відокремлений client-компонент для мобільного меню ✓

---

## 2. Критичні проблеми (вирішити негайно)

### 2.1 Відсутні Next.js App Router файли

| Файл | Наслідок відсутності |
|------|----------------------|
| `app/not-found.tsx` | Показується дефолтна Next.js 404 — не брендована |
| `app/loading.tsx` | Під час SSR-навігації немає жодного skeleton/spinner |
| `app/error.tsx` | При помилці БД — білий екран або Next.js generic error |
| `app/[slug]/loading.tsx` | Сторінка товару/категорії не має стану завантаження |

**Вирішення:** Створити `loading.tsx` з skeleton-заглушками, `error.tsx` з кнопкою "Спробувати знову",
`not-found.tsx` з посиланням на головну. Це базові вимоги App Router.

### 2.2 Відсутнє кешування БД-запитів

Кожен запит до сторінки товару/категорії → свіжий SQL-запит до MySQL. При 100+ одночасних
відвідувачах це ненеобхідне навантаження.

**Вирішення:** Обгорнути запити в `unstable_cache` з тегами ревалідації:

```ts
// lib/products-db.ts
import { unstable_cache } from "next/cache";

export const getAllProducts = unstable_cache(
  async (opts) => { /* existing query */ },
  ["products"],
  { revalidate: 60, tags: ["products"] }
);
```

При зміні товару через адмін-панель — викликати `revalidateTag("products")`.

### 2.3 Відсутня пагінація

`getAllProducts()` завантажує **всі** товари без ліміту. При 200+ записах це:
- Повільніший SQL-запит
- Більший JSON у відповіді
- Більше DOM-вузлів для рендерингу

**Вирішення:** Додати `limit` і `offset` (або cursor-based по `id DESC`):

```ts
// Поточний підхід: ORDER BY t.id DESC LIMIT ? OFFSET ?
export async function getAllProducts(opts?: {
  categorySlug?: string;
  q?: string;
  limit?: number;
  offset?: number;
}): Promise<{ items: Product[]; total: number }>
```

### 2.4 API-маршрут без обмежень

`GET /api/products` — відкритий, без rate limiting і без auth. Будь-хто може зробити 10,000 запитів
і перевантажити MySQL-пул.

**Вирішення (мінімальне):**
- Додати заголовок `Cache-Control: public, s-maxage=60` для CDN-кешування
- Або прибрати маршрут взагалі, якщо він не використовується фронтендом (зараз не використовується — всі сторінки SSR)

---

## 3. Продуктивність

### 3.1 Зображення

| Проблема | Вплив |
|----------|-------|
| Unsplash URLs — зовнішній домен | Залежність від третьої сторони; при недоступності — broken images |
| Немає `srcset` для мобільних | Завантажується велике зображення навіть на маленькому екрані |

**Вирішення:**
1. Перенести зображення до `public/images/{slug}.webp` (або CDN)
2. У `next.config.ts` видалити `remotePatterns` для Unsplash (не потрібен для локальних файлів)
3. Конвертувати оригінали в WebP 80% якості перед завантаженням

**Якщо обирати CDN:** Bunny CDN або Cloudflare R2 — обидва мають низьку ціну і добру швидкість
для України. Cloudflare R2: 0$ за перші 10GB/місяць.

### 3.2 MySQL індекси

Поточна схема:
```sql
tree.slug — UNIQUE (автоматичний індекс) ✓
tree_parents.parent_id — потрібен індекс для getAll по категорії
tree_parents.child_id  — потрібен індекс
```

**Вирішення:** Перевірити наявність індексів та додати при необхідності:
```sql
ALTER TABLE tree_parents ADD INDEX idx_parent (parent_id);
ALTER TABLE tree_parents ADD INDEX idx_child (child_id);
-- Для сортування по даті:
ALTER TABLE tree ADD INDEX idx_created (created_at);
```

### 3.3 `proxy.ts` б'є в БД на кожен числовий URL

Редирект `/25 → /linen-shirt` робить SQL-запит. При масових переходах зі старих
URL (наприклад, з кешованих Google-результатів) це дорого.

**Вирішення:** Кешувати результат в пам'яті або в Redis на 24 год:
```ts
const redirectCache = new Map<number, string>();
// або Node global для persistence між hot-reloads у dev
```

---

## 4. SEO (Пріоритет: Високий)

### 4.1 `generateMetadata` на сторінках товарів і категорій

Зараз всі сторінки успадковують metadata з `layout.tsx`:
```
title: "Blue — Прості речі, зроблені якісно."
```

Google бачить однаковий title для `/linen-shirt` і `/denim-jacket`. Це критична SEO-проблема.

**Вирішення:** Додати `generateMetadata` в `app/[slug]/page.tsx`:

```ts
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const node = await getNodeBySlug(`/${slug}`);
  
  if (node?.typeName === "Товар") {
    const product = await getProductBySlug(`/${slug}`);
    return {
      title: `${product.name} — Blue`,
      description: product.description,
      openGraph: {
        title: product.name,
        description: product.description,
        images: [{ url: product.image, width: 600, height: 800 }],
      },
    };
  }
  
  if (node?.typeName === "Категорія") {
    return {
      title: `${node.value} — Blue`,
      description: `Купити ${node.value.toLowerCase()} в магазині Blue.`,
    };
  }
}
```

### 4.2 `app/sitemap.ts` — відсутній

Без sitemap Google не знає про існування сторінок товарів. Це блокує органічний трафік.

**Вирішення:**
```ts
// app/sitemap.ts
import { getAllProducts } from "@/lib/products-db";

export default async function sitemap() {
  const products = await getAllProducts();
  const base = "https://blue.com.ua";
  
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/clothing`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/accessories`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/home`, changeFrequency: "weekly", priority: 0.8 },
    ...products.items.map((p) => ({
      url: `${base}${p.slug}`,
      changeFrequency: "monthly",
      priority: 0.6,
      lastModified: p.updatedAt,
    })),
  ];
}
```

### 4.3 `app/robots.ts` — відсутній

**Вирішення:**
```ts
// app/robots.ts
export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin/"] },
    sitemap: "https://blue.com.ua/sitemap.xml",
  };
}
```

### 4.4 JSON-LD структуровані дані (Product schema)

Google Shopping та rich results потребують structured data. Без них товари не відображаються
з ціною та зображенням у пошуковій видачі.

**Вирішення:** Додати в `ProductPage`:
```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description,
      image: product.image,
      offers: {
        "@type": "Offer",
        price: product.price,
        priceCurrency: "UAH",
        availability: product.inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      },
    }),
  }}
/>
```

### 4.5 Open Graph зображення

Для share-посилань у Telegram/Viber/Instagram — потрібні OG-зображення. Додати до `generateMetadata`.

---

## 5. Безпека

### 5.1 Відсутній `.env.example`

Немає шаблону змінних середовища. Новий розробник не знає, які змінні потрібні.

**Вирішення:** Створити `.env.example`:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=blue
DB_PASSWORD=
DB_NAME=blue
NEXT_PUBLIC_SITE_URL=https://blue.com.ua
```

### 5.2 Відсутня валідація вхідних даних

- Пошуковий рядок `q` не має обмеження довжини. Рядок у 10,000 символів → важкий SQL-запит.
- `proxy.ts` конвертує рядок в число (`Number(id)`) без перевірки — якщо id = `999999999999999`,
  запит все одно піде в БД.

**Вирішення:**
```ts
// В getAllProducts:
if (opts?.q && opts.q.length > 100) throw new Error("Query too long");

// В proxy.ts:
const numId = Number(id);
if (!Number.isInteger(numId) || numId > 2_147_483_647) return NextResponse.next();
```

### 5.3 DB connection без таймауту

`mysql2` pool не має `connectTimeout` та `queryTimeout`. Повільний запит може зависнути
і тримати з'єднання з пулу.

**Вирішення:**
```ts
global._mysqlPool = mysql.createPool({
  ...
  connectTimeout: 5000,   // 5s
  connectionLimit: 10,
  queueLimit: 20,         // Відхиляти запити якщо черга > 20
});
```

---

## 6. Архітектура: Заплановані фічі

### 6.1 Кошик (Cart)

**Архітектурне рішення:** Client-side кошик (Zustand + localStorage), серверна валідація при оформленні.

```
state:
  CartItem: { productId, slug, name, price, image, quantity }
  
store: Zustand з persist (localStorage)
  actions: add, remove, updateQty, clear

UI:
  CartButton в Header — показує кількість товарів (badge)
  /cart — сторінка кошика (Next.js page)
  CartDrawer — бічна панель (як альтернатива)
```

**Чому Zustand, а не Context API:** Context API рендерить всі Consumer-компоненти при кожній зміні.
Zustand — гранулярні підписки, кращий performance при частих оновленнях кошика.

```bash
npm install zustand
```

### 6.2 Оплата (LiqPay / WayForPay)

Для українського ринку рекомендовані:

| Сервіс | Комісія | SDK |
|--------|---------|-----|
| WayForPay | 1.5–2.5% | `wayforpay-js` |
| LiqPay | 2.5% | `liqpay` (Node) |
| Monobank | 1.5% | REST API |

**Flow оплати:**
```
1. Юзер натискає "Оформити замовлення"
2. Server Action: валідація кошика → перевірка наявності товарів у БД
3. Створення запису orders + order_items у БД зі статусом "pending"
4. Генерація підписаного payment URL (LiqPay/WayForPay)
5. Редирект на платіжну сторінку
6. Webhook від платіжного сервісу → оновлення статусу замовлення → "paid"
7. Email-підтвердження (Resend або NodeMailer)
```

**Необхідні нові таблиці:**
```sql
CREATE TABLE orders (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  status      ENUM('pending','paid','processing','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
  total       DECIMAL(10, 2) NOT NULL,
  currency    VARCHAR(3) NOT NULL DEFAULT 'UAH',
  payment_ref VARCHAR(255),
  customer    JSON NOT NULL,  -- { name, email, phone, address }
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id             BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_id       BIGINT NOT NULL REFERENCES orders(id),
  product_id     BIGINT NOT NULL REFERENCES tree(id),
  product_name   VARCHAR(255) NOT NULL,  -- snapshot на момент замовлення
  product_price  DECIMAL(10, 2) NOT NULL,
  quantity       INT NOT NULL DEFAULT 1
);

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
```

**Чому snapshot полів товару:** Якщо адмін змінить ціну, старі замовлення повинні зберігати
оригінальну ціну на момент покупки.

### 6.3 Адмін-панель

**Архітектурне рішення:** Route Group `/admin` з окремим layout і JWT-авторизацією.

```
app/
  (admin)/
    admin/
      layout.tsx          ← перевіряє auth, інакше redirect /admin/login
      login/page.tsx
      page.tsx            ← dashboard: кількість замовлень, виручка
      products/
        page.tsx          ← список товарів (таблиця з пошуком/фільтром)
        new/page.tsx      ← форма додавання
        [id]/page.tsx     ← форма редагування
      orders/
        page.tsx          ← список замовлень
        [id]/page.tsx     ← деталі замовлення, зміна статусу
      categories/
        page.tsx
```

**Авторизація:** Найпростіший варіант для одного адміна — `ADMIN_SECRET` в `.env.local`,
зберігати в `httpOnly cookie`. Не потрібен окремий `users`-запис якщо адмін один.

```ts
// app/(admin)/admin/login/page.tsx — Server Action
async function loginAction(formData: FormData) {
  "use server";
  const pass = formData.get("password");
  if (pass !== process.env.ADMIN_SECRET) {
    redirect("/admin/login?error=1");
  }
  cookies().set("admin_session", signJwt({ role: "admin" }), {
    httpOnly: true, secure: true, sameSite: "lax", maxAge: 60 * 60 * 8, // 8 год
  });
  redirect("/admin");
}
```

**Завантаження зображень:**
- Form → Server Action → `fs.writeFile` до `public/images/`
- Або multipart → upload до CDN (Cloudflare R2)
- `sharp` для ресайзу та конвертації в WebP перед збереженням

```bash
npm install sharp
```

### 6.4 Зображення товарів (перехід з Unsplash)

**Поточна проблема:** Unsplash URLs — зовнішня залежність, не підходить для production.

**Рекомендований підхід — локальний (до 500 товарів):**
```
public/
  images/
    products/
      linen-shirt.webp
      denim-jacket.webp
```
У БД зберігати відносний шлях: `/images/products/linen-shirt.webp`.
`next/image` з локальним path не потребує `remotePatterns`.

**Рекомендований підхід — CDN (500+ товарів):**
Cloudflare R2 або Bunny CDN. URL в БД: `https://cdn.blue.com.ua/products/linen-shirt.webp`.
Додати домен до `next.config.ts` remotePatterns.

---

## 7. Деплой на VPS

### 7.1 Dockerfile (відсутній)

Next.js 16 з `output: "standalone"` вже готовий до контейнеризації.

```dockerfile
# Dockerfile
FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production

FROM base AS builder
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
```

### 7.2 docker-compose.yml (відсутній)

```yaml
# docker-compose.yml
services:
  web:
    build: .
    ports: ["3000:3000"]
    env_file: .env.local
    restart: unless-stopped
    depends_on: [db]
    
  db:
    image: mysql:8
    environment:
      MYSQL_DATABASE: blue
      MYSQL_USER: blue
      MYSQL_PASSWORD: ${DB_PASSWORD}
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
      - ./scripts/schema.sql:/docker-entrypoint-initdb.d/schema.sql
    restart: unless-stopped

volumes:
  mysql_data:
```

### 7.3 Nginx конфігурація (відсутня)

```nginx
# /etc/nginx/sites-available/blue.com.ua
server {
    server_name blue.com.ua www.blue.com.ua;
    
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /images/ {
        alias /var/www/blue/public/images/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    listen 443 ssl; # certbot додасть автоматично
}
```

### 7.4 Відсутній health check endpoint

```ts
// app/api/health/route.ts
export async function GET() {
  try {
    await getPool().query("SELECT 1");
    return Response.json({ status: "ok", db: "connected" });
  } catch {
    return Response.json({ status: "error", db: "disconnected" }, { status: 503 });
  }
}
```

---

## 8. DB Schema: Відсутній файл міграцій

Зараз схема існує тільки в головах розробників. Немає документованого SQL для відтворення БД.

**Вирішення:** Створити `scripts/schema.sql`:
```sql
-- scripts/schema.sql  (source of truth для структури БД)
CREATE TABLE IF NOT EXISTS tree_types (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  value VARCHAR(255) NOT NULL
);
INSERT INTO tree_types (value) VALUES ('Головна'),('Категорія'),('Товар'),('Сторінка');

CREATE TABLE IF NOT EXISTS tree (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  type_id    INT NOT NULL REFERENCES tree_types(id),
  slug       VARCHAR(255) NOT NULL UNIQUE,
  value      VARCHAR(255) NOT NULL,
  meta       JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_type (type_id)
);

CREATE TABLE IF NOT EXISTS tree_parents (
  parent_id BIGINT NOT NULL REFERENCES tree(id) ON DELETE CASCADE,
  child_id  BIGINT NOT NULL REFERENCES tree(id) ON DELETE CASCADE,
  PRIMARY KEY (parent_id, child_id),
  INDEX idx_parent (parent_id),
  INDEX idx_child  (child_id)
);
```

---

## 9. Якість коду

### 9.1 `lib/products.ts` має невикористані експорти

`categories` та `Category` більше не використовуються в UI після рефакторингу на `categoryLinks`.
Видалити або залишити, якщо планується використання в майбутньому (наприклад, для валідації в API).

### 9.2 Відсутні тести

Немає жодного тесту. Мінімальний набір:

| Тип | Що тестувати | Інструмент |
|-----|-------------|-----------|
| Unit | `toSlug()`, `badgeLabels` | Vitest |
| Integration | `getAllProducts()`, `getProductBySlug()` | Vitest + testcontainers |
| E2E | Перехід на товар, пошук, мобільне меню | Playwright |

```bash
npm install -D vitest @vitejs/plugin-react
```

### 9.3 Відсутній CI/CD

Немає автоматичних перевірок при push. Рекомендований мінімум (GitHub Actions):

```yaml
# .github/workflows/ci.yml
on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: npx biome check .
      - run: npx tsc --noEmit
      - run: npm run build
```

---

## 10. Пріоритезований план по спринтах

### Sprint 1 — Стабілізація (1–2 тижні)

| # | Задача | Складність | Важливість |
|---|--------|-----------|-----------|
| 1 | Додати `not-found.tsx`, `loading.tsx`, `error.tsx` | Низька | Критична |
| 2 | `generateMetadata` для товарів та категорій | Середня | Критична |
| 3 | `app/sitemap.ts` + `app/robots.ts` | Низька | Висока |
| 4 | JSON-LD Product schema на сторінці товару | Низька | Висока |
| 5 | `.env.example` | Низька | Середня |
| 6 | `scripts/schema.sql` — задокументувати схему БД | Низька | Висока |
| 7 | DB індекси на `tree_parents` | Низька | Висока |
| 8 | `connectTimeout` + `queueLimit` в `lib/db.ts` | Низька | Середня |
| 9 | Валідація довжини рядка `q` | Низька | Середня |
| 10 | `app/api/health/route.ts` | Низька | Середня |

### Sprint 2 — Продуктивність та деплой (1–2 тижні)

| # | Задача | Складність | Важливість |
|---|--------|-----------|-----------|
| 1 | `unstable_cache` для DB-запитів | Середня | Висока |
| 2 | Пагінація в `getAllProducts` (limit/offset) | Середня | Висока |
| 3 | Перенести зображення з Unsplash → `public/images/` (WebP) | Середня | Висока |
| 4 | `Dockerfile` + `docker-compose.yml` | Середня | Висока |
| 5 | Nginx конфіг + SSL (Let's Encrypt) | Середня | Висока |
| 6 | Кешування редиректів в `proxy.ts` | Низька | Середня |

### Sprint 3 — Кошик (2–3 тижні)

| # | Задача | Складність | Важливість |
|---|--------|-----------|-----------|
| 1 | Zustand store: `useCartStore` | Середня | Критична |
| 2 | CartDrawer/CartPage UI | Середня | Критична |
| 3 | CartButton в Header з badge | Низька | Критична |
| 4 | Сторінка оформлення замовлення (`/checkout`) | Висока | Критична |
| 5 | Таблиці `orders` + `order_items` | Низька | Критична |
| 6 | Server Action: створення замовлення | Середня | Критична |

### Sprint 4 — Оплата (2–3 тижні)

| # | Задача | Складність | Важливість |
|---|--------|-----------|-----------|
| 1 | Інтеграція WayForPay або LiqPay | Висока | Критична |
| 2 | Webhook-обробник для підтвердження оплати | Висока | Критична |
| 3 | Email-підтвердження (Resend) | Середня | Висока |
| 4 | Сторінки `/order/success` і `/order/cancel` | Низька | Висока |

### Sprint 5 — Адмін-панель (3–4 тижні)

| # | Задача | Складність | Важливість |
|---|--------|-----------|-----------|
| 1 | `/admin/login` + JWT cookie auth | Середня | Критична |
| 2 | Список товарів з CRUD | Висока | Критична |
| 3 | Завантаження зображень (`sharp` → WebP) | Середня | Висока |
| 4 | Список замовлень + зміна статусу | Середня | Висока |
| 5 | Dashboard зі статистикою | Висока | Середня |

---

## 11. Технічний борг (не критично, але варто вирішити)

- `lib/products.ts` — `SeedProduct.category` є `"Clothing" | "Accessories" | "Home"` але в БД є ще
  "Головна" і "Сторінка". Варто виділити строгі типи для кожного контексту.
- `proxy.ts` — `Number(id)` може дати `NaN` якщо рядок пустий. Додати `Number.isNaN` перевірку.
- `app/api/products/route.ts` — маршрут існує, але не використовується UI. Якщо не потрібен —
  видалити. Якщо потрібен для майбутнього mobile app — задокументувати і додати auth.
- `public/` — залишилися дефолтні Next.js SVG файли (`vercel.svg`, `next.svg`, `globe.svg` та ін.).
  Видалити непотрібні.
- `tsconfig.json` — не перевірявся, але варто переконатися що `strict: true` увімкнено.

---

## Додаток: Структура файлів після повної реалізації

```
app/
  (admin)/
    admin/
      layout.tsx          ← auth guard
      login/page.tsx
      page.tsx            ← dashboard
      products/...
      orders/...
  [slug]/
    page.tsx
    loading.tsx           ← skeleton
    error.tsx
  api/
    health/route.ts       ← health check
    products/route.ts     ← (можливо видалити)
    webhooks/
      wayforpay/route.ts  ← webhook оплати
  cart/page.tsx
  checkout/page.tsx
  order/
    success/page.tsx
    cancel/page.tsx
  components/
    Breadcrumb.tsx
    CartButton.tsx
    CartDrawer.tsx
    Footer.tsx
    Header.tsx
    MobileMenu.tsx
    ProductCard.tsx
    Skeleton.tsx          ← shared skeleton компонент
  error.tsx
  globals.css
  layout.tsx
  loading.tsx
  not-found.tsx
  page.tsx
  robots.ts
  sitemap.ts

lib/
  cart.ts                 ← Zustand store
  db.ts
  products-db.ts
  products.ts
  slug.ts

scripts/
  schema.sql              ← source of truth для схеми БД
  seed.ts

Dockerfile
docker-compose.yml
.env.example
nginx.conf
```
