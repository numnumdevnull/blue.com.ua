<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

Key differences already confirmed:
- `middleware.ts` is deprecated → use `proxy.ts` with exported function `proxy()`
- `params` in pages and route handlers is now a **Promise** → always `await params`
- Route Handler context: `{ params }: { params: Promise<{ id: string }> }`
- `proxy` runs in **Node.js runtime** by default (not Edge) — mysql2 works directly inside it
<!-- END:nextjs-agent-rules -->

---

# Проект: blue.com.ua — Ukrainian e-commerce

Інтернет-магазин на Next.js 16 + MySQL. Сайт **українською мовою**.

## Стек

- **Next.js 16.2.6** (App Router)
- **React 19**, TypeScript 5, Tailwind CSS 4
- **mysql2** для роботи з БД
- **zustand** для стану кошика (з localStorage-персистентністю)
- **Biome** для лінтингу та форматування (запуск: `npx biome check --write <file>`)
- Шрифт: Geist (через `next/font/google`)

## База даних MySQL

**Host:** 10.0.0.1:3306, **DB:** `blue`, **User:** `blue`  
Credentials у `.env.local` (в `.gitignore`).

### Схема — tree-структура (3 таблиці)

```
tree_types  — типи вузлів: Головна(1), Категорія(2), Товар(3), Сторінка(4)

tree        — вузли дерева
  id            BIGINT AUTO_INCREMENT PK
  type_id       FK → tree_types.id
  slug          VARCHAR(255) UNIQUE  ← URL-шлях, напр. "/clothing", "/linen-shirt"
  value         VARCHAR(255)         ← відображувана назва
  meta          JSON                 ← для товарів: {price, originalPrice?, description, image, badge?, inStock}
  created_at, updated_at

tree_parents — зв'язки батько→дитина
  parent_id FK → tree.id
  child_id  FK → tree.id
```

### Структура дерева в БД (з підкатегоріями)

```
/ (Головна, type_id=1)
├── /clothing   (Категорія, type_id=2)
│   ├── /clothing/shirts     (Категорія — підкатегорія)
│   │   ├── /linen-shirt   (Товар, type_id=3)
│   │   └── ...
│   ├── /clothing/knitwear   (Категорія — підкатегорія)
│   ├── /clothing/outerwear  (Категорія — підкатегорія)
│   └── /clothing/trousers   (Категорія — підкатегорія)
├── /accessories (Категорія)
│   ├── /accessories/bags
│   ├── /accessories/leather
│   ├── /accessories/hats
│   └── /accessories/jewelry
└── /home (Категорія)
    ├── /home/kitchen
    ├── /home/bedroom
    ├── /home/decor
    └── /home/lighting
```

**Важливо:** products.ts → subcategoryDefs генерується автоматично з categoryNav.

### tree_types IDs (ТІЛЬКИ INTEGER-порівняння, НЕ рядки!)

```typescript
const TYPE_HOME     = 1;  // Головна
const TYPE_CATEGORY = 2;  // Категорія (і підкатегорія — той самий type_id)
const TYPE_PRODUCT  = 3;  // Товар
const TYPE_PAGE     = 4;  // Сторінка
```

**Ніколи** не порівнювати через JOIN на tree_types.value — тільки по type_id.

## Slug-конвенція

Всі slug починаються з `/`. Підкатегорії мають вкладений slug: `/clothing/shirts`.  
Продукти завжди односегментні: `/linen-shirt` (не `/clothing/shirts/linen-shirt`).

## Архітектура файлів

```
app/
  page.tsx                ← головна, всі товари + пошук
  [...slug]/page.tsx      ← CATCH-ALL сторінка для категорій, підкатегорій і товарів
                             params.slug: string[] → fullSlug = '/' + slug.join('/')
  [...slug]/loading.tsx   ← skeleton
  api/products/route.ts   ← GET /api/products?categorySlug=/clothing&q=...
  api/health/route.ts     ← GET /api/health (перевірка БД)
  not-found.tsx           ← 404
  error.tsx               ← error boundary
  loading.tsx             ← skeleton головної
  sitemap.ts              ← динамічна sitemap
  robots.ts               ← robots.txt
  components/
    Header.tsx            ← 2-рівнева навігація (CSS group-hover dropdown)
    Footer.tsx
    ProductCard.tsx
    Breadcrumb.tsx        ← HomeIcon SVG → items[{label, href?}]
    MobileMenu.tsx        ← "use client", accordion підкатегорій
    CartButton.tsx        ← "use client", badge з кількістю
    CartDrawer.tsx        ← "use client", slide-in кошик
    AddToCartButton.tsx   ← "use client", острів на сторінці товару
  globals.css
  layout.tsx              ← додає CartDrawer

lib/
  db.ts           ← mysql2 pool singleton (global._mysqlPool)
  products.ts     ← типи Product, SeedProduct, CategoryNav; масив products (65 шт.);
                     categoryNav (3 категорії × 4 підкатегорії); categoryLinks (flat);
                     subcategoryDefs (для seed); badgeLabels
  products-db.ts  ← getAllProducts(), getProductsPaginated(), getProductBySlug(),
                     getNodeBySlug() → TreeNode { id, slug, value, typeId: number }
  cart-store.ts   ← Zustand store: items, isOpen, addItem, removeItem, updateQty, clear
  slug.ts         ← toSlug()

proxy.ts          ← перехоплює числові URL (/25 → 301 → /linen-shirt)
                     matcher: ["/:id(\\d+)"]

scripts/
  seed.ts         ← npm run seed — очищає і сідить заново
                     ствоює підкатегорії, лінкує товари до підкатегорій
  schema.sql      ← SQL для створення таблиць
```

