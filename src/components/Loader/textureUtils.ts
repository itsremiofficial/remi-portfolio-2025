import * as THREE from "three";

// Texture cache for performance optimization
const textureCache = new Map<string, THREE.Texture>();

/**
 * Creates a wrapped texture with premultiplied alpha
 * Cached to avoid recreation on theme changes
 */
export function createWrappedTexture(
  originalTexture: THREE.Texture | null,
  cacheKey: string
): THREE.Texture | null {
  if (!originalTexture) return null;

  // Check cache first
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const width = 2048;
  const height = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(0,0,0,0)";
  ctx.fillRect(0, 0, width, height);

  const scale = Math.min(
    width / originalTexture.image.width,
    height / originalTexture.image.height
  );
  const drawWidth = originalTexture.image.width * scale;
  const drawHeight = originalTexture.image.height * scale;

  const x = (width - drawWidth) / 2;
  const y = (height - drawHeight) / 2;

  ctx.drawImage(originalTexture.image, x, y, drawWidth, drawHeight);

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Premultiply alpha - optimize loop
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3] / 255;
    data[i] *= alpha;
    data[i + 1] *= alpha;
    data[i + 2] *= alpha;
  }
  ctx.putImageData(imageData, 0, 0);

  const newTexture = new THREE.CanvasTexture(canvas);
  newTexture.wrapS = THREE.ClampToEdgeWrapping;
  newTexture.wrapT = THREE.ClampToEdgeWrapping;
  newTexture.minFilter = THREE.LinearFilter;
  newTexture.magFilter = THREE.LinearFilter;
  newTexture.generateMipmaps = false;
  newTexture.needsUpdate = true;

  // Cache the texture
  textureCache.set(cacheKey, newTexture);

  return newTexture;
}

/**
 * Clears the texture cache and disposes all textures
 * Call this when the PreLoader unmounts to free memory
 */
export function clearTextureCache(): void {
  textureCache.forEach((texture) => {
    texture.dispose();
  });
  textureCache.clear();
}
