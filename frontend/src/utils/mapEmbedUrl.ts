/**
 * mapEmbedUrl — builds a Google Maps embed URL from a plain address string.
 *
 * Using a live query (rather than a hand-picked lat/long or place-id) means
 * the pin always matches whatever address text is displayed next to it —
 * no risk of the map silently drifting out of sync when an address is edited.
 */
export function mapEmbedUrl(address: string): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`
}
