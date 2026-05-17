export type Product = {
	id: string;
	slug: string;
	name: string;
	price: number;
	originalPrice?: number;
	category: string;
	categorySlug: string;
	description: string;
	image: string;
	badge?: "new" | "sale" | "bestseller";
	inStock: boolean;
};

export type SeedProduct = {
	slug: string;
	name: string;
	price: number;
	originalPrice?: number;
	category: "Clothing" | "Accessories" | "Home";
	subcategorySlug: string; // e.g. "/clothing/shirts"
	description: string;
	image: string;
	badge?: Product["badge"];
	inStock: boolean;
};

// ─── Navigation structure ──────────────────────────────────────────────────────

export type CategoryNav = {
	label: string;
	slug: string;
	children: { label: string; slug: string }[];
};

export const categoryNav: CategoryNav[] = [
	{
		label: "Одяг",
		slug: "/clothing",
		children: [
			{ label: "Сорочки", slug: "/clothing/shirts" },
			{ label: "Трикотаж", slug: "/clothing/knitwear" },
			{ label: "Верхній одяг", slug: "/clothing/outerwear" },
			{ label: "Штани", slug: "/clothing/trousers" },
		],
	},
	{
		label: "Аксесуари",
		slug: "/accessories",
		children: [
			{ label: "Сумки", slug: "/accessories/bags" },
			{ label: "Шкіряні вироби", slug: "/accessories/leather" },
			{ label: "Головні убори", slug: "/accessories/hats" },
			{ label: "Прикраси", slug: "/accessories/jewelry" },
		],
	},
	{
		label: "Дім",
		slug: "/home",
		children: [
			{ label: "Кухня", slug: "/home/kitchen" },
			{ label: "Спальня", slug: "/home/bedroom" },
			{ label: "Декор", slug: "/home/decor" },
			{ label: "Освітлення", slug: "/home/lighting" },
		],
	},
];

// flat list for sitemap / pills on home page
export const categoryLinks = categoryNav.map((c) => ({
	label: c.label,
	slug: c.slug,
}));

export const categories = ["Всі", "Одяг", "Аксесуари", "Дім"] as const;
export type Category = (typeof categories)[number];

export const badgeLabels: Record<NonNullable<Product["badge"]>, string> = {
	new: "Новинка",
	sale: "Знижка",
	bestseller: "Хіт продажу",
};

// ─── Subcategory definitions (for seed) ───────────────────────────────────────

export type SubcategoryDef = {
	label: string;
	slug: string;
	parentSlug: string;
};

export const subcategoryDefs: SubcategoryDef[] = categoryNav.flatMap((cat) =>
	cat.children.map((sub) => ({
		label: sub.label,
		slug: sub.slug,
		parentSlug: cat.slug,
	})),
);

// ─── Seed products ─────────────────────────────────────────────────────────────

