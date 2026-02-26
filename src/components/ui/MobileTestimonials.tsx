"use client";

import { useState } from "react";
import { TESTIMONIALS } from "../../constants/TESTIMONIALS";
import { cn } from "../../utils";

export function MobileTestimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayedQuote, setDisplayedQuote] = useState(TESTIMONIALS[0].quote);
  const [displayedRole, setDisplayedRole] = useState(
    TESTIMONIALS[0].designation,
  );
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    if (index === activeIndex || isAnimating) return;
    setIsAnimating(true);

    setTimeout(() => {
      setDisplayedQuote(TESTIMONIALS[index].quote);
      setDisplayedRole(TESTIMONIALS[index].designation);
      setActiveIndex(index);
      setTimeout(() => setIsAnimating(false), 400);
    }, 200);
  };

  return (
    <div className="flex flex-col justify-end items-center gap-10 py-20">
      {/* Quote Container */}
      <div className="relative px-8">
        <span className="absolute left-2 -top-1 text-7xl font-serif text-foreground/[0.1] dark:text-background/[0.1] select-none pointer-events-none">
          "
        </span>

        <p
          className={cn(
            "text-xl md:text-3xl font-light text-foreground dark:text-background text-center max-w-lg leading-relaxed transition-all duration-400 ease-out font-inter !italic",
            isAnimating
              ? "opacity-0 blur-sm scale-[0.98]"
              : "opacity-100 blur-0 scale-100",
          )}
        >
          {displayedQuote}
        </p>

        <span className="absolute right-6 -bottom-10 text-7xl font-serif text-foreground/[0.1] dark:text-background/[0.1] select-none pointer-events-none">
          "
        </span>
      </div>

      <div className="flex flex-col items-center gap-3 mt-2">
        {/* Role text */}
        <p
          className={cn(
            "text-xs text-accent-foreground dark:text-brand-800 tracking-wider font-bold dark:font-normal uppercase transition-all duration-500 ease-out",
            isAnimating
              ? "opacity-0 translate-y-2"
              : "opacity-100 translate-y-0",
          )}
        >
          {displayedRole}
        </p>

        <div className="flex items-center justify-center gap-2">
          {TESTIMONIALS.map((testimonial, index) => {
            const isActive = activeIndex === index;
            const isHovered = hoveredIndex === index && !isActive;
            const showName = isActive || isHovered;

            return (
              <button
                key={testimonial.id}
                onClick={() => handleSelect(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={cn(
                  "relative flex items-center gap-0 rounded-full cursor-pointer",
                  "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ",
                  isActive
                    ? "bg-accent shadow-lg"
                    : "bg-transparent hover:bg-foreground/80 dark:hover:bg-background/10",
                  showName ? "pr-6 pl-2 py-2" : "p-0.5",
                )}
              >
                {/* Avatar with smooth ring animation */}
                <div className="relative flex-shrink-0">
                  <img
                    src={testimonial.src || "/placeholder.svg"}
                    alt={testimonial.name}
                    className={cn(
                      "w-8 h-8 rounded-full object-cover bg-top",
                      "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                      isActive
                        ? "ring-2 ring-background/10 dark:ring-background/50"
                        : "ring-2 ring-background/10 dark:ring-background/20",
                      !isActive && "hover:scale-105",
                    )}
                  />
                </div>

                <div
                  className={cn(
                    "grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                    showName
                      ? "grid-cols-[1fr] opacity-100 ml-2"
                      : "grid-cols-[0fr] opacity-0 ml-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <span
                      className={cn(
                        "text-sm font-medium whitespace-nowrap block",
                        "transition-colors duration-300",
                        isActive
                          ? "text-background"
                          : "text-foreground dark:text-brand-800",
                      )}
                    >
                      {testimonial.name}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
