/**
 * imageUrl — resolves the correct absolute URL for an image file.
 *
 * Images are stored externally (not bundled into the JS build) so that
 * they can be managed independently on the server without re-deploying.
 *
 * ── Path conventions ─────────────────────────────────────────────────
 *  Local dev  : Place images in  frontend/public/Uploads/images/
 *               Vite serves public/ at the root, so they're available at
 *               http://localhost:5173/Uploads/images/<filename>
 *
 *  Production : Images are stored at
 *               /www/wwwroot/JHS Website/Uploads/images/<filename>
 *               Nginx serves this directory under the  /Uploads/images/
 *               location block (see nginx.conf).
 *
 * ── Usage ────────────────────────────────────────────────────────────
 *  import { imageUrl } from '../utils/imageUrl'
 *
 *  <img src={imageUrl('Virendra-Nayyar-removebg-preview.png')} alt="..." />
 *  style={{ backgroundImage: `url(${imageUrl('Ahmedabad.png')})` }}
 */

const IMAGE_BASE =
  (import.meta.env.VITE_IMAGE_BASE as string | undefined) ?? '/JHS Website/Uploads/images';

/**
 * Returns the full URL path for the given image filename.
 * @param filename  Bare filename, e.g. "hero.png" or "Virendra-Nayyar-removebg-preview.png"
 */
export function imageUrl(filename: string): string {
  // Strip any accidental leading slash from filename
  const clean = filename.replace(/^\/+/, '');
  return `${IMAGE_BASE}/${clean}`;
}
