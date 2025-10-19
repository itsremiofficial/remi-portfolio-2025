import { useEffect, useRef, useMemo, useCallback } from "react";
import Matter from "matter-js";

// ===== CONSTANTS =====
const PHYSICS_CONFIG = {
  THICCNESS: 60,
  POSITION_ITERATIONS: 8,
  VELOCITY_ITERATIONS: 6,
  MAX_VELOCITY: 25,
  MAX_ANGULAR_VELOCITY: 0.8,
  FRICTION_AIR: 0.00001,
  FRICTION: 0.0018,
  FRICTION_STATIC: 0.5,
  RESTITUTION: 0.4,
  MOUSE_STIFFNESS: 0.2,
} as const;

const RESIZE_CONFIG = {
  DEBOUNCE_MS: 120,
  MIN_DELTA: 8,
  SCALE_THRESHOLD: 0.05,
  WALL_HEIGHT_DELTA: 40,
  MAX_RESIZE_RATIO: 0.4,
} as const;

const CANVAS_CONFIG = {
  FADE_DURATION: "0.25s",
  INTERSECTION_THRESHOLD: 0.3,
  SPRITE_BASE: 520,
  FIXED_HEIGHT: 64,
} as const;

const SKILLS = [
  { name: "bootstrap", width: 197 },
  { name: "drag", width: 150, height: 150 },
  { name: "expressjs", width: 189 },
  { name: "figma", width: 161 },
  { name: "github", width: 171 },
  { name: "gsap", width: 147 },
  { name: "javascript", width: 197 },
  { name: "materialui", width: 169 },
  { name: "mongodb", width: 202 },
  { name: "mysql", width: 172 },
  { name: "nextjs", width: 191 },
  { name: "nodejs", width: 178 },
  { name: "reactjs", width: 179 },
  { name: "socketio", width: 201 },
  { name: "tailwindcss", width: 237 },
  { name: "typescript", width: 204 },
  // Circular skills
  { name: "framermotion", width: 64 },
  { name: "illustrator", width: 64 },
  { name: "photoshop", width: 64 },
  { name: "premierpro", width: 64 },
  { name: "sass", width: 64 },
  { name: "css3", width: 64 },
  { name: "html5", width: 64 },
  { name: "aftereffects", width: 64 },
];

// ===== TYPES =====
interface SkillAsset {
  texture: string;
  width: number;
  height?: number;
}

interface TextureMeta {
  w: number;
  h: number;
  img: HTMLImageElement;
}

interface Dimensions {
  width: number;
  height: number;
}

