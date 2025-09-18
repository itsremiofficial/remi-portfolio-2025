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

  useEffect(() => {
    // Reset state/caches when theme changes
    startedRef.current = false;
    textureMetaRef.current.clear();

    if (!containerRef.current) return;

    const matterContainer = containerRef.current;
    const THICCNESS = 60;

    const {
      Engine,
      Render,
      Runner,
      Bodies,
      Body,
      Composite,
      Mouse,
      MouseConstraint,
      Vector,
    } = Matter;

    const engine = Engine.create();
    const render = Render.create({
      element: matterContainer,
      engine,
      options: {
        width: matterContainer.clientWidth,
        height: matterContainer.clientHeight,
        background: "transparent",
        wireframes: false,
        showAngleIndicator: false,
      },
    });

    Render.run(render);
    const runner = Runner.create();

    // Bodies refs (assigned after drop)
    let ground: Matter.Body | null = null;
    let leftWall: Matter.Body | null = null;
    let rightWall: Matter.Body | null = null;

    // Build assets based on current theme
    const themeSuffix = isDark ? "light" : "dark";
    const BASE_SKILLS: Array<{ name: string; width: number }> = [
      { name: "bootstrap", width: 202 },
      { name: "cloud", width: 234 },
      { name: "cors", width: 129 },
      { name: "css3", width: 125 },
      { name: "expressjs", width: 201 },
      { name: "figma", width: 142 },
      { name: "git", width: 104 },
      { name: "github", width: 152 },
      { name: "html5", width: 146 },
      { name: "illustrator", width: 218 },
      { name: "indesign", width: 182 },
      { name: "javascript", width: 205 },
      { name: "jwt", width: 115 },
      { name: "materialui", width: 213 },
      { name: "mongodb", width: 191 },
      { name: "mysql", width: 153 },
      { name: "nextjs", width: 157 },
      { name: "nodejs", width: 161 },
      { name: "npm", width: 125 },
      { name: "photoshop", width: 205 },
      { name: "premierpro", width: 224 },
      { name: "reactjs", width: 170 },
      { name: "responsive", width: 210 },
      { name: "sass", width: 126 },
      { name: "socialmedia", width: 228 },
      { name: "socketio", width: 183 },
      { name: "swagger", width: 177 },
      { name: "tailwindcss", width: 226 },
      { name: "typescript", width: 204 },
      { name: "vercel", width: 153 },
    ];

    const SKILL_ASSETS: { texture: string; width: number }[] = BASE_SKILLS.map(
      ({ name, width }) => ({
        texture: `/skills/${name}_${themeSuffix}.svg`,
        width,
      })
    );

    const SPRITE_BASE = 520;
    const FIXED_HEIGHT = 55;

    const pickAutoWidth = () => {
      if (matterContainer.clientWidth > 1000) return 260;
      if (matterContainer.clientWidth > 700) return 220;
      return 55;
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

      const box = Bodies.rectangle(
        Math.floor(Math.random() * window.innerWidth) + 1,
        0,
        w,
        h,
        {
          // Adjust "floatiness"/air resistance: smaller = more floaty, larger = more damped
          frictionAir: 0.00001,
          // Adjust overall bounce/springiness on collisions (0 = no bounce, 1 = very bouncy)
          restitution: 0.4,
          chamfer: { radius: Math.min(w, h) * 0.14 },
          render: {
            fillStyle: "#090909",
            strokeStyle: "transparent",
            lineWidth: 0.0001,
            sprite: {
              texture: asset.texture,
              xScale: w / natW,
              yScale: h / natH,
            },
          },
        }
      );
      Composite.add(engine.world, box);
    };

    const dropBodies = async () => {
      if (startedRef.current) return;
      startedRef.current = true;

      // Transparent bottom boundary
      ground = Bodies.rectangle(
        matterContainer.clientWidth / 2,
        matterContainer.clientHeight + THICCNESS / 2,
        27184,
        THICCNESS,
        {
          isStatic: true,
          render: {
            fillStyle: "transparent",
            strokeStyle: "transparent",
            lineWidth: 0,
            opacity: 0,
          },
        }
      );
      leftWall = Bodies.rectangle(
        0 - THICCNESS / 2,
        matterContainer.clientHeight / 2,
        THICCNESS,
        matterContainer.clientHeight * 5,
        { isStatic: true }
      );
      rightWall = Bodies.rectangle(
        matterContainer.clientWidth + THICCNESS / 2,
        matterContainer.clientHeight / 2,
        THICCNESS,
        matterContainer.clientHeight * 5,
        { isStatic: true }
      );

      Composite.add(engine.world, [ground, leftWall, rightWall]);

      const mouse = Mouse.create(render.canvas);
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: {
          // Adjust drag "spring" feel when grabbing items (0 = loose, 1 = rigid)
          stiffness: 0.2,
          render: { visible: false },
        },
      });
      Composite.add(engine.world, mouseConstraint);

      await Promise.all(SKILL_ASSETS.map((a) => ensureTextureMeta(a.texture)));
      await Promise.all(SKILL_ASSETS.map((a) => createObject(a)));

      Runner.run(runner, engine);
    };

    const scaleBodies = async () => {
      if (!startedRef.current) return;
      const allBodies = Composite.allBodies(engine.world);
      allBodies.forEach((body) => {
        if (!body.isStatic) Composite.remove(engine.world, body);
      });

      await Promise.all(SKILL_ASSETS.map((a) => ensureTextureMeta(a.texture)));
      await Promise.all(SKILL_ASSETS.map((a) => createObject(a)));
    };

    const handleResize = () => {
      render.canvas.width = matterContainer.clientWidth;
      render.canvas.height = matterContainer.clientHeight;
      if (startedRef.current && ground) {
        Body.setPosition(
          ground,
          Vector.create(
            matterContainer.clientWidth / 2,
            matterContainer.clientHeight + THICCNESS / 2
          )
        );
      }
      if (startedRef.current && rightWall) {
        Body.setPosition(
          rightWall,
          Vector.create(
            matterContainer.clientWidth + THICCNESS / 2,
            matterContainer.clientHeight / 2
          )
        );
        void scaleBodies();
      }
    };

    window.addEventListener("resize", handleResize);

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
      observer.disconnect();
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      if (render.canvas) render.canvas.remove();
    };
  }, [isDark]);

  return (
    <div ref={containerRef} id="canvas-w" className="w-full h-full relative" />
  );
};

export default MatterCanvas;
