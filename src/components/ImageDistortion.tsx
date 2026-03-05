import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

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
}

const ShaderPlane = ({ imageUrl }: ShaderPlaneProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();

  // Scroll velocity tracking — targets set by scroll handler, smoothed in frame loop
  const scrollRef = useRef({
    lastScrollY: 0,
    targetVelocity: 0,
    targetStrength: 0,
    currentVelocity: 0,
    currentStrength: 0,
  });

  // Load texture
  const texture = useTexture(imageUrl);

  // Ensure texture uses proper settings
  useEffect(() => {
    if (texture) {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.needsUpdate = true;
    }
  }, [texture]);

  // Shader uniforms — must match what the vertex & fragment shaders expect
  const uniforms = useRef({
    uTexture: { value: texture },
    uTextureSize: {
      value: new THREE.Vector2(
        texture.image?.width || 1,
        texture.image?.height || 1,
      ),
    },
    uQuadSize: { value: new THREE.Vector2(1, 1) },
    uTime: { value: 0 },
    uScrollVelocity: { value: 0 },
    uVelocityStrength: { value: 0 },
  });

  // Keep texture ref up to date
  useEffect(() => {
    uniforms.current.uTexture.value = texture;
    if (texture.image) {
      uniforms.current.uTextureSize.value.set(
        texture.image.width,
        texture.image.height,
      );
    }
  }, [texture]);

  // Update quad size when viewport changes
  useEffect(() => {
    uniforms.current.uQuadSize.value.set(viewport.width, viewport.height);
  }, [viewport.width, viewport.height]);

  // Track scroll velocity — just set targets, smoothing happens in useFrame
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - scrollRef.current.lastScrollY;
      scrollRef.current.lastScrollY = currentY;

      // Set target velocity (direction, -1..1)
      scrollRef.current.targetVelocity = THREE.MathUtils.clamp(
        delta / 50,
        -1,
        1,
      );
      // Set target strength (magnitude, 0..1)
      scrollRef.current.targetStrength = THREE.MathUtils.clamp(
        Math.abs(delta) / 30,
        0,
        1,
      );
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation loop — smooth lerp toward targets, decay targets toward 0
  useFrame(({ clock }) => {
    uniforms.current.uTime.value =
      clock.getElapsedTime() * DISTORTION_CONFIG.SPEED;

    const sr = scrollRef.current;

    // Decay targets toward 0 (simulates scroll stopping)
    sr.targetStrength *= 0.96;
    sr.targetVelocity *= 0.96;

    // Smoothly interpolate current values toward targets
    sr.currentVelocity = THREE.MathUtils.lerp(
      sr.currentVelocity,
      sr.targetVelocity,
      0.08,
    );
    sr.currentStrength = THREE.MathUtils.lerp(
      sr.currentStrength,
      sr.targetStrength,
      0.08,
    );

    uniforms.current.uScrollVelocity.value = sr.currentVelocity;
    uniforms.current.uVelocityStrength.value = sr.currentStrength;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2, 1, 1]} />
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
  className?: string;
}

const ImageDistortion = ({ imageUrl, className }: ImageDistortionProps) => {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        dpr={[1, 2]}
        frameloop="always"
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
        }}
      >
        <ShaderPlane imageUrl={imageUrl} />
      </Canvas>
    </div>
  );
};

export default ImageDistortion;
