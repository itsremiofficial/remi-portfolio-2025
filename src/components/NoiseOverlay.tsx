import React, { useEffect, useMemo, useRef } from "react";

export type NoiseOverlayProps = {
  /** Size (px) of the noise tile that gets repeated across the screen */
  patternSize?: number;
  /** Scale applied to the on-screen canvas context */
  patternScaleX?: number;
  /** Scale applied to the on-screen canvas context */
  patternScaleY?: number;
  /** Regenerate noise every N animation frames */
  patternRefreshInterval?: number;
  /** Alpha (0–255) for each noise pixel */
  patternAlpha?: number;
  /** Control whether overlay is active (equivalent to `fy()` gate) */
  enabled?: boolean;
  /** CSS className for the canvas */
  className?: string;
  /** Inline styles for the canvas */
  style?: React.CSSProperties;
};

/**
 * Full-viewport animated noise/grain overlay.
 *
 * Renders a fixed-position <canvas> and paints it with a repeating noise tile.
 */
export default function NoiseOverlay({
  patternSize = 300,
  patternScaleX = 1,
  patternScaleY = 1,
  patternRefreshInterval = 3,
  patternAlpha = 18,
  enabled = true,
  className,
  style,
}: NoiseOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  // Offscreen resources (tile canvas + pixel buffer)
  const tile = useMemo(() => {
    const tileCanvas = document.createElement("canvas");
    tileCanvas.width = patternSize;
    tileCanvas.height = patternSize;
    const tileCtx = tileCanvas.getContext("2d", { willReadFrequently: true });
    if (!tileCtx) return null;
    const img = tileCtx.createImageData(patternSize, patternSize);
    return {
      canvas: tileCanvas,
      ctx: tileCtx,
      img,
      len: patternSize * patternSize * 4,
    };
  }, [patternSize]);

  useEffect(() => {
    if (!enabled) return;
    if (!tile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = Math.max(1, Math.floor(window.innerWidth * dpr));
      const h = Math.max(1, Math.floor(window.innerHeight * dpr));

      // Resize backing buffer
      canvas.width = w;
      canvas.height = h;

      // IMPORTANT: reset transforms so scaling doesn't accumulate on resize
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(patternScaleX, patternScaleY);
    };

    const regenTile = () => {
      const { img, len, ctx: tileCtx } = tile;
      const data = img.data;
      for (let i = 0; i < len; i += 4) {
        const v = (255 * Math.random()) | 0;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = patternAlpha;
      }
      tileCtx.putImageData(img, 0, 0);
    };

    const draw = () => {
      if (frame % patternRefreshInterval === 0) {
        regenTile();

        // Clear + paint repeating pattern
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const pattern = ctx.createPattern(tile.canvas, "repeat");
        if (pattern) {
          ctx.fillStyle = pattern;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }

      frame += 1;
      rafRef.current = window.requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      // Clear the canvas to avoid leaving last frame around
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [
    enabled,
    tile,
    patternScaleX,
    patternScaleY,
    patternRefreshInterval,
    patternAlpha,
  ]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      // default overlay styling; override via `style` or `className`
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9999,
        ...style,
      }}
    />
  );
}