## Тип Product (з БД)

```ts
type Product = {
  id: string;           // tree.id як рядок
  slug: string;         // напр. "/linen-shirt"
  name: string;
  price: number;
  originalPrice?: number;
  category: string;     // напр. "Сорочки" (immediate parent's value)
  categorySlug: string; // напр. "/clothing/shirts" (immediate parent's slug)
  description: string;
  image: string;        // Unsplash URL
  badge?: "new" | "sale" | "bestseller";
  inStock: boolean;
};
```

## getAllProducts vs getProductsPaginated

- `getAllProducts(opts?)` → `Product[]` — всі продукти, для sitemap і related
- `getProductsPaginated(opts?)` → `{ items: Product[], total: number }` — для сторінок з пагінацією
- `opts.categorySlug` = `/clothing` матчить і `/clothing` і `/clothing/%` (тобто підкатегорії теж)

## Кошик (Zustand)

- Стор: `lib/cart-store.ts` — persist в localStorage ('blue-cart')
- `CartButton` → відкриває/закриває `CartDrawer` через `useCartStore`
- `AddToCartButton` — client-острів на сторінці товару, всі інші елементи — server
- `CartDrawer` рендериться в `app/layout.tsx`

## Важливі команди

```bash
npm run dev    # запуск dev-сервера
npm run seed   # очистити tree і засіяти заново (65 товарів)
npx biome check --write <file>  # автофікс лінту
npx tsc --noEmit                # перевірка типів
```

## UX-рішення

- **Хлібні крихти**: іконка будинку (SVG) → підкатегорія → товар
- **Навігація в Header**: 2-рівнева, CSS group-hover, NO JS
- **MobileMenu**: accordion розкриття підкатегорій
- **Кошик**: Zustand + localStorage, slide-in drawer з правого боку
- **Пагінація**: 12 товарів на сторінку, numbered + prev/next, `?page=N`
- **Редирект**: числові ID `/25` → 301 → `/linen-shirt` (proxy.ts)
- Категорії фільтруються за `cat.slug` — API: `?categorySlug=/clothing`

## Мова інтерфейсу

Сайт **повністю українською**. URL-slug залишаються англійськими.

- `lang="uk"` у `<html>`
- Всі UI-тексти — українські
- Значки товарів: `new → "Новинка"`, `sale → "Знижка"`, `bestseller → "Хіт продажу"`
- `product.category` — назва підкатегорії українською (напр. "Сорочки")

## Стан розробки (Sprint 2 завершено)

### Зроблено
- ✅ Повна українізація UI
- ✅ Мобільне меню (MobileMenu з accordion підкатегорій)
- ✅ 2-рівневе меню в Header (CSS dropdown, без JS)
- ✅ 65 товарів у 12 підкатегоріях (seed)
- ✅ BASE_QUERY — порівняння по type_id (integer), без JOIN на tree_types
- ✅ TreeNode.typeId: number (без NodeType string union)
- ✅ Кошик: Zustand + localStorage, CartDrawer, CartButton, AddToCartButton
- ✅ Пагінація на сторінках категорій (getProductsPaginated)
- ✅ Catch-all роут `[...slug]` замість `[slug]` (для /clothing/shirts etc.)
- ✅ SEO: generateMetadata, JSON-LD, sitemap, robots, health check
- ✅ Loading/Error/Not-found сторінки

### Наступні кроки (Sprint 3)
- ⬜ Авторизація (next-auth або власна реалізація)
- ⬜ Сторінка оформлення замовлення + таблиці orders/order_items
- ⬜ Адмін-панель (додавання/редагування товарів)
- ⬜ Пошук на головній сторінці + пагінація
- ⬜ Фільтрація і сортування (ціна, наявність)
- ⬜ Оплата (LiqPay або іn-house)

## biome.json overrides

```json
"overrides": [
  {
    "includes": ["app/\\[...slug\\]/page.tsx"],
    "linter": { "rules": { "security": { "noDangerouslySetInnerHtml": "off" } } }
  }
]
```
Дужки `[` та `]` у glob мають бути ескейповані як `\\[` та `\\]`.
