import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { cn } from "../utils";
import { useIsMobile } from "../hooks/useIsMobile";

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

const Gallery: React.FC<GalleryProps> = ({
  className,
  autoPlay = false,
  muted = true,
  playsInline = true,
}) => {
  const isMobile = useIsMobile();
  const galleryRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLUListElement>(null);
  const [activeIndex, setActiveIndex] = useState(2);
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const interactionListenerRef = useRef<boolean>(false);

  // Create unique ID for this gallery instance
  const galleryId = useRef(
    `gallery-${Math.random().toString(36).substring(2, 9)}`
  );

  const videos: VideoItem[] = [
    {
      src: "videos/video01.mp4",
      title: "Video 1",
    },
    {
      src: "videos/video02.mp4",
      title: "Video 2",
    },
    {
      src: "videos/video03.mp4",
      title: "Video 3",
    },
    {
      src: "videos/video01.mp4",
      title: "Video 1",
    },
    {
      src: "videos/video02.mp4",
      title: "Video 2",
    },
    {
      src: "videos/video03.mp4",
      title: "Video 3",
    },
  ];

  // Set up global document interaction listener (once)
  useEffect(() => {
    if (interactionListenerRef.current) return;

    const handleUserInteraction = () => {
      setUserHasInteracted(true);

      // Attempt to play videos now that user has interacted
      if (galleryRef.current) {
        // Scope query to this gallery instance
        const activeVideos = galleryRef.current.querySelectorAll("video");
        activeVideos.forEach((video) => {
          if (video.paused) {
            video.play().catch(() => {
              console.log("Still couldn't autoplay video after interaction");
            });
          }
        });
      }

      // Clean up listeners after successful interaction
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
      document.removeEventListener("scroll", handleUserInteraction);
    };

    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("touchstart", handleUserInteraction);
    document.addEventListener("keydown", handleUserInteraction);
    document.addEventListener("scroll", handleUserInteraction);

    interactionListenerRef.current = true;

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
      document.removeEventListener("scroll", handleUserInteraction);
    };
  }, []);

  // Main gallery positioning and video playback logic
  useEffect(() => {
    if (!galleryRef.current || !cardsRef.current) return;

    // Configure all videos with required attributes for maximum compatibility
    const allVideos = galleryRef.current.querySelectorAll("video");
    allVideos.forEach((video) => {
      // Always mute videos for autoplay compatibility
      video.muted = muted;

      // Add playsinline attribute (especially needed for iOS)
      video.setAttribute("playsinline", "");

      // Set preload attribute to improve playback readiness
      video.setAttribute("preload", "auto");
    });

    // Function to position all cards and manage video playback
    const positionCards = () => {
      // IMPORTANT: Scope to this gallery instance's cards only
      const videoItems = cardsRef.current?.querySelectorAll("li");
      if (!videoItems) return;

      const totalItems = videoItems.length;

      // Position each video based on its distance from active video
      videoItems.forEach((item, index) => {
        // Calculate distance from active item (handle wrapping)
        let distance = index - activeIndex;

        // Adjust for wrapping (to make it circular)
        if (distance > totalItems / 2) distance -= totalItems;
        if (distance < -totalItems / 2) distance += totalItems;

        // Apply transform based on distance - scopped to this item only
        gsap.to(item, {
          zIndex: 100 - Math.abs(distance),
          scale:
            distance === 0 ? 1 : distance === 1 || distance === -1 ? 0.75 : 0.5,
          x: distance * (isMobile ? 110 : 150), // Adjust spacing between videos
          opacity: Math.abs(distance) > 2 ? 0.5 : 1,
          duration: 0.5,
          ease: "power2.out",
        });

        // Adjust video playback - only play the active and adjacent videos if autoPlay is enabled
        const video = item.querySelector("video") as HTMLVideoElement;
        if (video) {
          // Only try to play videos if autoPlay is true AND either:
          // 1. The user has interacted with the page, OR
          // 2. The video is muted (browsers allow muted autoplay)
          const shouldPlay =
            Math.abs(distance) <= 1 && autoPlay && (userHasInteracted || muted);

          if (shouldPlay) {
            // Use play() with proper error handling
            if (video.paused) {
              video.play().catch((error) => {
                console.log("Video play prevented:", error);
              });
            }
          } else {
            video.pause();
          }
        }
      });
    };

    // Initial positioning
    positionCards();

    // Set up interval to rotate videos only if autoPlay is enabled
    let cardInterval: number | undefined;
    if (autoPlay) {
      cardInterval = window.setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % videos.length);
      }, 5000); // Longer interval for videos
    }

    // Use ResizeObserver instead of MutationObserver for better performance
    const resizeObserver = new ResizeObserver(() => {
      positionCards();
    });

    if (cardsRef.current) {
      resizeObserver.observe(cardsRef.current);
    }

    // Clean up
    return () => {
      if (cardInterval) {
        clearInterval(cardInterval);
      }
      resizeObserver.disconnect();
    };
  }, [
    activeIndex,
    videos.length,
    autoPlay,
    muted,
    playsInline,
    userHasInteracted,
    isMobile, // added to satisfy react-hooks/exhaustive-deps
  ]);

  // Add click handler to make cards interactive
  const handleCardClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div ref={galleryRef} className={className} id={galleryId.current}>
      <ul
        ref={cardsRef}
        className="cards relative w-full h-full flex !justify-center !items-center"
      >
        {videos.map(({ src, title }, index) => (
          <li
            key={index}
            className={cn(
              "list-none p-0 m-0 w-28 h-16 md:w-40 md:h-24 absolute flex items-center justify-center rounded-xl md:rounded-2xl overflow-hidden cursor-pointer",
              index === activeIndex
                ? "dark:shadow-[0_0_50px_rgba(0,0,0,0.9)] shadow-[0_0_15px_rgba(0,0,0,0.2)]"
                : ""
            )}
            onClick={() => handleCardClick(index)}
          >
            <video
              loop
              muted={true}
              playsInline={true}
              className="video-marquee w-full h-full object-cover pointer-events-none select-none"
              src={src}
              title={title}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Gallery;
