/**
 * TexturedSphere Component
 *
 * Renders two animated 3D spheres with custom textures in the PreLoader.
 * The spheres feature continuous rotation, floating motion, and entrance/exit animations.
 *
 * Features:
 * - Dual-sphere system with different textures (large + small)
 * - Theme-aware texture loading (light/dark mode)
 * - Texture caching for performance
 * - Custom alpha-smooth shader material
 * - GSAP-powered entrance animation (bottom to center)
 * - GSAP-powered exit animation (center to top)
 * - Continuous rotation and floating effects
 * - Desktop-only camera orbit integration
 * - Proper geometry and material disposal
 *
 * Props:
 * - exitTrigger: Triggers the exit animation when true
 * - onExitComplete: Callback fired when exit animation completes
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useRef, useEffect, memo } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { useLenis } from "lenis/react";
import "./AlphaSmoothMaterial";
import { useTheme } from "../../hooks/useTheme";
import { createWrappedTexture } from "./textureUtils";
import { assetUrl } from "../../utils/assetUrl";

// ===== TYPES =====
interface TexturedSphereProps {
  exitTrigger: boolean;
  onExitComplete?: () => void;
}

// ===== COMPONENT =====
const TexturedSphere = memo(
  ({ exitTrigger, onExitComplete }: TexturedSphereProps) => {
    // ===== HOOKS =====
    const { isDark } = useTheme();
    const lenis = useLenis();

    // ===== TEXTURE LOADING =====
    // Memoize texture paths to prevent unnecessary reloads
    const texturePaths = useMemo(
      () => [
        isDark
          ? assetUrl("/loader/loader-texture-light.avif")
          : assetUrl("/loader/loader-texture-dark.avif"),
        isDark
          ? assetUrl("/loader/loader-texture-small-light.avif")
          : assetUrl("/loader/loader-texture-small-dark.avif"),
      ],
      [isDark],
    );

    const [tex1, tex2] = useLoader(THREE.TextureLoader, texturePaths);

    const texture1 = useMemo(
      () => createWrappedTexture(tex1, texturePaths[0]),
      [tex1, texturePaths],
    );
    const texture2 = useMemo(
      () => createWrappedTexture(tex2, texturePaths[1]),
      [tex2, texturePaths],
    );

    // ===== REFS =====
    const mesh1 = useRef<THREE.Mesh>(null);
    const mesh2 = useRef<THREE.Mesh>(null);
    const groupRef = useRef<THREE.Group>(null);
    const entranceTimelineRef = useRef<gsap.core.Timeline | null>(null);
    const exitTimelineRef = useRef<gsap.core.Timeline | null>(null);
    const lenisTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // ===== COMPUTED VALUES =====
    const isDesktop = useMemo(() => window.innerWidth > 768, []);

    // ===== EFFECTS =====
    // Disable smooth scrolling while loader is visible
    useEffect(() => {
      if (lenis) {
        lenis.stop();
      }
    }, [lenis]);

    // Cleanup on unmount
    useEffect(() => {
      const mesh1Value = mesh1.current;
      const mesh2Value = mesh2.current;
      const entranceTl = entranceTimelineRef.current;
      const exitTl = exitTimelineRef.current;
      const timeoutId = lenisTimeoutRef.current;

      return () => {
        // Dispose geometries and materials
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

        // Kill timelines and clear timeouts
        entranceTl?.kill();
        exitTl?.kill();
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    }, []);

    // Continuous rotation and floating animation
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

    // Entrance animation - spheres rise from bottom
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
          "-=2",
        );

        return () => {
          tl.kill();
        };
      }
    }, []);

    // Exit animation - spheres move upward when loading completes
    useEffect(() => {
      if (!exitTrigger) return;
      if (!mesh1.current || !mesh2.current) return;

      const tl = gsap.timeline({
        onComplete: () => {
          if (onExitComplete) {
            onExitComplete();
          }
        },
      });
      exitTimelineRef.current = tl;

      // Animate both spheres upward with slight overlap
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
        "-=1.25",
      );

      // Re-enable smooth scroll after animations complete
      if (lenis) {
        const timeoutId = setTimeout(() => {
          lenis.start();
        }, 1500);
        lenisTimeoutRef.current = timeoutId;
      }

      return () => {
        tl.kill();
      };
    }, [exitTrigger, lenis, onExitComplete]);

    // ===== RENDER =====
    return (
      <group rotation={[isDesktop ? -0.6 : 0, 0, 0]}>
        <group ref={groupRef}>
          {/* Large Sphere - Primary texture */}
          <mesh ref={mesh1}>
            <sphereGeometry args={[1, 32, 32]} />
            {texture1 && (
              <alphaSmoothMaterial
                attach="material"
                uniforms-map-value={texture1}
              />
            )}
          </mesh>

          {/* Small Sphere - Secondary texture */}
          <mesh ref={mesh2}>
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
  },
);

TexturedSphere.displayName = "TexturedSphere";

export default TexturedSphere;
