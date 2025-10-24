/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { Image, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { damp3, damp } from "maath/easing";

// Global scroll progress tracker
let scrollProgress = 0;

// Custom Bent Plane Geometry
class BentPlaneGeometry extends THREE.PlaneGeometry {
  constructor(
    radius: number,
    ...args: ConstructorParameters<typeof THREE.PlaneGeometry>
  ) {
    super(...args);

    const width = this.parameters.width;
    const halfWidth = width * 0.5;

    const p1 = new THREE.Vector2(-halfWidth, 0);
    const p2 = new THREE.Vector2(0, radius);
    const p3 = new THREE.Vector2(halfWidth, 0);

    const v1 = new THREE.Vector2().subVectors(p1, p2);
    const v2 = new THREE.Vector2().subVectors(p2, p3);
    const v3 = new THREE.Vector2().subVectors(p1, p3);

    const circleRadius =
      (v1.length() * v2.length() * v3.length()) / (2 * Math.abs(v1.cross(v2)));

    const center = new THREE.Vector2(0, radius - circleRadius);
    const angleTotal =
      2 * (new THREE.Vector2().subVectors(p1, center).angle() - 0.5 * Math.PI);

    const uvAttr = this.attributes.uv;
    const posAttr = this.attributes.position;
    const point = new THREE.Vector2();

    for (let i = 0; i < uvAttr.count; i++) {
      const u = 1 - uvAttr.getX(i);
      const y = posAttr.getY(i);

      point.copy(p3).rotateAround(center, angleTotal * u);
      posAttr.setXYZ(i, point.x, y, -point.y);
    }

    posAttr.needsUpdate = true;
  }
}

// Sine-Wave Animated Material
class MeshSineMaterial extends THREE.MeshBasicMaterial {
  time: { value: number };

  constructor(params: THREE.MeshBasicMaterialParameters = {}) {
    super(params);
    this.setValues(params);
    this.time = { value: 0 };
  }

  onBeforeCompile(shader: any) {
    shader.uniforms.time = this.time;
    shader.vertexShader = `
      uniform float time;
      ${shader.vertexShader}
    `;

    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      `vec3 transformed = vec3(position.x, position.y + sin(time + uv.x * PI * 4.0) / 4.0, position.z);`
    );
  }
}

// Extend Three.js objects
extend({ BentPlaneGeometry, MeshSineMaterial });

// Declare module for TypeScript
declare module "@react-three/fiber" {
  interface ThreeElements {
    bentPlaneGeometry: any;
    meshSineMaterial: any;
  }
}

// Carousel Container Component
function CarouselContainer({ children, count = 8, ...props }: any) {
  const groupRef = useRef<THREE.Group>(null!);
  const targetRotation = useRef(0);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Calculate target rotation based on scroll progress
      const fullRotation = Math.PI * 2;
      const rotationToShowAllImages = fullRotation * ((count - 1) / count);
      targetRotation.current = -scrollProgress * rotationToShowAllImages;

      // Smoothly interpolate to target rotation
      groupRef.current.rotation.y +=
        (targetRotation.current - groupRef.current.rotation.y) * 0.1;
    }

    // Camera follow mouse with damp3
    damp3(
      state.camera.position,
      [-(state.pointer.x * 2), state.pointer.y + 1.5, 10],
      0.3,
      delta
    );
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={groupRef} {...props}>
      {children}
    </group>
  );
}

// Individual Card Component
function ProjectCard({
  url,
  position,
  rotation,
}: {
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  const ref = useRef<any>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (ref.current) {
      // Scale animation on hover
      damp3(ref.current.scale, hovered ? 1.15 : 1, 0.1, delta);

      // Radius animation on hover
      damp(ref.current.material, "radius", hovered ? 0.25 : 0.1, 0.2, delta);

      // Zoom animation on hover
      damp(ref.current.material, "zoom", hovered ? 0.75 : 0.85, 0.2, delta);
    }
  });

  return (
    <Image
      ref={ref}
      url={url}
      transparent
      side={THREE.DoubleSide}
      position={position}
      rotation={rotation}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <bentPlaneGeometry args={[0.1, 1, 1, 20, 20]} />
    </Image>
  );
}

// Carousel of Images
function Carousel({
  radius = 1.4,
  count = 8,
}: {
  radius?: number;
  count?: number;
}) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <ProjectCard
          key={i}
          url={`/flip/img${Math.floor(i % 10) + 1}.png`}
          position={[
            Math.sin((i / count) * Math.PI * 2) * radius,
            0,
            Math.cos((i / count) * Math.PI * 2) * radius,
          ]}
          rotation={[0, Math.PI + (i / count) * Math.PI * 2, 0]}
        />
      ))}
    </>
  );
}

// Cylindrical Ribbon Component
function Ribbon({
  position,
  count = 8,
}: {
  position: [number, number, number];
  count?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const timeRef = useRef(0);
  const targetRotation = useRef(0);

  // Load SVG texture
  const texture = useTexture("/guri0.svg");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  useFrame((_state, delta) => {
    if (meshRef.current) {
      // Calculate target rotation based on scroll progress (same as carousel)
      const fullRotation = Math.PI * 2;
      const rotationToShowAllImages = fullRotation * ((count - 1) / count);
      targetRotation.current = -scrollProgress * rotationToShowAllImages;

      // Smoothly interpolate to target rotation (same as carousel for sync)
      meshRef.current.rotation.y +=
        (targetRotation.current - meshRef.current.rotation.y) * 0.1;

      // Animate material
      if (meshRef.current.material) {
        const material = meshRef.current.material as MeshSineMaterial;

        // Animate time for wave effect - slower animation
        timeRef.current += 0.5 * delta;
        material.time.value = timeRef.current;

        // Animate texture offset - slower scrolling
        if (material.map) {
          material.map.offset.x += delta / 4;
        }
      }
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <cylinderGeometry args={[1.56, 1.56, 0.14, 128, 16, true]} />
      <meshSineMaterial
        map={texture}
        map-anisotropy={16}
        map-repeat={[20, 1]}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}

// Main 3D Scene
function Scene() {
  const imageCount = 8;

  return (
    <>
      <CarouselContainer rotation={[0, 0, 0.15]} count={imageCount}>
        <Carousel count={imageCount} />
      </CarouselContainer>
      <Ribbon position={[0, -0.15, 0]} count={imageCount} />
    </>
  );
}

// Main Component
const ProjectsGallery = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;

      // Calculate scroll progress through the section
      // When section top hits viewport top, progress = 0
      // When section bottom hits viewport top, progress = 1
      const scrollableDistance = sectionHeight - viewportHeight;
      const scrolled = -rect.top;

      // Clamp between 0 and 1
      scrollProgress = Math.max(0, Math.min(1, scrolled / scrollableDistance));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section
      id="projects-gallery"
      ref={sectionRef}
      className="relative w-full"
      style={{ height: "300vh" }}
      aria-label="Projects Gallery"
    >
      <div className="sticky top-0 left-0 h-screen w-screen z-10">
        <Canvas
          camera={{ position: [0, 0, 100], fov: 15 }}
          gl={{
            antialias: true,
            alpha: true,
            premultipliedAlpha: false,
          }}
          style={{ background: "transparent" }}
          dpr={[1, 2]}
        >
          <Scene />
        </Canvas>
      </div>
    </section>
  );
};

export default ProjectsGallery;
