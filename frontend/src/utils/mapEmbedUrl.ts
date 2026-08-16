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

/**
 * mapEmbedUrlByCoords — same embed, but pinned to an exact lat/lng instead of
 * a text search. Use this for branches whose Google-verified coordinates are
 * known (e.g. pulled from a "share location" link) — it guarantees the pin
 * sits on the real building instead of wherever Maps' text geocoder guesses.
 */
export function mapEmbedUrlByCoords(lat: number, lng: number): string {
  return `https://maps.google.com/maps?q=${lat},${lng}&t=&z=17&ie=UTF8&iwloc=near&output=embed`
}

/**
 * mapEmbedUrlFor — picks coords when a location has them, falling back to
 * the address-text search otherwise. Lets a single branch/location object
 * (address, plus optional lat/lng) drive the embed without call sites having
 * to branch themselves.
 */
export function mapEmbedUrlFor(loc: { address: string; lat?: number; lng?: number }): string {
  return loc.lat != null && loc.lng != null
    ? mapEmbedUrlByCoords(loc.lat, loc.lng)
    : mapEmbedUrl(loc.address)
}
