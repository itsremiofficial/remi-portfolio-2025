import { memo, useRef, useCallback, useMemo } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "../../utils";
import { TESTIMONIALS } from "../../constants/TESTIMONIALS";

// Testimonial item component
const TestimonialItem = memo(
  ({
    src,
    text,
    testimonialId,
    forwardedRef,
    onClick,
  }: {
    src: string;
    text: string;
    testimonialId: string;
    forwardedRef: React.Ref<HTMLDivElement>;
    onClick: () => void;
  }) => (
    <div
      className={`testimonial_hero ${testimonialId} w-[270px] md:w-[363.781px] w-inline-block bg-white/40 dark:bg-foreground/70 rounded-full border border-foreground/10 dark:border-background/10 backdrop-blur-md group/learnmore cursor-pointer`}
      ref={forwardedRef}
    >
      <img
        src={src}
        alt="Testimonial Avatar"
        className={cn(
          `div-block-100 bg-cover bg-center border border-background/15 shadow-lg`
        )}
      />
      <div className="flex flex-col items-start justify-center gap-2">
        <p className="m-0 relative text-balance text-xs">
          <span className="quote_mark">"</span>
          {text}
        </p>
        <div
          className="relative text-decoration-none leading-none text-xs"
          onClick={onClick}
        >
          <div className="font-medium text-foreground/70 dark:text-background/50 group-hover/learnmore:text-accent transition-colors duration-300">
            Learn more
          </div>
          <div className="w-0 h-[1px] left-0 absolute bg-accent group-hover/learnmore:w-full transition-all duration-300"></div>
        </div>
      </div>
    </div>
  )
);

const TestimonialsMarquee = memo(
  ({ onTestimonialClick }: { onTestimonialClick: (id: string) => void }) => {
    const testimonialContainerRef = useRef<HTMLDivElement>(null);
    const testimonialRefs = useRef<(HTMLDivElement | null)[]>([]);
    const tlRef = useRef<gsap.core.Timeline | null>(null);

    const displayTestimonials = useMemo(() => TESTIMONIALS.slice(0, 2), []);

    const handleMouseEnter = useCallback(() => tlRef.current?.pause(), []);
    const handleMouseLeave = useCallback(() => tlRef.current?.play(), []);

    const createAnimParams = useCallback(
      (isMobile: boolean) => ({
        duration: 0.7,
        holdDuration: 4,
        ease: { in: "power3.in", out: "power3.out" },
        positions: {
          top: isMobile ? "-2.8em" : "-3.8em",
          bottom: isMobile ? "-1.3em" : "-1.7em",
          exit: "-5.8em",
          enter: "0.1em",
        },
        scales: { active: 1, inactive: 0.9, transition: 0.95 },
      }),
      []
    );

    const createTransition = useCallback(
      (
        tl: gsap.core.Timeline,
        fromEl: HTMLElement,
        toEl: HTMLElement,
        params: ReturnType<typeof createAnimParams>,
        label: string
      ) => {
        tl.to(
          fromEl,
          {
            top: params.positions.exit,
            scale: params.scales.transition,
            duration: params.duration,
            ease: params.ease.in,
          },
          label
        )
          .to(
            toEl,
            {
              top: params.positions.enter,
              scale: params.scales.transition,
              duration: params.duration,
              ease: params.ease.in,
            },
            label
          )
          .add(() => {
            gsap.set(fromEl, { zIndex: 0 });
            gsap.set(toEl, { zIndex: 1 });
          })
          .to(
            fromEl,
            {
              top: params.positions.bottom,
              scale: params.scales.inactive,
              duration: params.duration,
              ease: params.ease.out,
            },
            `${label}+`
          )
          .to(
            toEl,
            {
              top: params.positions.top,
              scale: params.scales.active,
              duration: params.duration,
              ease: params.ease.out,
            },
            `${label}+`
          );
      },
      []
    );

    useGSAP(() => {
      const [firstEl, secondEl] = testimonialRefs.current;
      const testimonialContainer = testimonialContainerRef.current;

      if (!firstEl || !secondEl || !testimonialContainer) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          mobile: "(max-width: 767px)",
          desktop: "(min-width: 768px)",
        },
        (context) => {
          const isMobile = !!context.conditions?.mobile;
          tlRef.current?.kill();

          const params = createAnimParams(isMobile);

          gsap.set(firstEl, {
            position: "absolute",
            top: params.positions.top,
            zIndex: 1,
            scale: params.scales.active,
          });
          gsap.set(secondEl, {
            position: "absolute",
            top: params.positions.bottom,
            zIndex: 0,
            scale: params.scales.inactive,
          });

          const tl = gsap.timeline({ repeat: -1, paused: false });
          tlRef.current = tl;

          tl.to({}, { duration: params.holdDuration });
          createTransition(tl, firstEl, secondEl, params, "trans1");
          tl.to({}, { duration: params.holdDuration });
          createTransition(tl, secondEl, firstEl, params, "trans2");
        }
      );

      testimonialContainer.addEventListener("mouseenter", handleMouseEnter);
      testimonialContainer.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        testimonialContainer.removeEventListener(
          "mouseenter",
          handleMouseEnter
        );
        testimonialContainer.removeEventListener(
          "mouseleave",
          handleMouseLeave
        );
        tlRef.current?.kill();
        mm.kill();
      };
    }, [
      handleMouseEnter,
      handleMouseLeave,
      createAnimParams,
      createTransition,
    ]);

    return (
      <div
        className={cn(
          "marquee-item rounded-xl",
          "md:px-8 md:py-4",
          "min-w-[350px] md:min-w-[450px]",
          "text-foreground dark:text-background"
        )}
      >
        <div
          className="testimonials_highlights flex items-center justify-center w-80 md:w-90 h-28 md:h-28 "
          ref={testimonialContainerRef}
        >
          <div className="absolute flex items-center justify-center w-full h-0">
            {displayTestimonials.map((testimonial, index) => (
              <TestimonialItem
                key={testimonial.id}
                src={testimonial.shortSrc as string}
                text={testimonial.quote.substring(0, 70) + "..."}
                testimonialId={testimonial.id}
                forwardedRef={(el) => {
                  testimonialRefs.current[index] = el;
                }}
                onClick={() => onTestimonialClick(testimonial.id)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
);

export default TestimonialsMarquee;
