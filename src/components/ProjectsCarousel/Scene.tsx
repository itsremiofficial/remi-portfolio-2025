import { useRef, useState, useEffect, forwardRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Image, useTexture, useVideoTexture } from "@react-three/drei";
import * as THREE from "three";
import { damp3, damp } from "maath/easing";
import { useNavigate } from "react-router-dom";
import "./ThreeExtensions"; // Import to register extensions
import type { ThreeEvent, ThreeElements } from "@react-three/fiber";
import type { CarouselState } from "./types";
import WORKS, { type Work } from "../../constants/WORKS";
import { MeshSineMaterial } from "./ThreeExtensions";

const IMAGE_COUNT = 5;
// Create squircle alpha map texture for rounded corners with clipping mask
// Singleton to avoid recreating it for every card
let squircleAlphaMap: THREE.CanvasTexture | null = null;

const getSquircleAlphaMap = () => {
  if (squircleAlphaMap) return squircleAlphaMap;

  const canvas = document.createElement("canvas");
  const size = 512;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    // Clear canvas to transparent
    ctx.clearRect(0, 0, size, size);

    // Draw squircle shape with rounded corners and padding for clean clipping
    const padding = 2; // Small padding to ensure clean edges
    const radius = size * 0.12; // CONFIG: 12% radius for rounded corners
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.roundRect(
      padding,
      padding,
      size - padding * 2,
      size - padding * 2,
      radius
    );
    ctx.fill();
  }

  squircleAlphaMap = new THREE.CanvasTexture(canvas);
  squircleAlphaMap.needsUpdate = true;
  return squircleAlphaMap;
};

// Video Plane Component
const VideoPlane = forwardRef<
  THREE.Mesh,
  {
    url: string;
    alphaMap: THREE.Texture;
  } & ThreeElements["mesh"]
