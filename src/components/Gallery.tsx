import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { cn } from "../utils";

interface VideoItem {
  src: string;
  title: string;
}

const Gallery: React.FC<{ className?: string }> = ({ className }) => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLUListElement>(null);
  const [activeIndex, setActiveIndex] = useState(2); // Start with middle video active

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

  useEffect(() => {
    if (!galleryRef.current) return;

    // Function to position all cards based on active index
    const positionCards = () => {
      // Get all video elements
      const videoItems = document.querySelectorAll(".cards li");
      const totalItems = videoItems.length;

      // Position each video based on its distance from active video
      videoItems.forEach((item, index) => {
        // Calculate distance from active item (handle wrapping)
        let distance = index - activeIndex;

        // Adjust for wrapping (to make it circular)
        if (distance > totalItems / 2) distance -= totalItems;
        if (distance < -totalItems / 2) distance += totalItems;

        // Apply transform based on distance
        gsap.to(item, {
          zIndex: 100 - Math.abs(distance),
          scale:
            distance === 0 ? 1 : distance === 1 || distance === -1 ? 0.75 : 0.5,
          x: distance * 160, // Adjust spacing between videos
          opacity: Math.abs(distance) > 2 ? 0.5 : 1,
          duration: 0.5,
          ease: "power2.out",
        });

        // Adjust video playback - only play the active and adjacent videos
        const video = item.querySelector("video");
        if (video) {
          if (Math.abs(distance) <= 1) {
            video
              .play()
              .catch((error) => console.log("Video play prevented:", error));
          } else {
            video.pause();
          }
        }
      });
    };

    // Initial positioning
    positionCards();

    // Set up interval to rotate videos
    const cardInterval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % videos.length);
    }, 5000); // Longer interval for videos

    // Update card positions when activeIndex changes
    const observer = new MutationObserver(() => {
      positionCards();
    });

    observer.observe(cardsRef.current!, { attributes: true, childList: true });

    // Clean up
    return () => {
      clearInterval(cardInterval);
      observer.disconnect();
    };
  }, [activeIndex, videos.length]);

  // When active index changes, reposition cards
  useEffect(() => {
    // Get all card elements
    const cards = document.querySelectorAll(".cards li");
    const totalCards = cards.length;

    // Position each card based on its distance from active card
    cards.forEach((card, index) => {
      // Calculate distance from active card (handle wrapping)
      let distance = index - activeIndex;

      // Adjust for wrapping (to make it circular)
      if (distance > totalCards / 2) distance -= totalCards;
      if (distance < -totalCards / 2) distance += totalCards;

      // Apply transform based on distance
      gsap.to(card, {
        zIndex: 100 - Math.abs(distance),
        scale:
          distance === 0 ? 1 : distance === 1 || distance === -1 ? 0.75 : 0.5,
        x: distance * 160, // Adjust spacing between cards
        opacity: Math.abs(distance) > 2 ? 0.5 : 1,
        duration: 0.5,
        ease: "power2.out",
      });
    });
  }, [activeIndex]);

  return (
    <div ref={galleryRef} className={className}>
      <ul
        ref={cardsRef}
        className="cards relative w-full h-full flex !justify-center !items-center"
      >
        {videos.map(({ src, title }, index) => (
          <li
            key={index}
            className={cn(
              "list-none p-0 m-0 w-40 h-24 absolute flex items-center justify-center rounded-2xl overflow-hidden",
              index === activeIndex
                ? "shadow-[0_30px_50px_rgba(0,0,0,0.9)]"
                : ""
            )}
          >
            <video
              loop
              autoPlay
              muted
              playsInline
              className="video-marquee w-full h-full object-cover"
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
