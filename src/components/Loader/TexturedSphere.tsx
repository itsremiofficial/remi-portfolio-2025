/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useRef, useEffect } from "react";
import { useLoader, useFrame, extend } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { useLenis } from "lenis/react";
import "./AlphaSmoothMaterial";
import { useTheme } from "../../hooks/useTheme";

interface TexturedSphereProps {
  exitTrigger: boolean;
  onExitComplete?: () => void;
}

function createWrappedTexture(
  originalTexture: THREE.Texture | null
): THREE.Texture | null {
  if (!originalTexture) return null;

  const width = 2048;
  const height = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
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
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3] / 255;
    data[i] = data[i] * alpha;
    data[i + 1] = data[i + 1] * alpha;
    data[i + 2] = data[i + 2] * alpha;
  }
  ctx.putImageData(imageData, 0, 0);

  const newTexture = new THREE.CanvasTexture(canvas);
  newTexture.wrapS = THREE.ClampToEdgeWrapping;
  newTexture.wrapT = THREE.ClampToEdgeWrapping;
  newTexture.minFilter = THREE.LinearFilter;
  newTexture.magFilter = THREE.LinearFilter;
  newTexture.generateMipmaps = false;
  newTexture.needsUpdate = true;

  return newTexture;
}

function TexturedSphere({ exitTrigger, onExitComplete }: TexturedSphereProps) {
  const { isDark } = useTheme();

  const [tex1, tex2] = useLoader(THREE.TextureLoader, [
    isDark
      ? "/loader/loader-texture-light.png"
      : "/loader/loader-texture-dark.png",
    isDark
      ? "/loader/loader-texture-small-light.png"
      : "/loader/loader-texture-small-dark.png",
  ]);

  const texture1 = useMemo(() => createWrappedTexture(tex1), [tex1]);
  const texture2 = useMemo(() => createWrappedTexture(tex2), [tex2]);

  const mesh1 = useRef<THREE.Mesh>(null);
  const mesh2 = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      lenis.stop();
    }
  }, [lenis]);

  useFrame((state, delta) => {
    if (mesh1.current) mesh1.current.rotation.y -= delta * 0.3;
    if (mesh2.current) mesh2.current.rotation.y -= delta * 0.5;

    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      groupRef.current.rotation.x = 0.4 + Math.sin(t * 0.2) * 0.05;
      groupRef.current.rotation.z = 0.2 + Math.cos(t * 0.25) * 0.05;
      groupRef.current.position.y = Math.sin(t * 0.3) * 0.05;
    }
  });

  useEffect(() => {
    if (mesh1.current && mesh2.current) {
      mesh1.current.position.y = -8;
      mesh2.current.position.y = -8;

      const tl = gsap.timeline();
      tl.to(mesh1.current.position, {
        y: 0.18,
        duration: 2.5,
        delay: 1,
        ease: "power4.out",
      });
      tl.to(
        mesh2.current.position,
        { y: -0.18, duration: 2, ease: "power4.out" },
        "-=2"
      );
    }
  }, []);

  useEffect(() => {
    if (exitTrigger && mesh1.current && mesh2.current) {
      const tl = gsap.timeline();

      tl.to(mesh2.current.position, {
        y: -10,
        duration: 1.2,
        ease: "power4.in",
      });

      tl.to(
        mesh1.current.position,
        {
          y: -10,
          duration: 1.2,
          ease: "power4.in",
        },
        "-=1.1"
      );

      tl.to("section", {
        opacity: 1,
        pointerEvents: "auto",
        duration: 1,
        onComplete: () => {
          setTimeout(() => {
            if (onExitComplete) onExitComplete();
          }, 3000);
        },
      });

      tl.to("a", {
        pointerEvents: "auto",
      });

      tl.to(".header", {
        opacity: 1,
        pointerEvents: "auto",
        duration: 1,
      });

      const hero = document.querySelector(".hero");
      if (hero) {
        gsap.to(".hero-title .hero-letter", {
          y: 0,
          delay: 0.5,
          duration: 1.7,
          ease: "power4.inOut",
          stagger: {
            each: 0.03,
            from: "center",
          },
        });

        if (window.innerWidth < 768) {
          gsap.to(".hero-title", {
            delay: 1.5,
            onComplete() {
              document
                .querySelector(".hero-title")
                ?.classList.add("hero-title-after");
            },
          });
        }

        gsap.to(".hero-designer", {
          opacity: 1,
          delay: 1.5,
          duration: 1,
          ease: "power4.out",
        });

        gsap.to(".hero-designer__img>img", {
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          scale: 1,
          delay: 1.6,
          duration: 2.5,
          ease: "power4.out",
        });

        gsap.to(".hero-designer__descr>p>span", {
          y: 0,
          delay: 1.7,
          duration: 1,
          ease: "power4.out",
          stagger: {
            each: 0.08,
          },
        });

        gsap.to(".hero-based", {
          opacity: 1,
          delay: 1.5,
          duration: 1,
          ease: "power4.out",
        });

        gsap.to(".hero-description", {
          opacity: 1,
          delay: 1.5,
          duration: 1,
          ease: "power4.out",
        });

        gsap.to(".hero-recent", {
          opacity: 1,
          delay: 1.5,
          duration: 1,
          ease: "power4.out",
        });

        gsap.to(".hero-collab", {
          opacity: 1,
          delay: 1.5,
          duration: 1,
          ease: "power4.out",
        });

        gsap.to(".hero-title__number-first>span", {
          y: "100%",
          delay: 2,
          duration: 2,
          ease: "power4.out",
        });

        gsap.to(".hero-title__number-third>span", {
          y: "300%",
          delay: 2.2,
          duration: 1.5,
          ease: "power4.out",
        });
        gsap.to(".hero-title__number-third>span", {
          y: "600%",
          delay: 3.2,
          duration: 2,
          ease: "power4.out",
        });
        gsap.to(".hero-title__number-four>span", {
          y: "100%",
          delay: 2.7,
          duration: 2,
          ease: "power4.out",
        });
        gsap.to(".hero-title__number-five>span", {
          y: "900%",
          delay: 2.8,
          duration: 2,
          ease: "power4.out",
        });
        gsap.to(".hero-title__number-five>span", {
          y: "800%",
          delay: 4.3,
          duration: 2,
          ease: "power4.out",
        });
        gsap.to(".hero-title__number-second", {
          opacity: "1",
          delay: 3,
          duration: 1,
          ease: "power4.out",
        });
        gsap.to(".loader", {
          opacity: "0",
          delay: 1,
          duration: 0.5,
          ease: "power4.out",
        });
      }

      gsap.to("main", {
        opacity: 1,
        delay: 3,
        duration: 1,
        ease: "power4.out",
      });

      if (lenis) {
        lenis.start();
      }
    }
  }, [exitTrigger, lenis, onExitComplete, isDark]);

  return (
    <group rotation={[window.innerWidth > 768 ? -0.6 : 0, 0, 0]}>
      <group ref={groupRef}>
        <mesh ref={mesh1}>
          <sphereGeometry args={[1, 64, 64]} />
          {texture1 && (
            <alphaSmoothMaterial
              attach="material"
              uniforms-map-value={texture1}
            />
          )}
        </mesh>

        <mesh ref={mesh2}>
          <sphereGeometry args={[1, 64, 64]} />
          {texture2 && (
            <alphaSmoothMaterial
              attach="material"
              uniforms-map-value={texture2}
            />
          )}
        </mesh>
      </group>
    </group>
  );
}

export default TexturedSphere;
