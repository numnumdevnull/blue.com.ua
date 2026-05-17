/**
 * Converts any string to a URL-safe kebab-case slug.
 * Non-ASCII characters (e.g. Cyrillic) are treated as separators and dropped.
 *
 * "Мобільний телефон Xiaomi Redmi 15C 4/128GB Midnight Black (1163425)"
 * → "xiaomi-redmi-15c-4-128gb-midnight-black-1163425"
 */
export function toSlug(name: string): string {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}
