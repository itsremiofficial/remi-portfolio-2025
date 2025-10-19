import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

// ===== CONSTANTS =====
const DISTORTION_CONFIG = {
  STRENGTH: 0.5,
  SPEED: 2.0,
  TRANSITION_DURATION: 0.8,
  EASE: "power2.out",
} as const;

// ===== VERTEX SHADER =====

// Vertex shader
const vertexShader = /* glsl */ `
    varying vec2 vUv;
    varying vec2 vUvCover;
    uniform vec2 uTextureSize;
    uniform vec2 uQuadSize;

    void main(){
      vUv = uv;

      // "cover" mapping to preserve aspect ratio
      float texR = uTextureSize.x / uTextureSize.y;
      float quadR = uQuadSize.x / uQuadSize.y;
      vec2 s = vec2(1.0);
      if (quadR > texR) { s.y = texR / quadR; } else { s.x = quadR / texR; }
      vUvCover = vUv * s + (1.0 - s) * 0.5;

      gl_Position = vec4(position, 1);
    }
  `;

// Fragment shader
const fragmentShader = `
    precision highp float;

    uniform sampler2D uTexture;
    uniform vec2 uTextureSize;
    uniform vec2 uQuadSize;
    uniform float uTime;
    uniform float uScrollVelocity;  // signed -1..1
    uniform float uVelocityStrength; // 0..1, decays to 0

    varying vec2 vUv;
    varying vec2 vUvCover;

    void main() {
      vec2 texCoords = vUvCover;

      // drive distortion amount from velocity strength
      float amt = 0.03 * uVelocityStrength;

      // small wave that doesn’t depend on mouse
      float t = uTime * 0.8;
      texCoords.y += sin((texCoords.x * 8.0) + t) * amt;
      texCoords.x += cos((texCoords.y * 6.0) - t * 0.8) * amt * 0.6;

      // optional directional tint: push R/G/B differently by scroll direction
      float dir = sign(uScrollVelocity);
      vec2 tc = texCoords;

      float r = texture2D(uTexture, tc + vec2( amt * 0.50 * dir, 0.0)).r;
      float g = texture2D(uTexture, tc + vec2( amt * 0.25 * dir, 0.0)).g;
      float b = texture2D(uTexture, tc + vec2(-amt * 0.35 * dir, 0.0)).b;

      gl_FragColor = vec4(r, g, b, 1.0);
    }
  `;

// ===== SHADER MATERIAL COMPONENT =====
interface ShaderPlaneProps {
  imageUrl: string;
  isHovered: boolean;
}

const ShaderPlane = ({ imageUrl, isHovered }: ShaderPlaneProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const hoverRef = useRef({ value: 0 });

  // Load texture
  const texture = useTexture(imageUrl);

  // Shader uniforms
  const uniforms = useRef({
    uTexture: { value: texture },
    uHover: { value: 0 },
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
  });

  // Handle hover state changes
  useEffect(() => {
    gsap.to(hoverRef.current, {
      value: isHovered ? 1 : 0,
      duration: DISTORTION_CONFIG.TRANSITION_DURATION,
      ease: DISTORTION_CONFIG.EASE,
      onUpdate: () => {
        if (uniforms.current.uHover) {
          uniforms.current.uHover.value = hoverRef.current.value;
        }
      },
    });
  }, [isHovered]);

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!meshRef.current) return;

      const rect = (e.target as HTMLElement)?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left) / rect.width;
        const y = 1.0 - (e.clientY - rect.top) / rect.height;

        gsap.to(mouseRef.current, {
          x,
          y,
          duration: 0.3,
          ease: "power2.out",
          onUpdate: () => {
            if (uniforms.current.uMouse) {
              uniforms.current.uMouse.value.set(
                mouseRef.current.x,
                mouseRef.current.y
              );
            }
          },
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animation loop
  useFrame(({ clock }) => {
    if (uniforms.current.uTime) {
      uniforms.current.uTime.value =
        clock.getElapsedTime() * DISTORTION_CONFIG.SPEED;
    }
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms.current}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// ===== MAIN COMPONENT =====
interface ImageDistortionProps {
  imageUrl: string;
  isHovered: boolean;
  className?: string;
}

const ImageDistortion = ({
  imageUrl,
  isHovered,
  className,
}: ImageDistortionProps) => {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
      >
        <ShaderPlane imageUrl={imageUrl} isHovered={isHovered} />
      </Canvas>
    </div>
  );
};

export default ImageDistortion;