export const products: SeedProduct[] = [
	// ── Clothing / Shirts ───────────────────────────────────────────────────────
	{
		slug: "linen-shirt",
		name: "Лляна сорочка",
		price: 89,
		category: "Clothing",
		subcategorySlug: "/clothing/shirts",
		description:
			"Легка сорочка вільного крою з натурального льону. Дихаюча тканина, мінімальний дизайн. Доступна у білому та екрю.",
		image:
			"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80",
		badge: "new",
		inStock: true,
	},
	{
		slug: "oxford-shirt",
		name: "Оксфордська сорочка",
		price: 95,
		category: "Clothing",
		subcategorySlug: "/clothing/shirts",
		description:
			"Класична оксфордська сорочка з щільного бавовняного полотна. Злегка структурована, ідеальна під джинси чи чинос.",
		image:
			"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80",
		inStock: true,
	},
	{
		slug: "striped-shirt",
		name: "Смугаста сорочка",
		price: 79,
		category: "Clothing",
		subcategorySlug: "/clothing/shirts",
		description:
			"Тонка смугаста сорочка з м'якої бавовняної тканини. Тімчасовий принт, незмінний стиль.",
		image:
			"https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=600&q=80",
		inStock: true,
	},
	{
		slug: "chambray-shirt",
		name: "Сорочка з шамбре",
		price: 85,
		category: "Clothing",
		subcategorySlug: "/clothing/shirts",
		description:
			"Легка сорочка з тканини шамбре з ефектом денім. Зручна на весь день, тримає форму після прання.",
		image:
			"https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80",
		badge: "new",
		inStock: true,
	},
	{
		slug: "band-collar-shirt",
		name: "Сорочка зі стійкою",
		price: 98,
		category: "Clothing",
		subcategorySlug: "/clothing/shirts",
		description:
			"Мінімалістична сорочка без коміру-відкладного — тільки чиста стійка. Льон + бавовна, приємна до тіла.",
		image:
			"https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600&q=80",
		inStock: true,
	},
	{
		slug: "flannel-shirt",
		name: "Фланелева сорочка",
		price: 92,
		originalPrice: 115,
		category: "Clothing",
		subcategorySlug: "/clothing/shirts",
		description:
			"М'яка фланелева сорочка з перевіркою. Класичний крій, двобічна тканина, комфорт у прохолоду.",
		image:
			"https://images.unsplash.com/photo-1638391349907-2c39bb6bb7b5?w=600&q=80",
		badge: "sale",
		inStock: true,
	},

	// ── Clothing / Knitwear ──────────────────────────────────────────────────────
	{
		slug: "merino-crew-neck",
		name: "Светр з мериносу",
		price: 135,
		originalPrice: 180,
		category: "Clothing",
		subcategorySlug: "/clothing/knitwear",
		description:
			"100% мериносовий светр з круглим вирізом. Природне регулювання температури, приємний до тіла.",
		image:
			"https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80",
		badge: "sale",
		inStock: true,
	},
	{
		slug: "cashmere-turtleneck",
		name: "Кашеміровий гольф",
		price: 245,
		category: "Clothing",
		subcategorySlug: "/clothing/knitwear",
		description:
			"Розкішний гольф із 100% кашеміру класу А. Надм'який, добре тримає тепло, не витягується.",
		image:
			"https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
		badge: "bestseller",
		inStock: true,
	},
	{
		slug: "cotton-cardigan",
		name: "Бавовняний кардиган",
		price: 120,
		category: "Clothing",
		subcategorySlug: "/clothing/knitwear",
		description:
			"Класичний кардиган із щільного бавовняного трикотажу. Кишені з клапаном, гудзики-ріжки.",
		image:
			"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
		inStock: true,
	},
	{
		slug: "knit-polo",
		name: "В'язане поло",
		price: 105,
		category: "Clothing",
		subcategorySlug: "/clothing/knitwear",
		description:
			"Трикотажне поло з коміром і двома гудзиками. Тонка пряжа, зручна для шарів. Влітку — саме воно.",
		image:
			"https://images.unsplash.com/photo-1625910513829-6952da2cbf0f?w=600&q=80",
		badge: "new",
		inStock: true,
	},
	{
		slug: "wool-sweater",
		name: "Вовняний светр",
		price: 155,
		category: "Clothing",
		subcategorySlug: "/clothing/knitwear",
		description:
			"Теплий светр із вовняної пряжі середньої товщини. Круглий виріз, злегка оверсайз.",
		image:
			"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80",
		inStock: true,
	},
	{
		slug: "ribbed-tank",
		name: "Майка в рубчик",
		price: 45,
		category: "Clothing",
		subcategorySlug: "/clothing/knitwear",
		description:
			"Облягаюча майка з еластичного рубчастого трикотажу. Носити самостійно або шарувати під сорочку.",
		image:
			"https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80",
		inStock: true,
	},

	// ── Clothing / Outerwear ─────────────────────────────────────────────────────
	{
		slug: "denim-jacket",
		name: "Джинсова куртка",
		price: 165,
		category: "Clothing",
		subcategorySlug: "/clothing/outerwear",
		description:
			"Класична джинсова куртка середнього відтінку. Попередньо вимита для м'якості, прямий крій.",
		image:
			"https://images.unsplash.com/photo-1544441893-675973e31985?w=600&q=80",
		badge: "bestseller",
		inStock: true,
	},
	{
		slug: "wool-coat",
		name: "Вовняне пальто",
		price: 385,
		category: "Clothing",
		subcategorySlug: "/clothing/outerwear",
		description:
			"Структуроване пальто з вовняної суміші. Однобортне, на двох гудзиках, з відкладним коміром.",
		image:
			"https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=600&q=80",
		inStock: true,
	},
	{
		slug: "trench-coat",
		name: "Тренч",
		price: 295,
		category: "Clothing",
		subcategorySlug: "/clothing/outerwear",
		description:
			"Класичний тренч із водовідштовхувального бавовняного gabardine. Пояс, патлети, кишені.",
		image:
			"https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80",
		badge: "new",
		inStock: true,
	},
	{
		slug: "bomber-jacket",
		name: "Куртка-бомбер",
		price: 195,
		category: "Clothing",
		subcategorySlug: "/clothing/outerwear",
		description:
			"Класична куртка-бомбер з нейлону. Резинки на манжетах і поясі, кишені-зиппери.",
		image:
			"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
		inStock: true,
	},
	{
		slug: "puffer-vest",
		name: "Стьобаний жилет",
		price: 145,
		originalPrice: 185,
		category: "Clothing",
		subcategorySlug: "/clothing/outerwear",
		description:
			"Легкий пуховий жилет для шарування. Пакується в кишеню, тепло без об'єму.",
		image:
			"https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=600&q=80",
		badge: "sale",
		inStock: true,
	},
	{
		slug: "linen-blazer",
		name: "Льняний блейзер",
		price: 175,
		category: "Clothing",
		subcategorySlug: "/clothing/outerwear",
		description:
			"Невимушений блейзер із чистого льону. Дихає, не мнеться, піднімає будь-який образ.",
		image:
			"https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80",
		inStock: true,
	},

	// ── Clothing / Trousers ──────────────────────────────────────────────────────
	{
		slug: "cotton-trousers",
		name: "Бавовняні штани",
		price: 110,
		category: "Clothing",
		subcategorySlug: "/clothing/trousers",
		description:
			"Прямі бавовняні штани з еластичним поясом. Підходять для роботи та відпочинку.",
		image:
			"https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80",
		inStock: true,
	},
	{
		slug: "chinos",
		name: "Чинос",
		price: 120,
		category: "Clothing",
		subcategorySlug: "/clothing/trousers",
		description:
			"Класичні чинос із зносостійкої бавовни. Зауженого крою, ідеальні для смарт-кежуал.",
		image:
			"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80",
		badge: "new",
		inStock: true,
	},
	{
		slug: "wide-leg-pants",
		name: "Широкі штани",
		price: 135,
		category: "Clothing",
		subcategorySlug: "/clothing/trousers",
		description:
			"Штани широкого крою з м'якого льоняно-бавовняного полотна. Зручно і стильно весь день.",
		image:
			"https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
		inStock: true,
	},
	{
		slug: "linen-shorts",
		name: "Льняні шорти",
		price: 75,
		category: "Clothing",
		subcategorySlug: "/clothing/trousers",
		description:
			"Класичні льняні шорти трохи нижче коліна. Легкі, дихають, тримають форму.",
		image:
			"https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600&q=80",
		inStock: true,
	},
	{
		slug: "jogger-pants",
		name: "Джогери",
		price: 95,
		category: "Clothing",
		subcategorySlug: "/clothing/trousers",
		description:
			"М'які джогери з французького трикотажу. Знизу резинка, кишені-карго, кишеня на блискавці.",
		image:
			"https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&q=80",
		inStock: true,
	},
	{
		slug: "cargo-pants",
		name: "Карго штани",
		price: 145,
		category: "Clothing",
		subcategorySlug: "/clothing/trousers",
		description:
			"Функціональні карго з міцної бавовни. Шість кишень, ремінь у комплекті, прямий крій.",
		image:
			"https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=600&q=80",
		inStock: true,
	},

	// ── Accessories / Bags ───────────────────────────────────────────────────────
	{
		slug: "canvas-tote",
		name: "Холщова сумка",
		price: 45,
		category: "Accessories",
		subcategorySlug: "/accessories/bags",
		description:
			"Міцна сумка з натурального полотна з посиленими ручками. Вмістить все необхідне на день.",
		image:
			"https://images.unsplash.com/photo-1612902456551-b11f86bf41aa?w=600&q=80",
		inStock: true,
	},
	{
		slug: "leather-tote",
		name: "Шкіряна сумка-тоут",
		price: 285,
		category: "Accessories",
		subcategorySlug: "/accessories/bags",
		description:
			"Просторий тоут зі зернистої шкіри. Внутрішній карман на блискавці, знімний плечовий ремінь.",
		image:
			"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
		badge: "bestseller",
		inStock: true,
	},
	{
		slug: "backpack",
		name: "Рюкзак",
		price: 195,
		category: "Accessories",
		subcategorySlug: "/accessories/bags",
		description:
			"Практичний рюкзак з вощеного канвасу. Відсік для ноутбука 15″, бічні кишені для пляшки.",
		image:
			"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
		badge: "new",
		inStock: true,
	},
	{
		slug: "crossbody-bag",
		name: "Сумка через плече",
		price: 125,
		category: "Accessories",
		subcategorySlug: "/accessories/bags",
		description:
			"Компактна сумка-кроссбоді зі шкіри. Регульований ремінь, передня кишеня на магніті.",
		image:
			"https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80",
		inStock: true,
	},
	{
		slug: "market-basket",
		name: "Плетений кошик",
		price: 65,
		category: "Accessories",
		subcategorySlug: "/accessories/bags",
		description:
			"Літній кошик з натурального рафії ручної роботи. Місткий, легкий, з шкіряними ручками.",
		image:
			"https://images.unsplash.com/photo-1601924921557-45e6dea0a157?w=600&q=80",
		inStock: true,
	},
	{
		slug: "travel-pouch",
		name: "Органайзер для подорожей",
		price: 55,
		category: "Accessories",
		subcategorySlug: "/accessories/bags",
		description:
			"Компактний органайзер із вощеного полотна. Відсіки для документів, карток, кабелів.",
		image:
			"https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=600&q=80",
		inStock: true,
	},

	// ── Accessories / Leather ────────────────────────────────────────────────────
	{
		slug: "leather-wallet",
		name: "Шкіряний гаманець",
		price: 65,
		category: "Accessories",
		subcategorySlug: "/accessories/leather",
		description:
			"Тонкий гаманець-біфолд з повнозернистої шкіри. Красиво старіє з часом. 4 відділення для карток.",
		image:
			"https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80",
		badge: "bestseller",
		inStock: true,
	},
	{
		slug: "leather-card-holder",
		name: "Тримач для карток",
		price: 42,
		category: "Accessories",
		subcategorySlug: "/accessories/leather",
		description:
			"Тонкий кардхолдер з вирубленою шкіри. Вміщує до 6 карток, мінімальна товщина.",
		image:
			"https://images.unsplash.com/photo-1578996953841-b187dbe4bc8a?w=600&q=80",
		badge: "new",
		inStock: true,
	},
	{
		slug: "leather-notebook-cover",
		name: "Обкладинка для блокнота",
		price: 78,
		category: "Accessories",
		subcategorySlug: "/accessories/leather",
		description:
			"Шкіряна обкладинка формату А5. Кишеня для ручки, кишеня для карток, підходить для блокнотів Moleskine.",
		image:
			"https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80",
		inStock: true,
	},
	{
		slug: "leather-key-fob",
		name: "Шкіряний брелок",
		price: 35,
		category: "Accessories",
		subcategorySlug: "/accessories/leather",
		description:
			"Простий брелок з товстої рослинно-дубленої шкіри. Латунне кільце, гравіювання за бажанням.",
		image:
			"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
		inStock: true,
	},
	{
		slug: "leather-belt",
		name: "Шкіряний ремінь",
		price: 58,
		category: "Accessories",
		subcategorySlug: "/accessories/leather",
		description:
			"Ремінь з рослинно-дубленої повнозернистої шкіри з латунною пряжкою. Ширина: 35 мм.",
		image:
			"https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&q=80",
		inStock: true,
	},

	// ── Accessories / Hats ───────────────────────────────────────────────────────
	{
		slug: "knit-beanie",
		name: "В'язана шапка",
		price: 35,
		originalPrice: 50,
		category: "Accessories",
		subcategorySlug: "/accessories/hats",
		description:
			"Об'ємна вовняна шапка крупної в'язки. Підходить для більшості розмірів голови.",
		image:
			"https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&q=80",
		badge: "sale",
		inStock: false,
	},
	{
		slug: "bucket-hat",
		name: "Панама",
		price: 42,
		category: "Accessories",
		subcategorySlug: "/accessories/hats",
		description:
			"Класична панама з щільного бавовняного twill. Широкі криси, внутрішня стрічка.",
		image:
			"https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80",
		badge: "new",
		inStock: true,
	},
	{
		slug: "wide-brim-hat",
		name: "Капелюх із широкими крисами",
		price: 85,
		category: "Accessories",
		subcategorySlug: "/accessories/hats",
		description:
			"Солом'яний капелюх із широкими крисами ручної роботи. Легкий, стильний, захищає від сонця.",
		image:
			"https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&q=80",
		inStock: true,
	},
	{
		slug: "baseball-cap",
		name: "Бейсболка",
		price: 38,
		category: "Accessories",
		subcategorySlug: "/accessories/hats",
		description:
			"Структурована бейсболка з бавовняного twill. Металева застібка ззаду, вишивка логотипу.",
		image:
			"https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80",
		inStock: true,
	},

	// ── Accessories / Jewelry ────────────────────────────────────────────────────
	{
		slug: "gold-ring",
		name: "Золочене кільце",
		price: 125,
		category: "Accessories",
		subcategorySlug: "/accessories/jewelry",
		description:
			"Тонке кільце з позолотою 18 карат. Мінімалістичний дизайн, стійке до потемніння.",
		image:
			"https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80",
		badge: "new",
		inStock: true,
	},
	{
		slug: "silver-chain",
		name: "Срібний ланцюжок",
		price: 98,
		category: "Accessories",
		subcategorySlug: "/accessories/jewelry",
		description:
			"Тонкий ланцюжок із стерлінгового срібла 925 проби. Довжина 45 см, застібка-карабін.",
		image:
			"https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80",
		inStock: true,
	},
	{
		slug: "hoop-earrings",
		name: "Сережки-кільця",
		price: 75,
		category: "Accessories",
		subcategorySlug: "/accessories/jewelry",
		description:
			"Класичні сережки-кільця діаметром 30 мм із позолоченого срібла. Легкі, зручні на весь день.",
		image:
			"https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&q=80",
		inStock: true,
	},
	{
		slug: "minimalist-bracelet",
		name: "Мінімалістичний браслет",
		price: 65,
		category: "Accessories",
		subcategorySlug: "/accessories/jewelry",
		description:
			"Тонкий браслет із нержавіючої сталі. Регульований розмір, матовий фініш.",
		image:
			"https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=600&q=80",
		inStock: true,
	},
	{
		slug: "pearl-earrings",
		name: "Перлові сережки",
		price: 115,
		category: "Accessories",
		subcategorySlug: "/accessories/jewelry",
		description:
			"Прісноводні перли на срібних гвоздиках. Натуральний блиск, легка форма, вічний стиль.",
		image:
			"https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80",
		badge: "bestseller",
		inStock: true,
	},

	// ── Home / Kitchen ───────────────────────────────────────────────────────────
	{
		slug: "ceramic-mug",
		name: "Керамічна кружка",
		price: 28,
		category: "Home",
		subcategorySlug: "/home/kitchen",
		description:
			"Кружка ручної роботи з матовою глазур'ю. Кожен виріб унікальний. Об'єм 350 мл.",
		image:
			"https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80",
		inStock: true,
	},
	{
		slug: "oak-cutting-board",
		name: "Дубова обробна дошка",
		price: 75,
		category: "Home",
		subcategorySlug: "/home/kitchen",
		description:
			"Торцева дубова дошка для нарізання. Бережлива до ножів, легка в догляді.",
		image:
			"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
		inStock: true,
	},
	{
		slug: "french-press",
		name: "Французький прес",
		price: 95,
		category: "Home",
		subcategorySlug: "/home/kitchen",
		description:
			"Скляний французький прес об'ємом 600 мл у нержавіючій оправі. Подвійний фільтр, зручна ручка.",
		image:
			"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
		badge: "new",
		inStock: true,
	},
	{
		slug: "ceramic-bowl-set",
		name: "Набір керамічних мисок",
		price: 125,
		category: "Home",
		subcategorySlug: "/home/kitchen",
		description:
			"Комплект із 4 мисок різного розміру ручного виробництва. Матова глазур, можна в мікрохвильовку та посудомийну машину.",
		image:
			"https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&q=80",
		inStock: true,
	},
	{
		slug: "bamboo-utensil-set",
		name: "Набір бамбукових приладів",
		price: 45,
		category: "Home",
		subcategorySlug: "/home/kitchen",
		description:
			"Набір із 5 кухонних приладів із органічного бамбука. Лопатка, ложка, щипці, вилка, шпатель.",
		image:
			"https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&q=80",
		inStock: true,
	},
	{
		slug: "linen-dish-towel",
		name: "Льняний рушник для кухні",
		price: 28,
		category: "Home",
		subcategorySlug: "/home/kitchen",
		description:
			"Щільний льняний рушник 50×70 см. Добре всмоктує, швидко сохне, не залишає ворсу.",
		image:
			"https://images.unsplash.com/photo-1584917865442-de89be371e09?w=600&q=80",
		inStock: true,
	},
	{
		slug: "glass-water-bottle",
		name: "Скляна пляшка для води",
		price: 55,
		category: "Home",
		subcategorySlug: "/home/kitchen",
		description:
			"Пляшка з боросилікатного скла об'ємом 750 мл. Бамбукова кришка, захисний силіконовий чохол.",
		image:
			"https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80",
		badge: "new",
		inStock: true,
	},

	// ── Home / Bedroom ───────────────────────────────────────────────────────────
	{
		slug: "linen-pillowcase-set",
		name: "Набір льняних наволочок",
		price: 55,
		category: "Home",
		subcategorySlug: "/home/bedroom",
		description:
			"Комплект із двох наволочок із вимитого льону. З кожним пранням стають м'якшими.",
		image:
			"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
		badge: "new",
		inStock: true,
	},
	{
		slug: "cotton-duvet-cover",
		name: "Бавовняна ковдра",
		price: 295,
		category: "Home",
		subcategorySlug: "/home/bedroom",
		description:
			"Пухова ковдра в бавовняному чохлі 200×220 см. Легка, тепла, з гіпоалергенним наповнювачем.",
		image:
			"https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&q=80",
		inStock: true,
	},
	{
		slug: "linen-sheets",
		name: "Льняна постільна білизна",
		price: 345,
		category: "Home",
		subcategorySlug: "/home/bedroom",
		description:
			"Комплект із простирадла, наволочки і підковдри з вимитого льону. Стає лише кращим з часом.",
		image:
			"https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80",
		badge: "bestseller",
		inStock: true,
	},
	{
		slug: "throw-blanket",
		name: "Плед",
		price: 165,
		category: "Home",
		subcategorySlug: "/home/bedroom",
		description:
			"М'який плед із вовняно-акрилової суміші 130×170 см. Ідеально для дивана або ліжка.",
		image:
			"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
		inStock: true,
	},
	{
		slug: "eye-mask",
		name: "Маска для сну",
		price: 28,
		category: "Home",
		subcategorySlug: "/home/bedroom",
		description:
			"Шовкова маска для сну з регульованою резинкою. Не тисне на очі, 100% натуральний шовк.",
		image:
			"https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80",
		inStock: true,
	},

	// ── Home / Decor ─────────────────────────────────────────────────────────────
	{
		slug: "beeswax-candle",
		name: "Свічка з бджолиного воску",
		price: 22,
		category: "Home",
		subcategorySlug: "/home/decor",
		description:
			"Свічка з 100% натурального бджолиного воску. Горить чисто понад 40 годин із легким медовим ароматом.",
		image:
			"https://images.unsplash.com/photo-1602607817350-eba0d75d6c82?w=600&q=80",
		inStock: true,
	},
	{
		slug: "ceramic-vase",
		name: "Керамічна ваза",
		price: 75,
		category: "Home",
		subcategorySlug: "/home/decor",
		description:
			"Ваза ручного виготовлення з матовим покриттям. Органічна форма, кожен виріб унікальний. Висота 22 см.",
		image:
			"https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80",
		badge: "new",
		inStock: true,
	},
	{
		slug: "woven-wall-art",
		name: "Тканий настінний декор",
		price: 145,
		category: "Home",
		subcategorySlug: "/home/decor",
		description:
			"Настінне панно ручної роботи з натуральної вовни та льону. Розмір 40×60 см, готовий до навішення.",
		image:
			"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
		inStock: true,
	},
	{
		slug: "concrete-planter",
		name: "Бетонне кашпо",
		price: 55,
		category: "Home",
		subcategorySlug: "/home/decor",
		description:
			"Кашпо з легкого бетону ручної роботи. Дренажний отвір знизу, підходить для сукулентів і трав.",
		image:
			"https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&q=80",
		inStock: true,
	},
	{
		slug: "wooden-photo-frame",
		name: "Дерев'яна рамка для фото",
		price: 42,
		category: "Home",
		subcategorySlug: "/home/decor",
		description:
			"Рамка з масиву дуба для фото 13×18 см. Скло, задня стінка з МДФ, настінне кріплення в комплекті.",
		image:
			"https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=600&q=80",
		inStock: true,
	},
	{
		slug: "glass-terrarium",
		name: "Скляний терарій",
		price: 95,
		category: "Home",
		subcategorySlug: "/home/decor",
		description:
			"Геометричний скляний терарій для сукулентів і кактусів. Розмір 20×20×25 см, з відкидною кришкою.",
		image:
			"https://images.unsplash.com/photo-1463154545680-d59320fd685d?w=600&q=80",
		inStock: true,
	},

	// ── Home / Lighting ──────────────────────────────────────────────────────────
	{
		slug: "pendant-lamp",
		name: "Підвісний світильник",
		price: 245,
		category: "Home",
		subcategorySlug: "/home/lighting",
		description:
			"Мінімалістичний підвісний світильник з матовим металевим плафоном. Кабель 1,5 м, патрон E27.",
		image:
			"https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=600&q=80",
		badge: "new",
		inStock: true,
	},
	{
		slug: "table-lamp",
		name: "Настільна лампа",
		price: 185,
		category: "Home",
		subcategorySlug: "/home/lighting",
		description:
			"Настільна лампа з керамічним основою і лляним абажуром. Вимикач на шнурі, патрон E14.",
		image:
			"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80",
		inStock: true,
	},
	{
		slug: "led-string-lights",
		name: "Гірлянда",
		price: 65,
		category: "Home",
		subcategorySlug: "/home/lighting",
		description:
			"Гірлянда з 50 теплих LED-ламп на мідному дроті, 5 м. Від USB, з пультом і таймером.",
		image:
			"https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=600&q=80",
		inStock: true,
	},
];
