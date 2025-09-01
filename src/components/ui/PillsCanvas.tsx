import { useEffect, useRef } from "react";
import Matter from "matter-js";

const MatterCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

    const createObject = (bgImgLink: string) => {
      let size;
      if (matterContainer.clientWidth > 1000) size = 260;
      else if (matterContainer.clientWidth > 700) size = 220;
      else size = 180;

      const box = Bodies.rectangle(
        Math.floor(Math.random() * window.innerWidth) + 1,
        0,
        size,
        size * 0.3,
        {
          frictionAir: 0.00001,
          restitution: 0.8,
          chamfer: { radius: size * 0.14 },
          render: {
            fillStyle: "#090909",
            strokeStyle: "#fafafa",
            lineWidth: 1.5,
            sprite: {
              texture: bgImgLink,
              xScale: size / 520,
              yScale: size / 520,
            },
          },
        }
      );
      Composite.add(engine.world, box);
    };

    const imgSrcLinks: string[] = [
      "https://cdn.prod.website-files.com/6436c2f7a297c7b22d684489/665f13ec0fc5eaa985f45511_skill-component-1.png",
      "https://cdn.prod.website-files.com/6436c2f7a297c7b22d684489/665f13ec3b54b204671ba688_skill-component-2.png",
      "https://cdn.prod.website-files.com/6436c2f7a297c7b22d684489/665f13ec4059879de0ce43cb_skill-component.png",
      "https://cdn.prod.website-files.com/6436c2f7a297c7b22d684489/665f13ecbaf1fac48c8638fe_skill-component-9.png",
      "https://cdn.prod.website-files.com/6436c2f7a297c7b22d684489/665f13ec782edcd4ba79e946_skill-component-7.png",
      "https://cdn.prod.website-files.com/6436c2f7a297c7b22d684489/665f13ec353b3ce51539440c_skill-component-11.png",
      "https://cdn.prod.website-files.com/6436c2f7a297c7b22d684489/665f13ec3502f04dc9724f5f_skill-component-6.png",
      "https://cdn.prod.website-files.com/6436c2f7a297c7b22d684489/665f13ecaf4cf89d64b6fa16_skill-component-8.png",
      "https://cdn.prod.website-files.com/6436c2f7a297c7b22d684489/665f13ec18cc957b50f8b786_skill-component-3.png",
      "https://cdn.prod.website-files.com/6436c2f7a297c7b22d684489/665f13ec52ddc1181498119f_skill-component-10.png",
      "https://cdn.prod.website-files.com/6436c2f7a297c7b22d684489/665f13ec310a8e0c88e45757_skill-component-4.png",
      "https://cdn.prod.website-files.com/6436c2f7a297c7b22d684489/665f5613176f2daf7662cb0c_skill-component-4.png",
      "https://cdn.prod.website-files.com/6436c2f7a297c7b22d684489/665f5613b549e7dfc116ff17_skill-component-1.png",
      "https://cdn.prod.website-files.com/6436c2f7a297c7b22d684489/665f5613f8775c43af6ad0ab_skill-component-3.png",
      "https://cdn.prod.website-files.com/6436c2f7a297c7b22d684489/665f56130986eb3037d7ec0c_skill-component.png",
      "https://cdn.prod.website-files.com/6436c2f7a297c7b22d684489/665f56139a0dea12f107b78e_skill-component-2.png",
    ];

    imgSrcLinks.forEach((link) => createObject(link));

    const ground = Bodies.rectangle(
      matterContainer.clientWidth / 2,
      matterContainer.clientHeight + THICCNESS / 2,
      27184,
      THICCNESS,
      { isStatic: true }
    );

    const leftWall = Bodies.rectangle(
      0 - THICCNESS / 2,
      matterContainer.clientHeight / 2,
      THICCNESS,
      matterContainer.clientHeight * 5,
      { isStatic: true }
    );

    const rightWall = Bodies.rectangle(
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
        stiffness: 0.2,
        render: { visible: false },
      },
    });

    Composite.add(engine.world, mouseConstraint);

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    const scaleBodies = () => {
      const allBodies = Composite.allBodies(engine.world);
      allBodies.forEach((body) => {
        if (body.isStatic) return;
        Composite.remove(engine.world, body);
      });
      imgSrcLinks.forEach((link) => createObject(link));
    };

    const handleResize = () => {
      render.canvas.width = matterContainer.clientWidth;
      render.canvas.height = matterContainer.clientHeight;

      Body.setPosition(
        ground,
        Vector.create(
          matterContainer.clientWidth / 2,
          matterContainer.clientHeight + THICCNESS / 2
        )
      );
      Body.setPosition(
        rightWall,
        Vector.create(
          matterContainer.clientWidth + THICCNESS / 2,
          matterContainer.clientHeight / 2
        )
      );
      scaleBodies();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      if (render.canvas) {
        render.canvas.remove();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="canvas-w"
      className="w-full h-screen relative"
    />
  );
};

export default MatterCanvas;
