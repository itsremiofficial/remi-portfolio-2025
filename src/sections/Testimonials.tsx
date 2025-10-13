import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import IconArrowRight from "../components/icons/ArrowRight";
import MagneticButtonCircular from "../components/MagneticButtonCircular";

gsap.registerPlugin(ScrollTrigger);

interface Testimonial {
  quote: string;
  name: string;
  designation: string;
  src: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Jack Moss",
    designation: "CEO Zonow Network",
    quote:
      "I have worked with Remi for multiple years. His designs are amazing and high detailed, with the fastest turnaround time I have seen. As for his websites, they are extremely well made and astonishingly fast. Zero corners are cut and he goes above and beyond to make my requests with 100% perfection.",
    src: "https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?q=80&w=1368&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Murtaza Memon",
    designation: "Managing Director Fronus",
    quote:
      "This place exceeded all expectations! The atmosphere is inviting, and the staff truly goes above and beyond to ensure a fantastic visit. I'll definitely keep returning for more exceptional dining experience.",
    src: "https://images.unsplash.com/photo-1628749528992-f5702133b686?q=80&w=1368&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Christopher P.",
    designation: "Satisfied Customer",
    quote:
      "Shining Yam is a hidden gem! From the moment I walked in, I knew I was in for a treat. The impeccable service and overall attention to detail created a memorable experience. I highly recommend it!",
    src: "https://images.unsplash.com/photo-1524267213992-b76e8577d046?q=80&w=1368&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "David Chen",
    designation: "Product Manager at TechCorp",
    quote:
      "An absolutely outstanding experience from start to finish! The quality of service and attention to detail is unmatched. Every interaction felt personalized and genuine. This is what excellence looks like!",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1368&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Sarah Williams",
    designation: "Creative Director at DesignHub",
    quote:
      "Working with this team has been transformative for our business. Their innovative approach and dedication to delivering results is truly remarkable. I couldn't be happier with the outcome!",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1368&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

// Memoize calculate gap function outside component to avoid recreation
const calculateGap = (width: number): number => {
  const minWidth = 1024;
  const maxWidth = 1456;
  const minGap = 60;
  const maxGap = 86;

  if (width <= minWidth) return minGap;
  if (width >= maxWidth)
    return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));

  return (
    minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth))
  );
};

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const designationRef = useRef<HTMLParagraphElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const autoplayIntervalRef = useRef<number | null>(null);
  const imageElementsRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const isAnimatingRef = useRef(false);
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasAnimatedIn = useRef(false);

  // Preload all images on mount for better performance
  useEffect(() => {
    const preloadImages = testimonials.map((testimonial) => {
      const img = new Image();
      img.src = testimonial.src;
      return img;
    });

    return () => {
      preloadImages.forEach((img) => {
        img.src = "";
      });
    };
  }, []);

  // Memoize word animation to prevent recreation
  const animateWords = useCallback(() => {
    const wordElements = document.querySelectorAll(".word");
    if (wordElements.length === 0) return;

    gsap.fromTo(
      wordElements,
      {
        opacity: 0,
        y: 10,
        filter: "blur(8px)",
      },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        stagger: 0.015,
        duration: 0.4,
        ease: "power2.out",
      }
    );
  }, []);

  // Memoize split words to avoid recalculation
  const splitQuotes = useMemo(
    () =>
      testimonials.map((t) =>
        t.quote
          .split(" ")
          .map((word) => `<span class="word">${word}</span>`)
          .join(" ")
      ),
    []
  );

  const updateTestimonial = useCallback(
    (direction: number) => {
      if (isAnimatingRef.current) return; // Prevent overlapping animations

      const imageContainer = imageContainerRef.current;
      const nameElement = nameRef.current;
      const designationElement = designationRef.current;
      const quoteElement = quoteRef.current;

      if (
        !imageContainer ||
        !nameElement ||
        !designationElement ||
        !quoteElement
      )
        return;

      isAnimatingRef.current = true;

      const newIndex =
        (activeIndex + direction + testimonials.length) % testimonials.length;

      const containerWidth = imageContainer.offsetWidth;
      const gap = calculateGap(containerWidth);
      const maxStickUp = gap * 0.8;

      // Use cached image elements instead of querying DOM repeatedly
      testimonials.forEach((testimonial, index) => {
        let img = imageElementsRef.current.get(index);

        if (!img) {
          img = document.createElement("img");
          img.src = testimonial.src;
          img.alt = testimonial.name;
          img.classList.add("testimonial-image");
          img.dataset.index = String(index);
          img.loading = "eager"; // Prioritize loading
          imageContainer.appendChild(img);
          imageElementsRef.current.set(index, img);
        }

        const offset =
          (index - newIndex + testimonials.length) % testimonials.length;

        // Calculate z-index to ensure proper stacking
        let zIndex: number;
        if (offset === 0) {
          zIndex = 10; // Active card on top
        } else if (offset === 1 || offset === 4) {
          zIndex = 5; // First cards on each side
        } else {
          zIndex = 3; // Second cards on each side (furthest back)
        }

        const opacity = 1;
        const scale = index === newIndex ? 1 : 0.85;
        const blur = index === newIndex ? 0 : 4;
        const shadow =
          index === newIndex
            ? "drop-shadow(0px 25px 30px rgba(0, 0, 0, 0.35)) drop-shadow(0px 10px 15px rgba(0, 0, 0, 0.25))"
            : "drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.2))";

        let translateX: string, translateY: string, rotateY: number;

        if (offset === 0) {
          // Active card - centered
          translateX = "0%";
          translateY = "0%";
          rotateY = 0;
        } else if (offset === 1) {
          // First card to the right
          const imgHeight = img.offsetHeight || 320;
          translateX = "30%";
          translateY = `-${(maxStickUp / imgHeight) * 100}%`;
          rotateY = -35;
        } else if (offset === 2) {
          // Second card to the right
          const imgHeight = img.offsetHeight || 320;
          translateX = "50%";
          translateY = `-${((maxStickUp * 1.5) / imgHeight) * 100}%`;
          rotateY = -45;
        } else if (offset === 3) {
          // Second card to the left
          const imgHeight = img.offsetHeight || 320;
          translateX = "-50%";
          translateY = `-${((maxStickUp * 1.5) / imgHeight) * 100}%`;
          rotateY = 45;
        } else if (offset === 4) {
          // First card to the left
          const imgHeight = img.offsetHeight || 320;
          translateX = "-30%";
          translateY = `-${(maxStickUp / imgHeight) * 100}%`;
          rotateY = 35;
        } else {
          // Fallback for any other positions
          const imgHeight = img.offsetHeight || 320;
          translateX = "-30%";
          translateY = `-${(maxStickUp / imgHeight) * 100}%`;
          rotateY = 35;
        }

        gsap.to(img, {
          zIndex: zIndex,
          opacity: opacity,
          scale: scale,
          x: translateX,
          y: translateY,
          rotateY: rotateY,
          filter: `blur(${blur}px) ${shadow}`,
          webkitFilter: `blur(${blur}px) ${shadow}`,
          duration: 0.8,
          ease: "power3.out",
        });
      });

      // Batch text animations for better performance with stagger
      const timeline = gsap.timeline({
        onComplete: () => {
          isAnimatingRef.current = false;
        },
      });

      timeline
        .to(
          [nameElement, designationElement, quoteElement],
          {
            opacity: 0,
            y: -15,
            duration: 0.4,
            stagger: 0.08,
            ease: "power2.inOut",
          },
          0
        )
        .call(() => {
          nameElement.textContent = testimonials[newIndex].name;
          designationElement.textContent = testimonials[newIndex].designation;
          quoteElement.innerHTML = splitQuotes[newIndex];
        })
        .to(
          nameElement,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          0.7
        )
        .to(
          designationElement,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          0.9
        )
        .to(
          quoteElement,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          1
        )
        .call(animateWords, [], 0.8);

      setActiveIndex(newIndex);
    },
    [activeIndex, animateWords, splitQuotes]
  );

  const stopAutoplay = useCallback(() => {
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current);
      autoplayIntervalRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    stopAutoplay();
    autoplayIntervalRef.current = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
  }, [stopAutoplay]);

  const handleNext = useCallback(() => {
    stopAutoplay();
    updateTestimonial(1);
    startAutoplay();
  }, [stopAutoplay, updateTestimonial, startAutoplay]);

  const handlePrev = useCallback(() => {
    stopAutoplay();
    updateTestimonial(-1);
    startAutoplay();
  }, [stopAutoplay, updateTestimonial, startAutoplay]);

  // Separate effect for initial setup (runs once)
  useEffect(() => {
    // Set initial state to prevent flashing/faded text
    const nameElement = nameRef.current;
    const designationElement = designationRef.current;
    const quoteElement = quoteRef.current;
    const buttonContainer = buttonContainerRef.current;
    const section = sectionRef.current;
    const imageContainer = imageContainerRef.current;

    if (
      nameElement &&
      designationElement &&
      quoteElement &&
      buttonContainer &&
      section &&
      imageContainer
    ) {
      // Set initial hidden states for all elements
      gsap.set(
        [nameElement, designationElement, quoteElement, buttonContainer],
        {
          opacity: 0,
          y: 0,
        }
      );

      gsap.set(imageContainer, {
        opacity: 0,
        x: -100,
      });

      // Create ScrollTrigger animation for section entrance
      const scrollTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        once: true,
        onEnter: () => {
          if (hasAnimatedIn.current) return;
          hasAnimatedIn.current = true;

          const entranceTimeline = gsap.timeline();

          // Animate image container in first
          entranceTimeline.to(
            imageContainer,
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: "power3.out",
            },
            0
          );

          // Then trigger the testimonial content after a short delay
          entranceTimeline.call(
            () => {
              updateTestimonial(0);
            },
            [],
            0.4
          );

          // Animate buttons in last
          entranceTimeline.to(
            buttonContainer,
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
            },
            1.6
          );
        },
      });

      return () => {
        scrollTrigger.kill();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Separate effect for autoplay (no infinite loop)
  useEffect(() => {
    startAutoplay();

    return () => {
      stopAutoplay();
    };
  }, [startAutoplay, stopAutoplay]);

  // Trigger animation when activeIndex changes from autoplay
  useEffect(() => {
    if (activeIndex !== 0 || imageElementsRef.current.size > 0) {
      const imageContainer = imageContainerRef.current;
      if (!imageContainer) return;

      const containerWidth = imageContainer.offsetWidth;
      const gap = calculateGap(containerWidth);
      const maxStickUp = gap * 0.8;

      testimonials.forEach((_, index) => {
        const img = imageElementsRef.current.get(index);
        if (!img) return;

        const offset =
          (index - activeIndex + testimonials.length) % testimonials.length;

        // Calculate z-index to ensure proper stacking
        let zIndex: number;
        if (offset === 0) {
          zIndex = 10; // Active card on top
        } else if (offset === 1 || offset === 4) {
          zIndex = 5; // First cards on each side
        } else {
          zIndex = 3; // Second cards on each side (furthest back)
        }

        const scale = index === activeIndex ? 1 : 0.85;
        const blur = index === activeIndex ? 0 : 4;
        const shadow =
          index === activeIndex
            ? "drop-shadow(0px 25px 30px rgba(0, 0, 0, 0.35)) drop-shadow(0px 10px 15px rgba(0, 0, 0, 0.25))"
            : "drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.2))";

        let translateX: string, translateY: string, rotateY: number;

        if (offset === 0) {
          // Active card - centered
          translateX = "0%";
          translateY = "0%";
          rotateY = 0;
        } else if (offset === 1) {
          // First card to the right
          const imgHeight = img.offsetHeight || 320;
          translateX = "30%";
          translateY = `-${(maxStickUp / imgHeight) * 100}%`;
          rotateY = -35;
        } else if (offset === 2) {
          // Second card to the right
          const imgHeight = img.offsetHeight || 320;
          translateX = "50%";
          translateY = `-${((maxStickUp * 1.5) / imgHeight) * 100}%`;
          rotateY = -45;
        } else if (offset === 3) {
          // Second card to the left
          const imgHeight = img.offsetHeight || 320;
          translateX = "-50%";
          translateY = `-${((maxStickUp * 1.5) / imgHeight) * 100}%`;
          rotateY = 45;
        } else if (offset === 4) {
          // First card to the left
          const imgHeight = img.offsetHeight || 320;
          translateX = "-30%";
          translateY = `-${(maxStickUp / imgHeight) * 100}%`;
          rotateY = 35;
        } else {
          // Fallback for any other positions
          const imgHeight = img.offsetHeight || 320;
          translateX = "-30%";
          translateY = `-${(maxStickUp / imgHeight) * 100}%`;
          rotateY = 35;
        }

        gsap.to(img, {
          zIndex,
          opacity: 1,
          scale,
          x: translateX,
          y: translateY,
          rotateY,
          filter: `blur(${blur}px) ${shadow}`,
          webkitFilter: `blur(${blur}px) ${shadow}`,
          duration: 0.8,
          ease: "power3.out",
        });
      });

      const nameElement = nameRef.current;
      const designationElement = designationRef.current;
      const quoteElement = quoteRef.current;

      if (nameElement && designationElement && quoteElement) {
        const timeline = gsap.timeline();

        timeline
          .to(
            [nameElement, designationElement, quoteElement],
            {
              opacity: 0,
              y: -15,
              duration: 0.4,
              stagger: 0.08,
              ease: "power2.inOut",
            },
            0
          )
          .call(() => {
            nameElement.textContent = testimonials[activeIndex].name;
            designationElement.textContent =
              testimonials[activeIndex].designation;
            quoteElement.innerHTML = splitQuotes[activeIndex];
          })
          .to(
            nameElement,
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
            },
            0.7
          )
          .to(
            designationElement,
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
            },
            0.9
          )
          .to(
            quoteElement,
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
            },
            1
          )
          .call(animateWords, [], 0.8);
      }
    }
  }, [activeIndex, animateWords, splitQuotes]);

  // Handle window resize with debouncing
  useEffect(() => {
    let resizeTimeout: number;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        updateTestimonial(0);
      }, 150); // Debounce resize events
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [updateTestimonial]);

  return (
    <section
      className="min-h-[60vh] flex items-center justify-center"
      ref={sectionRef}
    >
      <div className="w-full max-w-6xl p-8">
        <div className="grid gap-20 md:grid-cols-5 ml-20 !h-96">
          <div
            className="relative w-60 h-80 perspective-distantt col-span-2 mt-4 self-end-safe"
            id="image-container"
            ref={imageContainerRef}
          ></div>
          <div className="flex flex-col justify-between col-span-3 h-6/7 mt-10">
            <div>
              <h3
                className="text-[3vw] leading-none font-grandbold tracking-wider text-accent will-change-[transofrm,opacity] mb-1"
                id="name"
                ref={nameRef}
              ></h3>
              <p
                className="text-sm text-background/50 mb-6 will-change-[transofrm,opacity]"
                id="designation"
                ref={designationRef}
              ></p>
            </div>
            <div>
              <p
                className=" text-background/70 leading-loose mb-4 will-change-[transofrm,opacity]"
                id="quote"
                ref={quoteRef}
              ></p>
            </div>
            <div
              className="flex items-center gap-4 transition-all will-change-transform mt-6"
              ref={buttonContainerRef}
            >
              <MagneticButtonCircular
                className="inline-flex items-center justify-center dark:bg-background bg-foreground cursor-pointer size-14 group rounded-full transition-all"
                fillClassName="bg-accent"
                dataStrength={2.5}
                dataStrengthText={30}
                aria-label="Previous testimonial"
                id="prev-button"
                onClick={handlePrev}
              >
                <IconArrowRight
                  className="size-4 rotate-180 md:size-5 text-background dark:text-foreground"
                  duotone={false}
                />
              </MagneticButtonCircular>
              <MagneticButtonCircular
                className="inline-flex items-center justify-center dark:bg-background bg-foreground cursor-pointer size-14 group rounded-full transition-all"
                fillClassName="bg-accent"
                id="next-button"
                dataStrength={2.5}
                dataStrengthText={30}
                aria-label="Next testimonial"
                onClick={handleNext}
              >
                <IconArrowRight
                  className="size-4 md:size-5 text-background dark:text-foreground"
                  duotone={false}
                />
              </MagneticButtonCircular>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
