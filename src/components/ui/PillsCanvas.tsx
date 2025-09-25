import { useEffect, useRef } from "react";
import Matter from "matter-js";
import { useTheme } from "../../hooks/useTheme";

const MatterCanvas = () => {
  const { isDark } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const textureMetaRef = useRef<
    Map<string, { w: number; h: number; img: HTMLImageElement }>
  >(new Map());

  // NEW: store previous dimensions to scale boundaries & bodies smoothly
  const prevWidthRef = useRef<number | null>(null);
  const prevHeightRef = useRef<number | null>(null);

  useEffect(() => {
    // Reset state/caches when theme changes
    startedRef.current = false;
    textureMetaRef.current.clear();
    if (!containerRef.current) return;
    const matterContainer = containerRef.current;
    const THICCNESS = 60;

    // --- Engine (enableSleeping for stability) ---
    // NOTE: enabling sleeping makes Matter.Render draw sleeping bodies with reduced opacity (≈0.5)
    // If you want full opacity at rest, either:
    //  - set enableSleeping: false
    //  - or keep enableSleeping and add: render.options.showSleeping = false after Render.create
    //  - or manually set body.render.opacity = 1 in an afterUpdate loop
    const engine = Matter.Engine.create({
      enableSleeping: true, // allow resting bodies to sleep (prevents micro jitter accumulation)
    });
    // Optional fine‑tune solver (slightly more stable)
    engine.positionIterations = 8;
    engine.velocityIterations = 6;

    const render = Matter.Render.create({
      element: matterContainer,
      engine,
      options: {
        width: matterContainer.clientWidth,
        height: matterContainer.clientHeight,
        background: "transparent",
        wireframes: false,
        showSleeping: false,
        showAngleIndicator: false,
      },
    });

    // Make canvas stable & composited
    const canvasEl = render.canvas;
    canvasEl.style.willChange = "transform";
    canvasEl.style.transition = "opacity 0.25s ease";
    canvasEl.style.opacity = "0";

    Matter.Render.run(render);
    const runner = Matter.Runner.create();

    // Bodies refs (assigned after drop)
    let ground: Matter.Body | null = null;
    let leftWall: Matter.Body | null = null;
    let rightWall: Matter.Body | null = null;

    // Build assets based on current theme
    // IF SVGs needs to be updated according to theme state
    // const themeSuffix = isDark ? "light" : "dark";

    const BASE_SKILLS: Array<{ name: string; width: number }> = [
      { name: "reactjs", width: 179 },
      { name: "nextjs", width: 191 },
      { name: "tailwindcss", width: 237 },
      { name: "figma", width: 161 },
      { name: "socketio", width: 201 },
      { name: "typescript", width: 204 },
      { name: "nodejs", width: 178 },
      { name: "mongodb", width: 202 },
      { name: "mysql", width: 172 },
      { name: "github", width: 171 },
      { name: "gsap", width: 147 },
      { name: "bootstrap", width: 197 },
      { name: "materialui", width: 169 },
      { name: "expressjs", width: 189 },
      { name: "javascript", width: 197 },
      // CIRCULAR
      { name: "framermotion", width: 64 },
      { name: "css3", width: 64 },
      { name: "html5", width: 64 },
      { name: "sass", width: 64 },
      { name: "photoshop", width: 64 },
      { name: "premierpro", width: 64 },
      { name: "illustrator", width: 64 },
      { name: "aftereffects", width: 64 },
    ];

    const SKILL_ASSETS: { texture: string; width: number }[] = BASE_SKILLS.map(
      ({ name, width }) => ({
        texture: `/skills/${name}.svg`,
        width,
      })
    );

    const SPRITE_BASE = 520;
    const FIXED_HEIGHT = 64;

    const pickAutoWidth = () => {
      if (matterContainer.clientWidth > 1000) return 260;
      if (matterContainer.clientWidth > 700) return 220;
      return 64;
    };

    const loadImage = (src: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

    const ensureTextureMeta = async (src: string) => {
      const metaMap = textureMetaRef.current;
      if (metaMap.has(src)) return metaMap.get(src)!;
      try {
        const img = await loadImage(src);
        const meta = {
          w: img.naturalWidth || img.width,
          h: img.naturalHeight || img.height,
          img,
        };
        metaMap.set(src, meta);
        return meta;
      } catch {
        const meta = {
          w: SPRITE_BASE,
          h: Math.round(SPRITE_BASE * 0.3),
          img: new Image(),
        };
        metaMap.set(src, meta);
        return meta;
      }
    };

    const resolveSize = (
      asset: { texture: string; width?: number; height?: number },
      natW: number,
      natH: number
    ) => {
      const h = FIXED_HEIGHT;
      const w =
        asset.width !== undefined
          ? asset.width
          : Math.max(1, Math.round((natW / natH) * h)) || pickAutoWidth();
      return { w, h };
    };

    const createObject = async (asset: {
      texture: string;
      width?: number;
      height?: number;
    }) => {
      const { w: natW, h: natH } = await ensureTextureMeta(asset.texture);
      const { w, h } = resolveSize(asset, natW, natH);

      // Slight randomized spawn (avoid exact overlap)
      const spawnX =
        Math.random() * (matterContainer.clientWidth - w - 20) + 10 + w / 2;
      const spawnY = -Math.random() * 120 - h; // spawn above view so they settle gently

      const box = Matter.Bodies.rectangle(spawnX, spawnY, w, h, {
        frictionAir: 0.00001, // more damping (was 0.00001)
        friction: 0.0018, // surface friction to bleed lateral energy
        frictionStatic: 0.5,
        restitution: 0.4, // reduce bounce (was 0.4) -> prevents perpetual micro bounces
        chamfer: { radius: Math.min(w, h) * 0.14 },
        render: {
          // fillStyle: "#090909",
          strokeStyle: "transparent",
          lineWidth: 0.0001,
          sprite: {
            texture: asset.texture,
            xScale: w / natW,
            yScale: h / natH,
          },
        },
      });
      Matter.Composite.add(engine.world, box);
    };

    const dropBodies = async () => {
      if (startedRef.current) return;
      startedRef.current = true;
      prevWidthRef.current = matterContainer.clientWidth;
      prevHeightRef.current = matterContainer.clientHeight;

      const groundWidth = matterContainer.clientWidth + THICCNESS * 2;
      ground = Matter.Bodies.rectangle(
        matterContainer.clientWidth / 2,
        matterContainer.clientHeight + THICCNESS / 2,
        groundWidth,
        THICCNESS,
        {
          isStatic: true,
          render: {
            fillStyle: "transparent",
            strokeStyle: "transparent",
            opacity: 0,
          },
        }
      );
      leftWall = Matter.Bodies.rectangle(
        -THICCNESS / 2,
        matterContainer.clientHeight / 2,
        THICCNESS,
        matterContainer.clientHeight * 5,
        {
          isStatic: true,
          render: {
            fillStyle: "transparent",
            strokeStyle: "transparent",
            opacity: 0,
          },
        }
      );
      rightWall = Matter.Bodies.rectangle(
        matterContainer.clientWidth + THICCNESS / 2,
        matterContainer.clientHeight / 2,
        THICCNESS,
        matterContainer.clientHeight * 5,
        { isStatic: true }
      );
      Matter.Composite.add(engine.world, [ground, leftWall, rightWall]);

      // Mouse constraint (keep same stiffness comment)
      const mouse = Matter.Mouse.create(render.canvas);
      const mouseConstraint = Matter.MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.2, render: { visible: false } },
      });
      Matter.Composite.add(engine.world, mouseConstraint);

      await Promise.all(SKILL_ASSETS.map((a) => ensureTextureMeta(a.texture)));
      for (const a of SKILL_ASSETS) await createObject(a);

      Matter.Runner.run(runner, engine);

      // Fade in after first frame to hide initial clear
      requestAnimationFrame(() => {
        canvasEl.style.opacity = "1";
      });
    };

    // -------- Blink-safe Resize (debounced) --------
    let resizeRaf: number | null = null;
    let debounceTimer: number | null = null;

    const performResize = () => {
      if (!startedRef.current) return;
      const newW = matterContainer.clientWidth;
      const newH = matterContainer.clientHeight;
      if (newW < 10 || newH < 10) return;

      const prevW = prevWidthRef.current ?? newW;
      const prevH = prevHeightRef.current ?? newH;

      const deltaW = Math.abs(newW - prevW);
      const deltaH = Math.abs(newH - prevH);

      // Ignore micro jitter (common during pin/unpin)
      if (deltaW < 8 && deltaH < 8) return;

      // Only touch actual canvas dims if significant width change
      if (deltaW >= 8) {
        if (render.canvas.width !== newW) render.canvas.width = newW;
      }
      if (deltaH >= 8) {
        if (render.canvas.height !== newH) render.canvas.height = newH;
      }

      // Adjust ground if width meaningfully changed
      if (ground && deltaW >= 8) {
        const currentWidth = ground.bounds.max.x - ground.bounds.min.x;
        const desiredWidth = newW + THICCNESS * 2;
        const scaleX = desiredWidth / currentWidth;
        if (Math.abs(scaleX - 1) > 0.05) {
          Matter.Body.scale(ground, scaleX, 1);
        }
        Matter.Body.setPosition(
          ground,
          Matter.Vector.create(newW / 2, newH + THICCNESS / 2)
        );
      } else if (ground && deltaH >= 8) {
        Matter.Body.setPosition(
          ground,
          Matter.Vector.create(newW / 2, newH + THICCNESS / 2)
        );
      }

      const desiredWallHeight = newH * 5;
      const adjustWall = (
        wall: Matter.Body | null,
        x: number
      ): Matter.Body | null => {
        if (!wall) return wall;
        // Only rebuild if height delta large
        const h = wall.bounds.max.y - wall.bounds.min.y;
        if (Math.abs(h - desiredWallHeight) > 40) {
          Matter.Composite.remove(engine.world, wall);
          const replacement = Matter.Bodies.rectangle(
            x,
            newH / 2,
            THICCNESS,
            desiredWallHeight,
            {
              isStatic: true,
              render: {
                fillStyle: "transparent",
                strokeStyle: "transparent",
                opacity: 0,
              },
            }
          );
          Matter.Composite.add(engine.world, replacement);
          return replacement;
        }
        Matter.Body.setPosition(wall, Matter.Vector.create(x, newH / 2));
        return wall;
      };
      leftWall = adjustWall(leftWall, -THICCNESS / 2);
      rightWall = adjustWall(rightWall, newW + THICCNESS / 2);

      // Light reposition for dynamic bodies only if moderate resize
      if (deltaW < newW * 0.4 && deltaH < newH * 0.4) {
        const bodies = Matter.Composite.allBodies(engine.world).filter(
          (b) => !b.isStatic
        );
        const scaleX = newW / prevW;
        const scaleY = newH / prevH;
        bodies.forEach((b) => {
          Matter.Body.setPosition(b, {
            x: b.position.x * scaleX,
            y: b.position.y * scaleY,
          });
        });
      }

      prevWidthRef.current = newW;
      prevHeightRef.current = newH;
    };

    const scheduleResize = () => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(performResize);
    };

    const handleResize = () => {
      if (debounceTimer) window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(scheduleResize, 120); // wait out ScrollTrigger adjustments
    };

    window.addEventListener("resize", handleResize);

    // --- Velocity clamp to prevent runaway numeric energy ---
    const MAX_V = 25;
    const MAX_ANG_V = 0.8;
    const afterUpdate = () => {
      if (!startedRef.current) return;
      const bodies = Matter.Composite.allBodies(engine.world);
      for (const b of bodies) {
        if (b.isStatic || b.isSleeping) continue;
        // linear velocity clamp
        const v = Math.hypot(b.velocity.x, b.velocity.y);
        if (v > MAX_V) {
          const scale = MAX_V / v;
          Matter.Body.setVelocity(b, {
            x: b.velocity.x * scale,
            y: b.velocity.y * scale,
          });
        }
        // angular velocity clamp
        if (Math.abs(b.angularVelocity) > MAX_ANG_V) {
          Matter.Body.setAngularVelocity(
            b,
            Math.sign(b.angularVelocity) * MAX_ANG_V
          );
        }
      }
    };
    Matter.Events.on(engine, "afterUpdate", afterUpdate);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            void dropBodies();
            observer.disconnect();
          }
        });
      },
      { threshold: [0, 0.3, 0.5, 1] }
    );
    observer.observe(matterContainer);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      if (debounceTimer) clearTimeout(debounceTimer);
      observer.disconnect();
      Matter.Events.off(engine, "afterUpdate", afterUpdate);
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      if (render.canvas) render.canvas.remove();
    };
  }, [isDark]);

  return (
    <div ref={containerRef} id="canvas-w" className="w-full h-full relative" />
  );
};

export default MatterCanvas;
