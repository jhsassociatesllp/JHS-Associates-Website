/**
 * mapEmbedUrl — builds a Google Maps embed URL from a plain address string.
 *
 * Using a live query (rather than a hand-picked lat/long or place-id) means
 * the pin always matches whatever address text is displayed next to it —
 * no risk of the map silently drifting out of sync when an address is edited.
 *
 * `iwloc=near` opens the address info-window bubble right on the pin (without
 * it Maps just centers the view with no visible marker highlight), and z=17
 * frames tight enough on the building that the pin reads as "the office",
 * not just "somewhere on this street".
 */
export function mapEmbedUrl(address: string): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=17&ie=UTF8&iwloc=near&output=embed`
}
