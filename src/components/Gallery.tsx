import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import gsap from "gsap";
import { cn } from "../utils";
import { useIsMobile } from "../hooks/useIsMobile";
import { VIDEO_SOURCES } from "../constants/HERO_GALLERY";

// ===== CONSTANTS =====
const ANIMATION_CONFIG = {
  DURATION: 0.5,
  EASE: "power2.out",
} as const;

const GALLERY_CONFIG = {
  ROTATION_INTERVAL: 5000,
  DEFAULT_ACTIVE_INDEX: 2,
  MOBILE_SPACING: 110,
  DESKTOP_SPACING: 150,
  OPACITY_THRESHOLD: 2,
  VISIBLE_RANGE: 0, // Changed from 1 to 0 to only play the center video
} as const;

// ===== TYPES =====
interface VideoItem {
  src: string;
  title: string;
}

interface GalleryProps {
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  playsInline?: boolean;
}

// ===== COMPONENT =====
const Gallery = ({
  className,
  autoPlay = false,
  muted = true,
  playsInline = true,
}: GalleryProps) => {
  const isMobile = useIsMobile();
  const galleryRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLUListElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(
    GALLERY_CONFIG.DEFAULT_ACTIVE_INDEX
  );
  const [userHasInteracted, setUserHasInteracted] = useState<boolean>(false);
  const [isInView, setIsInView] = useState<boolean>(false); // New state for intersection
  const interactionListenerRef = useRef<boolean>(false);

  // Generate unique gallery ID
  const galleryId = useMemo(
    () => `gallery-${Math.random().toString(36).substring(2, 9)}`,
    []
  );

  const videos = useMemo<VideoItem[]>(() => [...VIDEO_SOURCES], []);

  // Calculate scale based on distance from active item
  const getScale = useCallback((distance: number): number => {
    if (distance === 0) return 1;
    if (distance === 1 || distance === -1) return 0.75;
    return 0.5;
  }, []);

  // Calculate circular distance between items
  const getCircularDistance = useCallback(
    (index: number, activeIdx: number, total: number): number => {
      let distance = index - activeIdx;
      if (distance > total / 2) distance -= total;
      if (distance < -total / 2) distance += total;
      return distance;
    },
    []
  );

  // Setup global document interaction listener
  useEffect(() => {
    if (interactionListenerRef.current) return;

    const handleUserInteraction = (): void => {
      setUserHasInteracted(true);

      if (galleryRef.current) {
        const activeVideos =
          galleryRef.current.querySelectorAll<HTMLVideoElement>("video");
        activeVideos.forEach((video) => {
          if (video.paused) {
            video.play().catch(() => {
              // Video autoplay prevented - normal browser behavior
            });
          }
        });
      }

      // Cleanup listeners after first interaction
      events.forEach((event) =>
        document.removeEventListener(event, handleUserInteraction)
      );
    };

    const events: Array<keyof DocumentEventMap> = [
      "click",
      "touchstart",
      "keydown",
      "scroll",
    ];

    events.forEach((event) =>
      document.addEventListener(event, handleUserInteraction, { once: true })
    );

    interactionListenerRef.current = true;

    return () => {
      events.forEach((event) =>
        document.removeEventListener(event, handleUserInteraction)
      );
    };
  }, []);

  // Intersection Observer to pause/play based on visibility
  useEffect(() => {
    const element = galleryRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      {
        root: null, // viewport
        rootMargin: "0px",
        threshold: 0.1, // 10% visible
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Position cards and manage video playback
  const positionCards = useCallback(() => {
    const videoItems = cardsRef.current?.querySelectorAll<HTMLLIElement>("li");
    if (!videoItems) return;

    const totalItems = videoItems.length;
    const spacing = isMobile
      ? GALLERY_CONFIG.MOBILE_SPACING
      : GALLERY_CONFIG.DESKTOP_SPACING;

    videoItems.forEach((item, index) => {
      const distance = getCircularDistance(index, activeIndex, totalItems);
      const scale = getScale(distance);
      const opacity =
        Math.abs(distance) > GALLERY_CONFIG.OPACITY_THRESHOLD ? 0.5 : 1;

      // Animate card position
      gsap.to(item, {
        zIndex: 100 - Math.abs(distance),
        scale,
        x: distance * spacing,
        opacity,
        duration: ANIMATION_CONFIG.DURATION,
        ease: ANIMATION_CONFIG.EASE,
      });

      // Manage video playback
      const video = item.querySelector("video");
      if (video) {
        // STRICTER LOGIC: Only play if:
        // 1. Distance is 0 (center item)
        // 2. AutoPlay is enabled
        // 3. Component is in view
        // 4. User has interacted OR it's muted
        const shouldPlay =
          distance === 0 && // Only play center video
          autoPlay &&
          isInView && // Only play if gallery is visible
          (userHasInteracted || muted);

        if (shouldPlay && video.paused) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Auto-play was prevented
            });
          }
        } else if (!shouldPlay && !video.paused) {
          video.pause();
        }
      }
    });
  }, [
    activeIndex,
    autoPlay,
    muted,
    userHasInteracted,
    isInView, // Added dependency
    isMobile,
    getCircularDistance,
    getScale,
  ]);

  // Configure video attributes
  useEffect(() => {
    if (!galleryRef.current) return;

    const allVideos =
      galleryRef.current.querySelectorAll<HTMLVideoElement>("video");

    allVideos.forEach((video) => {
      video.muted = muted;
      video.playsInline = playsInline;
      video.preload = "none"; // Optimize loading
    });
  }, [muted, playsInline]);

  // Main gallery positioning and rotation logic
  useEffect(() => {
    positionCards();

    // Setup auto-rotation interval
    // Only rotate if autoPlay is true AND it is in view
    if (!autoPlay || !isInView) return;

    const cardInterval = window.setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % videos.length);
    }, GALLERY_CONFIG.ROTATION_INTERVAL);

    return () => clearInterval(cardInterval);
  }, [positionCards, autoPlay, isInView, videos.length]); // Added isInView dependency

  // Observe resize events
  useEffect(() => {
    if (!cardsRef.current) return;

    const resizeObserver = new ResizeObserver(positionCards);
    resizeObserver.observe(cardsRef.current);

    return () => resizeObserver.disconnect();
  }, [positionCards]);

  // Handle card click
  const handleCardClick = useCallback((index: number): void => {
    setActiveIndex(index);
  }, []);

  return (
    <div ref={galleryRef} className={className} id={galleryId}>
      <ul
        ref={cardsRef}
        className="cards relative w-full h-full flex !justify-center !items-center"
      >
        {videos.map(({ src, title }, index) => (
          <li
            key={`${galleryId}-video-${index}`}
            className={cn(
              "list-none p-0 m-0 w-28 h-16 md:w-40 md:h-24 absolute flex items-center justify-center squircle rounded-2xl overflow-hidden cursor-pointer transition-shadow duration-300",
              index === activeIndex &&
                "dark:shadow-[0_0_50px_rgba(0,0,0,0.9)] shadow-[0_0_15px_rgba(0,0,0,0.2)]"
            )}
            onClick={() => handleCardClick(index)}
            aria-label={`${title} - Video ${index + 1}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleCardClick(index);
              }
            }}
          >
            <video
              loop
              muted={muted}
              playsInline={playsInline}
              className="video-marquee w-full h-full object-cover pointer-events-none select-none"
              src={src}
              title={title}
              aria-hidden="true"
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Gallery;