>(({ url, alphaMap, ...props }, ref) => {
  const texture = useVideoTexture(url, {
    unsuspend: "canplay",
    muted: true,
    loop: true,
    start: true,
    playsInline: true,
  });

  return (
    <mesh ref={ref} {...props}>
      {/* CONFIG: Card geometry [curvature, width, height, widthSegments, heightSegments] */}
      {/* Z-axis scale -1 inverts the curve depth while keeping face outward */}
      {/* Ratio 1920/1080 = 1.77. 2.15 / 1.21 ~= 1.77 */}
      <bentPlaneGeometry args={[0.35, 2.15, 1.21, 20, 20]} />
      <meshBasicMaterial
        map={texture}
        toneMapped={false}
        alphaMap={alphaMap}
        alphaTest={0.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
});

// Individual Card Component
function ProjectCard({
  url,
  position,
  rotation,
  projectData,
  onHover,
  onHoverEnd,
}: {
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
  projectData: Work;
  onHover: (data: Work) => void;
  onHoverEnd: () => void;
}) {
  const navigate = useNavigate();
  const ref = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const isDragging = useRef(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const dragThreshold = 5; // pixels - movement threshold to consider it a drag

  // Use the singleton alpha map
  const alphaMap = getSquircleAlphaMap();

  useFrame((_state, delta) => {
    if (ref.current) {
      // ============================================================
      // CARD SCALE-IN ANIMATION (INITIAL ZOOM)
      // ============================================================
      damp3(ref.current.scale, hovered ? 1.1 : 1, 0.1, delta);

      // CONFIG: Card curvature (0.25 = more curved, 0.1 = flatter)
      damp(ref.current.material, "radius", hovered ? 0.2 : 0.1, 0.2, delta);

      // CONFIG: Image zoom level (0.75 = zoomed in, 0.85 = normal)
      damp(ref.current.material, "zoom", hovered ? 0.97 : 1, 0.2, delta);
    }
  });

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    // Track starting position for drag detection
    dragStart.current = { x: e.clientX, y: e.clientY };
    isDragging.current = false;
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    // Check if we've moved enough to consider it a drag
    if (dragStart.current) {
      const dx = Math.abs(e.clientX - dragStart.current.x);
      const dy = Math.abs(e.clientY - dragStart.current.y);

      if (dx > dragThreshold || dy > dragThreshold) {
        isDragging.current = true;
      }
    }
  };

  const handlePointerUp = () => {
    // Reset drag tracking on pointer up
    dragStart.current = null;
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    onHover(projectData);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    setHovered(false);
    onHoverEnd();
    document.body.style.cursor = "auto";
    // Clean up drag tracking if pointer leaves
    dragStart.current = null;
    isDragging.current = false;
  };

  const handleClick = (e: ThreeEvent<PointerEvent>) => {
    // Prevent navigation if user was dragging
    if (isDragging.current) {
      isDragging.current = false;
      dragStart.current = null;
      return;
    }

    e.stopPropagation();
    navigate(`/work/${projectData.slug}`);
  };

  return (
    <group position={position} rotation={rotation}>
      <group scale={[1, 1, -1]}>
        {projectData.videoUrl ? (
          <VideoPlane
            ref={ref}
            url={projectData.videoUrl}
            alphaMap={alphaMap}
            onClick={handleClick}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
          />
        ) : (
          <Image
            ref={ref}
            url={url}
            transparent
            side={THREE.DoubleSide}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            onClick={handleClick}
            material-alphaMap={alphaMap}
            material-alphaTest={0.5}
          >
            {/* CONFIG: Card geometry [curvature, width, height, widthSegments, heightSegments] */}
            {/* Z-axis scale -1 inverts the curve depth while keeping face outward */}
            {/* Ratio 1920/1080 = 1.77. 2.15 / 1.21 ~= 1.77 */}
            <bentPlaneGeometry args={[0.35, 2.15, 1.3, 20, 20]} />
          </Image>
        )}
      </group>
    </group>
  );
}

// Carousel of Images
function Carousel({
  radius = 2,
  count = IMAGE_COUNT,
  onHover,
  onHoverEnd,
}: {
  radius?: number;
  count?: number;
  onHover: (data: Work) => void;
  onHoverEnd: () => void;
}) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const projectData = WORKS[i % WORKS.length];
        return (
          <ProjectCard
            key={i}
            url={projectData.imageUrl}
            position={[
              Math.sin((i / count) * Math.PI * 2) * radius,
              0,
              Math.cos((i / count) * Math.PI * 2) * radius,
            ]}
            rotation={[0, (i / count) * Math.PI * 2, 0]}
            projectData={projectData}
            onHover={onHover}
            onHoverEnd={onHoverEnd}
          />
        );
      })}
    </>
  );
}

// Carousel Container Component
function CarouselContainer({
  children,
  count = IMAGE_COUNT,
  carouselState,
  ...props
}: {
  children: React.ReactNode;
  count?: number;
  carouselState: React.MutableRefObject<CarouselState>;
} & React.ComponentProps<"group">) {
  const groupRef = useRef<THREE.Group>(null!);
  const targetRotation = useRef(0);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const {
        scrollProgress,
        dragRotation,
        isDragging,
        autoRotation,
        autoRotationDirection,
      } = carouselState.current;

      // Auto-rotation when not dragging
      if (!isDragging) {
        // CONFIG: Auto-rotation speed (higher = faster, currently 0.1)
        carouselState.current.autoRotation +=
          delta * 0.1 * autoRotationDirection;
      }

      // Calculate target rotation based on scroll progress, drag, and auto-rotation
      const fullRotation = Math.PI * 2;
      const rotationToShowAllImages = fullRotation * ((count - 1) / count);
      const scrollRotation = -scrollProgress * rotationToShowAllImages;

      targetRotation.current = scrollRotation + dragRotation + autoRotation;

      // CONFIG: Rotation smoothing (0.1 = smooth, 1.0 = instant)
      groupRef.current.rotation.y +=
        (targetRotation.current - groupRef.current.rotation.y) * 0.1;
    }

    // CONFIG: Camera movement
    // [x offset, y offset, z distance] - affects parallax effect
    // Smoothing: 0.3 (lower = smoother, higher = snappier)
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

