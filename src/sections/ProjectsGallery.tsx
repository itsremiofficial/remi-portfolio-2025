/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, extend, useThree } from "@react-three/fiber";
import { Image, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { damp3, damp } from "maath/easing";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import MagneticButton from "../components/MagneticButton";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

// Project Data Type
interface ProjectData {
  id: number;
  title: string;
  category: string;
  techStack: string[];
  imageUrl: string;
  projectLink: string;
}

// CONFIG: Project data for each card
const projectsData: ProjectData[] = [
  {
    id: 1,
    title: "Project Alpha",
    category: "Web Application",
    techStack: ["React", "TypeScript", "Three.js"],
    imageUrl: "/flip/img1.png",
    projectLink: "/projects/alpha",
  },
  {
    id: 2,
    title: "Project Beta",
    category: "Mobile App",
    techStack: ["React Native", "Node.js", "MongoDB"],
    imageUrl: "/flip/img2.png",
    projectLink: "/projects/beta",
  },
  {
    id: 3,
    title: "Project Gamma",
    category: "E-Commerce",
    techStack: ["Next.js", "Tailwind", "Stripe"],
    imageUrl: "/flip/img3.png",
    projectLink: "/projects/gamma",
  },
  {
    id: 4,
    title: "Project Delta",
    category: "Dashboard",
    techStack: ["Vue.js", "D3.js", "Firebase"],
    imageUrl: "/flip/img4.png",
    projectLink: "/projects/delta",
  },
  {
    id: 5,
    title: "Project Epsilon",
    category: "Portfolio",
    techStack: ["Gatsby", "GraphQL", "Netlify"],
    imageUrl: "/flip/img5.png",
    projectLink: "/projects/epsilon",
  },
  {
    id: 6,
    title: "Project Zeta",
    category: "Social Platform",
    techStack: ["React", "WebSocket", "PostgreSQL"],
    imageUrl: "/flip/img6.png",
    projectLink: "/projects/zeta",
  },
  {
    id: 7,
    title: "Project Eta",
    category: "Game",
    techStack: ["Unity", "C#", "Photon"],
    imageUrl: "/flip/img7.png",
    projectLink: "/projects/eta",
  },
  {
    id: 8,
    title: "Project Theta",
    category: "AI Tool",
    techStack: ["Python", "TensorFlow", "Flask"],
    imageUrl: "/flip/img8.png",
    projectLink: "/projects/theta",
  },
];

// Global scroll progress and drag rotation trackers
let scrollProgress = 0;
let dragRotation = 0;
let isDragging = false;
let autoRotation = 0;
// CONFIG: Auto-rotation direction (1 = clockwise, -1 = counter-clockwise)
let autoRotationDirection = 1;

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
      // Wave amplitude: divided by higher number = less wavy (currently /12.0)
      // Wave frequency: PI * higher number = more waves (currently * 4.0)
      `vec3 transformed = vec3(position.x, position.y + sin(time + uv.x * PI * 4.0) / 12.0, position.z);`
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
      // Auto-rotation when not dragging
      if (!isDragging) {
        // CONFIG: Auto-rotation speed (higher = faster, currently 0.1)
        // Direction is controlled by autoRotationDirection (1 or -1)
        autoRotation += delta * 0.1 * autoRotationDirection;
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

// Create squircle alpha map texture for rounded corners
const createSquircleAlphaMap = () => {
  const canvas = document.createElement("canvas");
  const size = 512;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    // Draw squircle shape with rounded corners
    const radius = size * 0.15; // CONFIG: 15% radius for squircle effect (higher = more rounded)
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, radius);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

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
  projectData: ProjectData;
  onHover: (data: ProjectData) => void;
  onHoverEnd: () => void;
}) {
  const ref = useRef<any>(null);
  const [hovered, setHovered] = useState(false);
  const alphaMap = useRef(createSquircleAlphaMap());

  useFrame((state, delta) => {
    if (ref.current) {
      // CONFIG: Hover scale (1.15 = 15% larger when hovered)
      damp3(ref.current.scale, hovered ? 1.1 : 1, 0.1, delta);

      // CONFIG: Card curvature (0.25 = more curved, 0.1 = flatter)
      damp(ref.current.material, "radius", hovered ? 0.2 : 0.1, 0.2, delta);

      // CONFIG: Image zoom level (0.75 = zoomed in, 0.85 = normal)
      damp(ref.current.material, "zoom", hovered ? 0.75 : 0.85, 0.2, delta);
    }
  });

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setHovered(true);
    onHover(projectData);
    // Change cursor to pointer
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    setHovered(false);
    onHoverEnd();
    // Reset cursor
    document.body.style.cursor = "auto";
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    // Navigate to project link
    window.location.href = projectData.projectLink;
  };

  return (
    <Image
      ref={ref}
      url={url}
      transparent
      side={THREE.DoubleSide}
      position={position}
      rotation={rotation}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      material-alphaMap={alphaMap.current}
      material-alphaTest={0.1}
    >
      {/* CONFIG: Card geometry [curvature, width, height, widthSegments, heightSegments] */}
      <bentPlaneGeometry args={[0.1, 1, 0.8, 20, 20]} />
    </Image>
  );
}

