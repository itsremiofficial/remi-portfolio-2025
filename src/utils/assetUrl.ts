/**
 * Returns the base URL from Vite's config.
 * Ensures a trailing slash for proper path concatenation.
 */
const BASE = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : import.meta.env.BASE_URL + "/";

/**
 * Prepends the Vite base URL to a public asset path.
 * Handles leading slashes gracefully.
 *
 * @example
 * // With base "/remi-portfolio-2025/"
 * assetUrl("/loader/texture.png") // => "/remi-portfolio-2025/loader/texture.png"
 * assetUrl("loader/texture.png")  // => "/remi-portfolio-2025/loader/texture.png"
 */
export function assetUrl(path: string): string {
  const cleaned = path.startsWith("/") ? path.slice(1) : path;
  return BASE + cleaned;
}