// Cylindrical Ribbon Component
function Ribbon({
  position,
  count = IMAGE_COUNT,
  isDark,
  carouselState,
}: {
  position: [number, number, number];
  count?: number;
  isDark: boolean;
  carouselState: React.MutableRefObject<CarouselState>;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const timeRef = useRef(0);
  const targetRotation = useRef(0);

  // Load SVG texture based on theme
  const texturePath = isDark ? "/remi_ribbon.svg" : "/remi_ribbon_dark.svg";
  const texture = useTexture(texturePath);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  useFrame((_state, delta) => {
    if (meshRef.current) {
      const { scrollProgress, dragRotation, autoRotation } =
        carouselState.current;

      // Calculate target rotation based on scroll progress, drag, and auto-rotation (same as carousel)
      const fullRotation = Math.PI * 2;
      const rotationToShowAllImages = fullRotation * ((count - 1) / count);
      const scrollRotation = -scrollProgress * rotationToShowAllImages;

      targetRotation.current = scrollRotation + dragRotation + autoRotation;

      // CONFIG: Rotation smoothing (0.1 = smooth, must match carousel)
      meshRef.current.rotation.y +=
        (targetRotation.current - meshRef.current.rotation.y) * 0.1;

      // Animate material
      if (meshRef.current.material) {
        const material = meshRef.current.material as MeshSineMaterial;

        // CONFIG: Wave animation speed (0.5 = slow, higher = faster waves)
        timeRef.current += 0.5 * delta;
        material.time.value = timeRef.current;

        // CONFIG: Texture scroll speed (delta / 4 = slow, delta / 2 = faster)
        if (material.map) {
          material.map.offset.x += delta / 4;
        }
      }
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      {/* CONFIG: Ribbon geometry [radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded] */}
      {/* 1.56 = radius to match carousel, 0.14 = ribbon thickness, 128 = smoothness */}
      <cylinderGeometry args={[2.5, 2.5, 0.35, 256, 50, true]} />
      <meshSineMaterial
        map={texture}
        map-anisotropy={16}
        map-repeat={[20, 1]} // CONFIG: [horizontal repeat, vertical repeat] for texture pattern
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}

// Main 3D Scene
export default function Scene({
  onHover,
  onHoverEnd,
  fov,
  isDark,
  carouselState,
}: {
  onHover: (data: Work) => void;
  onHoverEnd: () => void;
  fov: number;
  isDark: boolean;
  carouselState: React.MutableRefObject<CarouselState>;
}) {
  // CONFIG: Total number of images in the carousel
  const imageCount = IMAGE_COUNT;
  const { camera, size } = useThree();
  const hasAnimated = useRef(false);

  // Update camera FOV when prop changes
  useEffect(() => {
    if (camera && "fov" in camera) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  }, [fov, camera]);

  // Responsive camera adjustment
  useEffect(() => {
    const updateCamera = () => {
      // CONFIG: Responsive camera settings based on viewport width
      const baseDistance = 100;
      const scaleFactor = Math.min(size.width / 1920, 1); // Scale down for smaller screens

      if (hasAnimated.current) {
        camera.position.z = baseDistance / scaleFactor;
      }
    };

    updateCamera();
  }, [size.width, camera]);

  return (
    <>
      {/* CONFIG: Fog effect matching ribbon color #a79 */}
      <fog attach="fog" args={[isDark ? "#7a7977" : "#1c222f", 8.5, 12]} />

      {/* CONFIG: Carousel tilt [x, y, z] in radians (0.15 = slight tilt) */}
      <CarouselContainer
        rotation={[0, 0, 0.1]}
        count={imageCount}
        carouselState={carouselState}
      >
        <Carousel
          count={imageCount}
          onHover={onHover}
          onHoverEnd={onHoverEnd}
        />
      </CarouselContainer>
      {/* CONFIG: Ribbon position [x, y, z] - y should match carousel tilt for alignment */}
      <Ribbon
        position={[0, -0.1, 0]}
        count={imageCount}
        isDark={isDark}
        carouselState={carouselState}
      />
    </>
  );
}