// Carousel of Images
function Carousel({
  radius = 1.4, // CONFIG: Carousel radius (higher = wider circle)
  count = 8, // CONFIG: Number of images in carousel
  onHover,
  onHoverEnd,
}: {
  radius?: number;
  count?: number;
  onHover: (data: ProjectData) => void;
  onHoverEnd: () => void;
}) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const projectData = projectsData[i % projectsData.length];
        return (
          <ProjectCard
            key={i}
            url={projectData.imageUrl}
            position={[
              Math.sin((i / count) * Math.PI * 2) * radius,
              0,
              Math.cos((i / count) * Math.PI * 2) * radius,
            ]}
            rotation={[0, Math.PI + (i / count) * Math.PI * 2, 0]}
            projectData={projectData}
            onHover={onHover}
            onHoverEnd={onHoverEnd}
          />
        );
      })}
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
  const texture = useTexture("/remi_ribbon.svg");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  useFrame((_state, delta) => {
    if (meshRef.current) {
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
      <cylinderGeometry args={[1.6, 1.6, 0.15, 360, 16, true]} />
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
function Scene({
  onHover,
  onHoverEnd,
  isInView,
  fov,
}: {
  onHover: (data: ProjectData) => void;
  onHoverEnd: () => void;
  isInView: boolean;
  fov: number;
}) {
  // CONFIG: Total number of images in the carousel
  const imageCount = 8;
  const { camera, size } = useThree();
  const hasAnimated = useRef(false);

  // Update camera FOV when prop changes
  useEffect(() => {
    if (camera && "fov" in camera) {
      camera.fov = fov;
      camera.updateProjectionMatrix(); // IMPORTANT: Must update projection matrix after changing FOV
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

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;

      // CONFIG: Zoom-in animation settings
      // Calculate responsive zoom distances
      const scaleFactor = Math.min(size.width / 1920, 1);
      const initialZ = 150 / scaleFactor;
      const finalZ = 100 / scaleFactor;

      // Initial camera position (zoomed out)
      gsap.set(camera.position, { z: initialZ });

      // Animate to final position (zoomed in)
      gsap.to(camera.position, {
        z: finalZ, // Final zoom level (responsive)
        duration: 1, // Animation duration in seconds
        ease: "power2.out", // Smooth easing
      });
    }
  }, [isInView, camera, size.width]);

  return (
    <>
      {/* CONFIG: Carousel tilt [x, y, z] in radians (0.15 = slight tilt) */}
      <CarouselContainer rotation={[0, 0, 0.15]} count={imageCount}>
        <Carousel
          count={imageCount}
          onHover={onHover}
          onHoverEnd={onHoverEnd}
        />
      </CarouselContainer>
      {/* CONFIG: Ribbon position [x, y, z] - y should match carousel tilt for alignment */}
      <Ribbon position={[0, -0.15, 0]} count={imageCount} />
    </>
  );
}

// Main Component
const ProjectsGallery = () => {
  const projectsSectionRef = useRef<HTMLElement>(null);
  const dragStartX = useRef(0);
  const dragStartRotation = useRef(0);
  const lastMouseX = useRef(0);
  const currentMouseX = useRef(0);
  const currentMouseY = useRef(0);

  // Hover state for floating panel
  const [hoveredProject, setHoveredProject] = useState<ProjectData | null>(
    null
  );
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelSide, setPanelSide] = useState<"left" | "right">("right");
  const [isActive, setIsActive] = useState(false);

  // Section visibility state for zoom animation
  const [isInView, setIsInView] = useState(false);

  // Responsive FOV state
  const [fov, setFov] = useState(15);

  // GSAP quickTo for smooth mouse following
  const quickX = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const quickY = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  // Update FOV based on viewport width
  useEffect(() => {
    const updateFov = () => {
      const width = window.innerWidth;

      // CONFIG: Responsive FOV values
      // Desktop (1920px+): FOV 15 (narrow/zoomed)
      // Tablet (768px-1920px): FOV 20-30
      // Mobile (<768px): FOV 35-45 (wider for better visibility)
      let newFov = 15;

      if (width < 768) {
        // Mobile: wider FOV
        newFov = 45;
      } else if (width < 1024) {
        // Small tablet
        newFov = 35;
      } else if (width < 1440) {
        // Large tablet
        newFov = 25;
      } else if (width < 1920) {
        // Small desktop
        newFov = 20;
      } else {
        // Large desktop
        newFov = 12.5;
      }

      setFov(newFov);
    };

    updateFov();
    window.addEventListener("resize", updateFov);

    return () => {
      window.removeEventListener("resize", updateFov);
    };
  }, []);

  // Intersection Observer to detect when section is in view
  useEffect(() => {
    const section = projectsSectionRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
        }
      },
      {
        // CONFIG: Trigger when section's top edge meets the bottom of viewport
        // rootMargin: 0px = no offset, triggers at natural viewport boundary
        // threshold: 0 = trigger as soon as section starts entering viewport
        rootMargin: "0px 0px 0px 0px",
        threshold: 0,
      }
    );

    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, [isInView]);

  useEffect(() => {
    const handleScroll = () => {
      if (!projectsSectionRef.current) return;

      const section = projectsSectionRef.current;
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

  // Initialize GSAP quickTo on mount
  useEffect(() => {
    const panel = panelRef.current;

    if (panel) {
      // Set initial position off-screen
      gsap.set(panel, { x: 0, y: 0 });

      // CONFIG: Animation duration and easing for smooth following
      quickX.current = gsap.quickTo(panel, "x", {
        duration: 0.8, // Slower = more lazy/smooth
        ease: "power3.out",
      });
      quickY.current = gsap.quickTo(panel, "y", {
        duration: 0.8,
        ease: "power3.out",
      });
    }
  }, []);

  // Set initial position when hovering starts
  useEffect(() => {
    if (isActive && panelRef.current && quickX.current && quickY.current) {
      // Immediately position at current mouse location
      quickX.current(currentMouseX.current);
      quickY.current(currentMouseY.current);

      // Calculate initial side
      const screenWidth = window.innerWidth;
      const spaceOnRight = screenWidth - currentMouseX.current;
      const spaceOnLeft = currentMouseX.current;
      const panelWidth = 350;
      const padding = 40;

      if (spaceOnRight >= panelWidth + padding) {
        setPanelSide("right");
      } else if (spaceOnLeft >= panelWidth + padding) {
        setPanelSide("left");
      } else {
        setPanelSide(spaceOnRight > spaceOnLeft ? "right" : "left");
      }
    }
  }, [isActive]);

  const handleProjectHover = (data: ProjectData) => {
    setHoveredProject(data);
    setIsActive(true);
  };

  const handleProjectHoverEnd = () => {
    setHoveredProject(null);
    setIsActive(false);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging = true;
    dragStartX.current = e.clientX;
    lastMouseX.current = e.clientX;
    dragStartRotation.current = dragRotation;
    (e.target as HTMLCanvasElement).style.cursor = "grabbing";
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    // Store current mouse position
    currentMouseX.current = e.clientX;
    currentMouseY.current = e.clientY;

    const deltaX = e.clientX - lastMouseX.current;

    // Update auto-rotation direction based on movement direction
    if (Math.abs(deltaX) > 0.5) {
      // Small threshold to avoid jitter
      // Positive deltaX = moving right, negative = moving left
      // For carousel: right movement = clockwise (positive), left = counter-clockwise (negative)
      autoRotationDirection = deltaX > 0 ? 1 : -1;
    }

    if (isDragging) {
      const totalDeltaX = e.clientX - dragStartX.current;
      // CONFIG: Drag sensitivity (Math.PI * 2 = full rotation per screen width)
      // Increase multiplier for more sensitivity (e.g., * 3 for faster rotation)
      dragRotation =
        dragStartRotation.current +
        (totalDeltaX / window.innerWidth) * Math.PI * 2;
    }

    // Update panel position with GSAP smooth animation
    if (isActive && quickX.current && quickY.current) {
      quickX.current(e.clientX);
      quickY.current(e.clientY);

      // Calculate which side has more space
      const screenWidth = window.innerWidth;
      const spaceOnRight = screenWidth - e.clientX;
      const spaceOnLeft = e.clientX;

      // CONFIG: Panel width estimate (should match the actual panel width)
      const panelWidth = 350; // Approximate width of the panel
      const padding = 40; // Extra padding for safety

      // Choose side based on available space
      if (spaceOnRight >= panelWidth + padding) {
        setPanelSide("right");
      } else if (spaceOnLeft >= panelWidth + padding) {
        setPanelSide("left");
      } else {
        // If neither side has enough space, choose the side with more space
        setPanelSide(spaceOnRight > spaceOnLeft ? "right" : "left");
      }
    }

    lastMouseX.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging = false;
    (e.target as HTMLCanvasElement).style.cursor = "grab";
  };

  const handlePointerLeave = (e: React.PointerEvent) => {
    if (isDragging) {
      isDragging = false;
      (e.target as HTMLCanvasElement).style.cursor = "grab";
    }
  };

  // Refs for Projects Gallery header animation
  const projectsSelectedHeadingRef = useRef<HTMLHeadingElement>(null);
  const projectsGalleryHeadingRef = useRef<HTMLHeadingElement>(null);
  const projectsSecondaryContainerRef = useRef<HTMLDivElement>(null);
  const projectsHeaderContainerRef = useRef<HTMLDivElement>(null);
  const projectsDescRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const selected = projectsSelectedHeadingRef.current;
      const gallery = projectsGalleryHeadingRef.current;
      const secondary = projectsSecondaryContainerRef.current;
      const projectsDesc = projectsDescRef.current;
      const wrapper = projectsHeaderContainerRef.current;

      if (!wrapper || !selected || !gallery || !secondary || !projectsDesc)
        return;

      const mm = gsap.matchMedia();
      const targets = [selected, gallery, projectsDesc, secondary];

      // Reduced motion - static display
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(targets, {
          autoAlpha: 1,
          xPercent: 0,
          yPercent: 0,
          rotationX: 0,
          clearProps: "transform",
        });
      });

      // Full motion - animated
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Add performance hint
        targets.forEach((el) => el.classList.add("will-change-transform"));

        const tl = gsap
          .timeline({
            scrollTrigger: {
              trigger: wrapper,
              start: "top 80%",
              end: "top 10%",
              scrub: 0.6,
            },
            defaults: { ease: "power1.inOut" },
            onComplete: () => {
              targets.forEach((el) =>
                el.classList.remove("will-change-transform")
              );
            },
          })
          .fromTo(
            targets,
            {
              autoAlpha: 0,
              xPercent: 6,
              yPercent: 6,
              filter: "blur(10px)",
              rotationX: -45,
              transformPerspective: 1000,
            },
            {
              autoAlpha: 1,
              xPercent: 0,
              yPercent: 0,
              rotationX: 0,
              filter: "blur(0px)",
              duration: 1,
              stagger: 0.8,
            }
          );

        return () => tl.kill();
      });

      return () => mm.revert();
    },
    { scope: projectsHeaderContainerRef }
  );

  return (
    <section
      id="projects-gallery"
      ref={projectsSectionRef}
      className="relative w-full overflow-visible"
      aria-label="Projects Gallery"
    >
      <div ref={projectsHeaderContainerRef} className="px-4 md:px-6">
        <h2
          ref={projectsSelectedHeadingRef}
          className="section-heading text-foreground dark:text-background pt-2"
          style={{ transformStyle: "preserve-3d" }}
        >
          Selected
        </h2>
        <div className="inline-flex items-start md:items-end flex-col md:flex-row gap-[2vw]">
          <h2
            ref={projectsGalleryHeadingRef}
            className="section-heading text-accent pt-2"
            style={{ transformStyle: "preserve-3d" }}
          >
            Works
          </h2>
          <div
            className="space-y-[1vw] lg:pb-3 grid grid-cols-2 md:block"
            style={{ transformStyle: "preserve-3d" }}
          >
            <p
              ref={projectsDescRef}
              className="sm:max-w-[40ch] text-[clamp(0.9rem,1.5vw,1.35rem)] dark:text-background/70 text-foreground/70 font-robo leading-snug"
            >
              Step inside my projects—where <br className="hidden sm:block" />{" "}
              brands rise above the ordinary.
            </p>

            <div
              ref={projectsSecondaryContainerRef}
              className="place-self-end md:justify-self-auto"
            >
              <MagneticButton
                className="hidden md:inline-flex dark:bg-background bg-foreground cursor-pointer h-max py-[1.2vw] px-[4vw] group rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent/60 transition-colors"
                fillClassName="bg-accent"
                dataStrength={2.5}
                dataStrengthText={30}
                aria-label="Explore all works"
                href="/works"
              >
                <span className="inline-flex items-center gap-2 font-bold uppercase text-sm lg:text-lg font-robo leading-none dark:text-foreground text-background group-hover:text-background dark:group-hover:text-background transition-colors duration-800 whitespace-nowrap">
                  Explore All
                </span>
              </MagneticButton>
              <a
                href="#all-works"
                className="md:hidden inline-block py-2.5 px-6 bg-accent rounded-full font-bold uppercase text-sm font-robo leading-none text-background hover:text-background dark:hover:text-foreground transition-colors duration-500 whitespace-nowrap"
                aria-label="Explore all works"
              >
                Explore All
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="top-0 left-0 w-full z-10 h-[calc(100vh-200px)] min-h-[600px]">
        <Canvas
          // CONFIG: Camera settings
          // position: [x, y, z] - z distance affects zoom (100 = far, lower = closer)
          // fov: Field of view in degrees (responsive: 15-45 based on viewport width)
          camera={{ position: [0, 0, 100], fov: fov }}
          gl={{
            antialias: true, // CONFIG: Smooth edges (true = better quality, slower)
            alpha: true,
            premultipliedAlpha: false,
          }}
          style={{
            background: "transparent",
            width: "100%",
            height: "100%",
            cursor: "grab",
          }}
          dpr={[1, 2]} // CONFIG: Device pixel ratio [min, max] for performance/quality balance
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
        >
          <Scene
            onHover={handleProjectHover}
            onHoverEnd={handleProjectHoverEnd}
            isInView={isInView}
            fov={fov}
          />
        </Canvas>

        {/* Floating Project Info Panel - Lazily follows mouse with GSAP */}
        <div
          ref={panelRef}
          className="fixed pointer-events-none z-20 will-change-transform"
          style={{
            left: 0,
            top: 0,
          }}
        >
          <div
            className={`transition-all duration-300 ease-out ${
              isActive ? "scale-100 opacity-100" : "scale-75 opacity-0"
            }`}
            style={{
              // CONFIG: Panel offset distance from cursor (20px)
              transform:
                panelSide === "right"
                  ? "translate(75px, -50%)" // Position to the right
                  : "translate(-100%, -50%) translate(-75px, 0)", // Position to the left
            }}
          >
            {hoveredProject && (
              <div
                className={`bg-black/90 backdrop-blur-md text-white p-6 squircle rounded-3xl shadow-2xl border border-white/10 min-w-[300px] max-w-[400px] ${
                  panelSide === "left" ? "origin-right" : "origin-left"
                }`}
              >
                {/* Project Title */}
                <h3 className="text-2xl font-bold mb-2 text-white">
                  {hoveredProject.title}
                </h3>

                {/* Category */}
                <p className="text-sm text-gray-400 mb-4 uppercase tracking-wider">
                  {hoveredProject.category}
                </p>

                {/* Tech Stack */}
                <div>
                  <p className="text-xs text-gray-500 mb-2 uppercase font-semibold">
                    Tech Stack
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {hoveredProject.techStack.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-white/90 border border-white/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Click hint */}
                <p className="text-xs text-gray-500 mt-4 text-center italic">
                  Click card to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsGallery;
