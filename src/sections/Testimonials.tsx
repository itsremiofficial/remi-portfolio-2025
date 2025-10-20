import { useCallback, useEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TESTIMONIALS } from "../constants/TESTIMONIALS";

// gsap.registerPlugin(ScrollTrigger);

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
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const subnameRef = useRef<HTMLHeadingElement>(null);
  const designationRef = useRef<HTMLParagraphElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const slidingElementsRef = useRef<Map<number, HTMLDivElement>>(new Map());
  const sectionRef = useRef<HTMLDivElement>(null);
  const currentIndexRef = useRef(0);
  const spacerRef = useRef<HTMLDivElement | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const targetTestimonialIdRef = useRef<string | null>(null);

  const splitQuotes = useMemo(
    () =>
      TESTIMONIALS.map((t) =>
        t.quote
          .split(" ")
          .map((word) => `<span class="word">${word}</span>`)
          .join(" ")
      ),
    []
  );

  const animateWords = useCallback(() => {
    const wordElements = document.querySelectorAll(".word");
    if (wordElements.length === 0) return;

    gsap.fromTo(
      wordElements,
      { opacity: 0, y: 10, filter: "blur(3px)" },
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

  const updateTestimonial = useCallback(
    (index: number) => {
      const imageContainer = imageContainerRef.current;
      const nameElement = nameRef.current;
      const subnameElement = subnameRef.current;
      const designationElement = designationRef.current;
      const quoteElement = quoteRef.current;

      if (
        !imageContainer ||
        !nameElement ||
        !subnameElement ||
        !designationElement ||
        !quoteElement
      )
        return;

      currentIndexRef.current = index;

      const containerWidth = imageContainer.offsetWidth;
      const gap = calculateGap(containerWidth);
      const maxStickUp = gap * 0.8;

      // Update sliding containers (image + shadow)
      TESTIMONIALS.forEach((testimonial, idx) => {
        let slidingContainer = slidingElementsRef.current.get(idx);

        if (!slidingContainer) {
          // Create container div
          slidingContainer = document.createElement("div");
          slidingContainer.className = "absolute w-full h-[320px]";
          slidingContainer.id = `${testimonial.id}`;

          // Create shadow div
          const shadowDiv = document.createElement("div");
          shadowDiv.className =
            "absolute w-27/28 inset-0 top-1.5 left-1 -z-10 rounded-[4.5rem] dark:bg-foreground bg-background shadow-element";

          // Create image
          const img = document.createElement("img");
          img.src = testimonial.src;
          img.alt = testimonial.name;
          img.classList.add("testimonial-image");
          img.loading = "eager";

          slidingContainer.appendChild(shadowDiv);
          slidingContainer.appendChild(img);
          imageContainer.appendChild(slidingContainer);
          slidingElementsRef.current.set(idx, slidingContainer);
        }

        const offset =
          (idx - index + TESTIMONIALS.length) % TESTIMONIALS.length;
        const zIndex = offset === 0 ? 20 : offset === 1 || offset === 4 ? 5 : 3;
        const scale = idx === index ? 1 : 0.85;
        const blur = idx === index ? 0 : 3;

        let x = "0%",
          y = "0%",
          rotateY = 0;

        if (offset === 1) {
          x = "30%";
          y = `-${(maxStickUp / 320) * 100}%`;
          rotateY = -35;
        } else if (offset === 2) {
          x = "50%";
          y = `-${((maxStickUp * 1.5) / 320) * 100}%`;
          rotateY = -45;
        } else if (offset === 3) {
          x = "-50%";
          y = `-${((maxStickUp * 1.5) / 320) * 100}%`;
          rotateY = 45;
        } else if (offset === 4) {
          x = "-30%";
          y = `-${(maxStickUp / 320) * 100}%`;
          rotateY = 35;
        }

        // Update shadow styling based on position
        const shadowElement = slidingContainer.querySelector(
          ".shadow-element"
        ) as HTMLElement;
        if (shadowElement) {
          // Hide shadow on last images (offset 2 and 3)
          shadowElement.style.opacity =
            offset === 2 || offset === 3 ? "0" : "1";

          // Apply custom-shadow class to front slide, small-custom-shadow to others
          if (offset === 0) {
            shadowElement.classList.remove("small-custom-shadow");
            shadowElement.classList.add("custom-shadow");
          } else {
            shadowElement.classList.remove("custom-shadow");
            shadowElement.classList.add("small-custom-shadow");
          }
        }

        gsap.to(slidingContainer, {
          zIndex,
          opacity: 1,
          scale,
          x,
          y,
          rotateY,
          filter: `blur(${blur}px)`,
          duration: 0.6,
          ease: "power2.out",
        });
      });

      // Update text
      const tl = gsap.timeline();
      tl.to([nameElement, subnameElement, designationElement, quoteElement], {
        opacity: 0,
        y: -15,
        duration: 0.3,
        stagger: 0.05,
      })
        .call(() => {
          nameElement.textContent = TESTIMONIALS[index].name;
          subnameElement.textContent = TESTIMONIALS[index].subname;
          designationElement.textContent = TESTIMONIALS[index].designation;
          quoteElement.innerHTML = splitQuotes[index];
        })
        .to(nameElement, { opacity: 1, y: 0, duration: 0.4 }, 0.45)
        .to(subnameElement, { opacity: 1, y: 0, duration: 0.4 }, 0.6)
        .to(designationElement, { opacity: 1, y: 0, duration: 0.4 }, 0.65)
        .to(quoteElement, { opacity: 1, y: 0, duration: 0.4 }, 0.7)
        .call(animateWords, [], 0.5);
    },
    [animateWords, splitQuotes]
  );

  useEffect(() => {
    const section = sectionRef.current;
    const imageContainer = imageContainerRef.current;

    if (!section || !imageContainer) return;

    gsap.set(imageContainer, { opacity: 0, x: -100 });

    const entranceTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        once: true,
      },
    });

    entranceTl
      .to(imageContainer, { opacity: 1, x: 0, duration: 0.8 })
      .call(() => updateTestimonial(0), [], 0.4);

    const scrollDistance = window.innerHeight * (TESTIMONIALS.length / 2);

    console.log(scrollDistance);
    console.log(window.innerHeight);
    console.log(TESTIMONIALS.length / 2);

    const spacer = document.createElement("div");
    spacer.style.height = `${scrollDistance}px`;
    spacer.style.pointerEvents = "none";
    section.insertAdjacentElement("afterend", spacer);
    spacerRef.current = spacer;

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: `+=${scrollDistance}`,
      pin: true,
      pinSpacing: false,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const slideIndex = Math.min(
          Math.floor(self.progress * TESTIMONIALS.length),
          TESTIMONIALS.length - 1
        );

        if (slideIndex !== currentIndexRef.current) {
          updateTestimonial(slideIndex);
        }
      },
    });

    scrollTriggerRef.current = st;

    return () => {
      entranceTl.kill();
      st.kill();
      if (spacerRef.current && spacerRef.current.parentNode) {
        spacerRef.current.parentNode.removeChild(spacerRef.current);
        spacerRef.current = null;
      }
    };
  }, [updateTestimonial]);

  useEffect(() => {
    const handleResize = () => {
      ScrollTrigger.refresh();

      if (spacerRef.current) {
        const scrollDistance = window.innerHeight * TESTIMONIALS.length;
        spacerRef.current.style.height = `${scrollDistance}px`;
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle scrolling to specific testimonial via URL hash or data attribute
  useEffect(() => {
    const scrollToSpecificTestimonial = () => {
      const section = sectionRef.current;
      const st = scrollTriggerRef.current;

      // Check if we have a target testimonial ID stored
      if (targetTestimonialIdRef.current && section && st) {
        const testimonialIndex = TESTIMONIALS.findIndex(
          (t) => t.id === targetTestimonialIdRef.current
        );

        if (testimonialIndex !== -1) {
          // Calculate the target scroll position for this testimonial
          const progress = testimonialIndex / TESTIMONIALS.length;
          const scrollDistance = window.innerHeight * TESTIMONIALS.length;
          const targetScroll = st.start + progress * scrollDistance;

          // Scroll to the testimonial after a small delay to ensure everything is rendered
          setTimeout(() => {
            window.scrollTo({
              top: targetScroll,
              behavior: "smooth",
            });
            targetTestimonialIdRef.current = null;
          }, 100);
        }
      }
    };

    // Listen for custom event from Hero section
    const handleScrollToTestimonial = (event: CustomEvent<{ id: string }>) => {
      targetTestimonialIdRef.current = event.detail.id;
      scrollToSpecificTestimonial();
    };

    window.addEventListener(
      "scrollToTestimonial",
      handleScrollToTestimonial as EventListener
    );

    return () => {
      window.removeEventListener(
        "scrollToTestimonial",
        handleScrollToTestimonial as EventListener
      );
    };
  }, []);

  return (
    <section
      className="min-h-screen flex items-center justify-center"
      ref={sectionRef}
      id="testimonials"
    >
      <div className="w-full max-w-7xl p-8">
        <div className="grid gap-20 grid-cols-1 md:grid-cols-5 !h-96 w-full">
          <div
            className="relative w-60 !h-full col-span-2 mt-14 place-self-center flex items-center justify-center"
            ref={imageContainerRef}
          />

          <div className="flex flex-col mt-28 md:mt-0 justify-start col-span-3 h-full w-full text-center md:text-left">
            <div>
              <h3
                className="text-8xl leading-[0.8] font-grandbold bg-gradient-to-b from-accent via-accent to-foreground bg-clip-text text-transparent mb-1"
                ref={nameRef}
              />
              <h3
                className="text-8xl leading-[0.2] font-grandbold text-foreground dark:text-background mb-8 [-webkit-text-stroke:1.5px_var(--color-background)] dark:[-webkit-text-stroke:3px_var(--color-foreground)]"
                ref={subnameRef}
              />
              <p
                className="text-sm text-foreground/50 dark:text-background/50 mb-6 whitespace-nowrap"
                ref={designationRef}
              />
            </div>

            <div>
              <p
                className="text-foreground text-balance dark:text-background/70 leading-loose mb-4"
                ref={quoteRef}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
