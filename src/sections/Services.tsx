import { useRef } from "react";
import MatterCanvas from "../components/ui/PillsCanvas";

const Services = () => {
  const selectedHeadingRef = useRef<HTMLHeadingElement>(null);
  const servicesHeadingRef = useRef<HTMLHeadingElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      className="min-h-[150vh] md:min-h-screen w-full relative py-40"
      ref={mainContainerRef}
      id="services"
    >
      <div className="absolute inset-0 size-full z-[0]">
        <MatterCanvas />
      </div>
      <div className="absolute inset-0 top-0 w-full h-56 z-[1]">
        <div className="w-full h-full bg-gradient-to-t from-transparent dark:to-foreground to-background" />
      </div>
      <h2 id="selected-works-heading" className="sr-only">
        What Can I Do For You?
      </h2>
      <div className="inline-flex items-end gap-[2vw] px-4 md:px-6 relative z-[2] [&>*]:select-none">
        <div>
          <h2
            ref={selectedHeadingRef}
            className="section-heading text-foreground dark:text-background text-stroke [--text-stroke-color:theme(colors.foreground)] dark:[--text-stroke-color:theme(colors.background)]"
            style={{ transformStyle: "preserve-3d" }}
          >
            What
          </h2>
          <h2
            ref={servicesHeadingRef}
            className="section-heading dark:text-background text-foreground"
            style={{ transformStyle: "preserve-3d" }}
          >
            Can I
          </h2>
        </div>
        <div className="section-sub-heading text-accent">
          Do <br />
          For <br /> You?
        </div>
      </div>
    </section>
  );
};

export default Services;
