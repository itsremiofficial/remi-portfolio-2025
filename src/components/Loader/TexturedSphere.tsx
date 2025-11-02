/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useRef, useEffect, memo } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { useLenis } from "lenis/react";
import "./AlphaSmoothMaterial";
import { useTheme } from "../../hooks/useTheme";
import { createWrappedTexture } from "./textureUtils";

interface TexturedSphereProps {
  exitTrigger: boolean;
  onExitComplete?: () => void;
}

const TexturedSphere = memo(
  ({ exitTrigger, onExitComplete }: TexturedSphereProps) => {
    const { isDark } = useTheme();

    // Memoize texture paths to prevent unnecessary reloads
    const texturePaths = useMemo(
      () => [
        isDark
          ? "/loader/loader-texture-light.png"
          : "/loader/loader-texture-dark.png",
        isDark
          ? "/loader/loader-texture-small-light.png"
          : "/loader/loader-texture-small-dark.png",
      ],
      [isDark]
    );

    const [tex1, tex2] = useLoader(THREE.TextureLoader, texturePaths);

    // Use cacheKey for texture creation
    const texture1 = useMemo(
      () => createWrappedTexture(tex1, texturePaths[0]),
      [tex1, texturePaths]
    );
    const texture2 = useMemo(
      () => createWrappedTexture(tex2, texturePaths[1]),
      [tex2, texturePaths]
    );

    const mesh1 = useRef<THREE.Mesh>(null);
    const mesh2 = useRef<THREE.Mesh>(null);
    const groupRef = useRef<THREE.Group>(null);
    const entranceTimelineRef = useRef<gsap.core.Timeline | null>(null);
    const exitTimelineRef = useRef<gsap.core.Timeline | null>(null);

    const lenis = useLenis();

    // Cache window width check
    const isMobile = useMemo(() => window.innerWidth < 768, []);
    const isDesktop = useMemo(() => window.innerWidth > 768, []);

    useEffect(() => {
      if (lenis) {
        lenis.stop();
      }
    }, [lenis]);

    // Cleanup on unmount - dispose of geometries and materials
    useEffect(() => {
      // Capture ref values at effect time for cleanup
      const mesh1Value = mesh1.current;
      const mesh2Value = mesh2.current;
      const entranceTl = entranceTimelineRef.current;
      const exitTl = exitTimelineRef.current;

      return () => {
        // Clean up meshes using captured values
        if (mesh1Value) {
          mesh1Value.geometry?.dispose();
          if (mesh1Value.material && "dispose" in mesh1Value.material) {
            (mesh1Value.material as THREE.Material).dispose();
          }
        }
        if (mesh2Value) {
          mesh2Value.geometry?.dispose();
          if (mesh2Value.material && "dispose" in mesh2Value.material) {
            (mesh2Value.material as THREE.Material).dispose();
          }
        }

        // Kill all timelines
        entranceTl?.kill();
        exitTl?.kill();
      };
    }, []);

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

    // Entrance animation
    useEffect(() => {
      if (mesh1.current && mesh2.current) {
        mesh1.current.position.y = -8;
        mesh2.current.position.y = -8;

        const tl = gsap.timeline();
        entranceTimelineRef.current = tl;

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

        return () => {
          tl.kill();
        };
      }
    }, []);

    // Exit animation - optimized with cached DOM queries
    useEffect(() => {
      if (!exitTrigger) return;
      if (!mesh1.current || !mesh2.current) return;

      // Cache all DOM queries at once
      const sections = document.querySelectorAll("section");
      const links = document.querySelectorAll("a");
      const header = document.querySelector(".header");
      const hero = document.querySelector(".hero");
      const heroTitle = document.querySelector(".hero-title");
      const heroLetters = document.querySelectorAll(".hero-title .hero-letter");
      const heroDesigner = document.querySelector(".hero-designer");
      const heroDesignerImg = document.querySelector(".hero-designer__img>img");
      const heroDesignerDescr = document.querySelectorAll(
        ".hero-designer__descr>p>span"
      );
      const heroBased = document.querySelector(".hero-based");
      const heroDescription = document.querySelector(".hero-description");
      const heroRecent = document.querySelector(".hero-recent");
      const heroCollab = document.querySelector(".hero-collab");
      const heroNumberFirst = document.querySelector(
        ".hero-title__number-first>span"
      );
      const heroNumberThird = document.querySelector(
        ".hero-title__number-third>span"
      );
      const heroNumberFour = document.querySelector(
        ".hero-title__number-four>span"
      );
      const heroNumberFive = document.querySelector(
        ".hero-title__number-five>span"
      );
      const heroNumberSecond = document.querySelector(
        ".hero-title__number-second"
      );
      const loader = document.querySelector(".loader");
      const main = document.querySelector("main");

      const tl = gsap.timeline({
        onComplete: () => {
          // Call onExitComplete after all animations finish (3s delay for content reveal)
          setTimeout(() => {
            if (onExitComplete) {
              onExitComplete();
            }
          }, 3000);
        },
      });
      exitTimelineRef.current = tl;

      tl.to(mesh2.current.position, {
        y: 10,
        duration: 1.2,
        ease: "power4.in",
      });

      tl.to(
        mesh1.current.position,
        {
          y: 10,
          duration: 1.2,
          ease: "power4.in",
        },
        "-=1.1"
      );

      // Note: sections, links, header, and main opacity are now controlled by React state
      // in App.tsx via preloaderComplete. Only animate hero elements here.

      // if (sections.length > 0) {
      //   tl.to(sections, {
      //     opacity: 1,
      //     pointerEvents: "auto",
      //     duration: 1,
      //   });
      // }

      // if (links.length > 0) {
      //   tl.to(links, {
      //     pointerEvents: "auto",
      //   });
      // }

      // if (header) {
      //   tl.to(header, {
      //     opacity: 1,
      //     pointerEvents: "auto",
      //     duration: 1,
      //   });
      // }

      if (hero) {
        if (heroLetters.length > 0) {
          tl.to(heroLetters, {
            y: 0,
            delay: 0.5,
            duration: 1.7,
            ease: "power4.inOut",
            stagger: {
              each: 0.03,
              from: "center",
            },
          });
        }

        if (isMobile && heroTitle) {
          tl.to(heroTitle, {
            delay: 1.5,
            onComplete() {
              heroTitle.classList.add("hero-title-after");
            },
          });
        }

        if (heroDesigner) {
          tl.to(heroDesigner, {
            opacity: 1,
            delay: 1.5,
            duration: 1,
            ease: "power4.out",
          });
        }

        if (heroDesignerImg) {
          tl.to(heroDesignerImg, {
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            scale: 1,
            delay: 1.6,
            duration: 2.5,
            ease: "power4.out",
          });
        }

        if (heroDesignerDescr.length > 0) {
          tl.to(heroDesignerDescr, {
            y: 0,
            delay: 1.7,
            duration: 1,
            ease: "power4.out",
            stagger: {
              each: 0.08,
            },
          });
        }

        if (heroBased) {
          tl.to(heroBased, {
            opacity: 1,
            delay: 1.5,
            duration: 1,
            ease: "power4.out",
          });
        }

        if (heroDescription) {
          tl.to(heroDescription, {
            opacity: 1,
            delay: 1.5,
            duration: 1,
            ease: "power4.out",
          });
        }

        if (heroRecent) {
          tl.to(heroRecent, {
            opacity: 1,
            delay: 1.5,
            duration: 1,
            ease: "power4.out",
          });
        }

        if (heroCollab) {
          tl.to(heroCollab, {
            opacity: 1,
            delay: 1.5,
            duration: 1,
            ease: "power4.out",
          });
        }

        if (heroNumberFirst) {
          tl.to(heroNumberFirst, {
            y: "100%",
            delay: 2,
            duration: 2,
            ease: "power4.out",
          });
        }

        if (heroNumberThird) {
          tl.to(heroNumberThird, {
            y: "300%",
            delay: 2.2,
            duration: 1.5,
            ease: "power4.out",
          });
          tl.to(heroNumberThird, {
            y: "600%",
            delay: 3.2,
            duration: 2,
            ease: "power4.out",
          });
        }

        if (heroNumberFour) {
          tl.to(heroNumberFour, {
            y: "100%",
            delay: 2.7,
            duration: 2,
            ease: "power4.out",
          });
        }

        if (heroNumberFive) {
          tl.to(heroNumberFive, {
            y: "900%",
            delay: 2.8,
            duration: 2,
            ease: "power4.out",
          });
          tl.to(heroNumberFive, {
            y: "800%",
            delay: 4.3,
            duration: 2,
            ease: "power4.out",
          });
        }

        if (heroNumberSecond) {
          tl.to(heroNumberSecond, {
            opacity: "1",
            delay: 3,
            duration: 1,
            ease: "power4.out",
          });
        }
      }

      if (loader) {
        tl.to(loader, {
          opacity: "0",
          delay: 1,
          duration: 0.5,
          ease: "power4.out",
        });
      }

      // Main opacity is now controlled by React state in App.tsx
      // if (main) {
      //   tl.to(main, {
      //     opacity: 1,
      //     delay: 3,
      //     duration: 1,
      //     ease: "power4.out",
      //   });
      // }

      if (lenis) {
        // Use a more reliable callback
        setTimeout(() => {
          lenis.start();
        }, 1500);
      }

      return () => {
        tl.kill();
      };
    }, [exitTrigger, lenis, onExitComplete, isMobile]);

    return (
      <group rotation={[isDesktop ? -0.6 : 0, 0, 0]}>
        <group ref={groupRef}>
          <mesh ref={mesh1}>
            {/* Reduced from 64x64 to 32x32 segments to prevent WebGL context loss */}
            <sphereGeometry args={[1, 32, 32]} />
            {texture1 && (
              <alphaSmoothMaterial
                attach="material"
                uniforms-map-value={texture1}
              />
            )}
          </mesh>

          <mesh ref={mesh2}>
            {/* Reduced from 64x64 to 32x32 segments to prevent WebGL context loss */}
            <sphereGeometry args={[1, 32, 32]} />
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
);

TexturedSphere.displayName = "TexturedSphere";

export default TexturedSphere;