// ===== COMPONENT =====
const PillsCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const textureMetaRef = useRef<Map<string, TextureMeta>>(new Map());
  const prevDimensionsRef = useRef<Dimensions | null>(null);

  // Memoize skill assets
  const skillAssets = useMemo<SkillAsset[]>(
    () =>
      SKILLS.map(({ name, width, height }) => ({
        texture: `/skills/${name}.svg`,
        width,
        height,
      })),
    []
  );

  // ===== HELPER FUNCTIONS =====
  const getAutoWidth = useCallback((containerWidth: number): number => {
    if (containerWidth > 1000) return 260;
    if (containerWidth > 700) return 220;
    return 64;
  }, []);

  const loadImage = useCallback(
    (src: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      }),
    []
  );

  const ensureTextureMeta = useCallback(
    async (src: string): Promise<TextureMeta> => {
      const metaMap = textureMetaRef.current;
      if (metaMap.has(src)) return metaMap.get(src)!;

      try {
        const img = await loadImage(src);
        const meta: TextureMeta = {
          w: img.naturalWidth || img.width,
          h: img.naturalHeight || img.height,
          img,
        };
        metaMap.set(src, meta);
        return meta;
      } catch {
        const meta: TextureMeta = {
          w: CANVAS_CONFIG.SPRITE_BASE,
          h: Math.round(CANVAS_CONFIG.SPRITE_BASE * 0.3),
          img: new Image(),
        };
        metaMap.set(src, meta);
        return meta;
      }
    },
    [loadImage]
  );

  const resolveSize = useCallback(
    (asset: SkillAsset, natW: number, natH: number) => {
      const h = asset.height ?? CANVAS_CONFIG.FIXED_HEIGHT;
      const w =
        asset.width ??
        (Math.max(1, Math.round((natW / natH) * h)) ||
          getAutoWidth(containerRef.current?.clientWidth || 0));
      return { w, h };
    },
    [getAutoWidth]
  );

  // ===== MAIN EFFECT =====
  useEffect(() => {
    // Reset state on theme change
    startedRef.current = false;
    textureMetaRef.current.clear();

    const container = containerRef.current;
    if (!container) return;

    // ===== ENGINE SETUP =====
    const engine = Matter.Engine.create({
      enableSleeping: true,
    });
    engine.positionIterations = PHYSICS_CONFIG.POSITION_ITERATIONS;
    engine.velocityIterations = PHYSICS_CONFIG.VELOCITY_ITERATIONS;

    const render = Matter.Render.create({
      element: container,
      engine,
      options: {
        width: container.clientWidth,
        height: container.clientHeight,
        background: "transparent",
        wireframes: false,
        showSleeping: false,
        showAngleIndicator: false,
      },
    });

    // Canvas optimization
    const canvas = render.canvas;
    canvas.style.willChange = "transform";
    canvas.style.transition = `opacity ${CANVAS_CONFIG.FADE_DURATION} ease`;
    canvas.style.opacity = "0";

    Matter.Render.run(render);
    const runner = Matter.Runner.create();

    // Boundary bodies
    let ground: Matter.Body | null = null;
    let leftWall: Matter.Body | null = null;
    let rightWall: Matter.Body | null = null;

    // ===== CREATE PHYSICS OBJECT =====
    const createObject = async (asset: SkillAsset) => {
      const { w: natW, h: natH } = await ensureTextureMeta(asset.texture);
      const { w, h } = resolveSize(asset, natW, natH);

      const spawnX =
        Math.random() * (container.clientWidth - w - 20) + 10 + w / 2;
      const spawnY = -Math.random() * 120 - h;

      const isSquare = w === h;
      const chamferRadius = isSquare
        ? Math.min(w, h) * 0.5
        : Math.min(w, h) * 0.14;

      const box = Matter.Bodies.rectangle(spawnX, spawnY, w, h, {
        frictionAir: PHYSICS_CONFIG.FRICTION_AIR,
        friction: PHYSICS_CONFIG.FRICTION,
        frictionStatic: PHYSICS_CONFIG.FRICTION_STATIC,
        restitution: PHYSICS_CONFIG.RESTITUTION,
        chamfer: { radius: chamferRadius },
        render: {
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

    // ===== DROP BODIES =====
    const dropBodies = async () => {
      if (startedRef.current) return;
      startedRef.current = true;
      prevDimensionsRef.current = {
        width: container.clientWidth,
        height: container.clientHeight,
      };

      const { THICCNESS } = PHYSICS_CONFIG;
      const groundWidth = container.clientWidth + THICCNESS * 2;

      // Create boundaries
      ground = Matter.Bodies.rectangle(
        container.clientWidth / 2,
        container.clientHeight + THICCNESS / 2,
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
        container.clientHeight / 2,
        THICCNESS,
        container.clientHeight * 5,
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
        container.clientWidth + THICCNESS / 2,
        container.clientHeight / 2,
        THICCNESS,
        container.clientHeight * 5,
        {
          isStatic: true,
          render: {
            fillStyle: "transparent",
            strokeStyle: "transparent",
            opacity: 0,
          },
        }
      );

      Matter.Composite.add(engine.world, [ground, leftWall, rightWall]);

      // Mouse interaction
      const mouse = Matter.Mouse.create(canvas);
      const mouseConstraint = Matter.MouseConstraint.create(engine, {
        mouse,
        constraint: {
          stiffness: PHYSICS_CONFIG.MOUSE_STIFFNESS,
          render: { visible: false },
        },
      });
      Matter.Composite.add(engine.world, mouseConstraint);

      // Load and create all skills
      await Promise.all(skillAssets.map((a) => ensureTextureMeta(a.texture)));
      for (const asset of skillAssets) await createObject(asset);

      Matter.Runner.run(runner, engine);

      // Fade in
      requestAnimationFrame(() => {
        canvas.style.opacity = "1";
      });
    };

    // ===== RESIZE HANDLER =====
    let resizeRaf: number | null = null;
    let debounceTimer: number | null = null;

    const performResize = () => {
      if (!startedRef.current || !prevDimensionsRef.current) return;

      const newW = container.clientWidth;
      const newH = container.clientHeight;
      if (newW < 10 || newH < 10) return;

      const { width: prevW, height: prevH } = prevDimensionsRef.current;
      const deltaW = Math.abs(newW - prevW);
      const deltaH = Math.abs(newH - prevH);

      // Ignore micro jitter
      if (deltaW < RESIZE_CONFIG.MIN_DELTA && deltaH < RESIZE_CONFIG.MIN_DELTA)
        return;

      const { THICCNESS } = PHYSICS_CONFIG;
      const {
        MIN_DELTA,
        SCALE_THRESHOLD,
        WALL_HEIGHT_DELTA,
        MAX_RESIZE_RATIO,
      } = RESIZE_CONFIG;

      // Update canvas dimensions
      if (deltaW >= MIN_DELTA && render.canvas.width !== newW) {
        render.canvas.width = newW;
      }
      if (deltaH >= MIN_DELTA && render.canvas.height !== newH) {
        render.canvas.height = newH;
      }

      // Adjust ground
      if (ground && deltaW >= MIN_DELTA) {
        const currentWidth = ground.bounds.max.x - ground.bounds.min.x;
        const desiredWidth = newW + THICCNESS * 2;
        const scaleX = desiredWidth / currentWidth;
        if (Math.abs(scaleX - 1) > SCALE_THRESHOLD) {
          Matter.Body.scale(ground, scaleX, 1);
        }
        Matter.Body.setPosition(
          ground,
          Matter.Vector.create(newW / 2, newH + THICCNESS / 2)
        );
      } else if (ground && deltaH >= MIN_DELTA) {
        Matter.Body.setPosition(
          ground,
          Matter.Vector.create(newW / 2, newH + THICCNESS / 2)
        );
      }

      // Adjust walls
      const desiredWallHeight = newH * 5;
      const adjustWall = (
        wall: Matter.Body | null,
        x: number
      ): Matter.Body | null => {
        if (!wall) return wall;
        const h = wall.bounds.max.y - wall.bounds.min.y;
        if (Math.abs(h - desiredWallHeight) > WALL_HEIGHT_DELTA) {
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

      // Reposition dynamic bodies on moderate resize
      if (
        deltaW < newW * MAX_RESIZE_RATIO &&
        deltaH < newH * MAX_RESIZE_RATIO
      ) {
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

      prevDimensionsRef.current = { width: newW, height: newH };
    };

    const scheduleResize = () => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(performResize);
    };

    const handleResize = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(
        scheduleResize,
        RESIZE_CONFIG.DEBOUNCE_MS
      );
    };

    window.addEventListener("resize", handleResize);

    // ===== VELOCITY CLAMPING =====
    const afterUpdate = () => {
      if (!startedRef.current) return;
      const { MAX_VELOCITY, MAX_ANGULAR_VELOCITY } = PHYSICS_CONFIG;
      const bodies = Matter.Composite.allBodies(engine.world);

      for (const body of bodies) {
        if (body.isStatic || body.isSleeping) continue;

        // Clamp linear velocity
        const v = Math.hypot(body.velocity.x, body.velocity.y);
        if (v > MAX_VELOCITY) {
          const scale = MAX_VELOCITY / v;
          Matter.Body.setVelocity(body, {
            x: body.velocity.x * scale,
            y: body.velocity.y * scale,
          });
        }

        // Clamp angular velocity
        if (Math.abs(body.angularVelocity) > MAX_ANGULAR_VELOCITY) {
          Matter.Body.setAngularVelocity(
            body,
            Math.sign(body.angularVelocity) * MAX_ANGULAR_VELOCITY
          );
        }
      }
    };

    Matter.Events.on(engine, "afterUpdate", afterUpdate);

    // ===== INTERSECTION OBSERVER =====
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            entry.intersectionRatio >= CANVAS_CONFIG.INTERSECTION_THRESHOLD
          ) {
            void dropBodies();
            observer.disconnect();
          }
        });
      },
      { threshold: [0, 0.3, 0.5, 1] }
    );
    observer.observe(container);

    // ===== CLEANUP =====
    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      if (debounceTimer) clearTimeout(debounceTimer);
      observer.disconnect();
      Matter.Events.off(engine, "afterUpdate", afterUpdate);
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      if (canvas) canvas.remove();
    };
  }, [skillAssets, ensureTextureMeta, resolveSize]);

  return (
    <div ref={containerRef} id="canvas-w" className="w-full h-full relative" />
  );
};

export default PillsCanvas;
