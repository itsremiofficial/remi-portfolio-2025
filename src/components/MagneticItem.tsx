/* eslint-disable @typescript-eslint/no-explicit-any */
import gsap from "gsap";
import React, { useRef, useEffect, useCallback, forwardRef, memo } from "react";
import { cn } from "../utils";

// Animation constants
const TEXT_TILT_MAX = 20;

// GSAP animation durations
const MAGNETIC_DURATION = 1.2;
const ELASTIC_DURATION = 2.3;
const TEXT_ELASTIC_DURATION = 2;

// Shared props
interface BaseProps {
  children: React.ReactNode;
  className?: string;
  dataStrength?: number;
  dataStrengthText?: number;
  disabled?: boolean;
}

// Anchor variant
type AnchorProps = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "disabled" | "href"> & {
    href: string;
  };

// Button variant
type ButtonProps = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

export type MagneticItemProps = AnchorProps | ButtonProps;

const MagneticItem = memo(
  forwardRef<HTMLElement, MagneticItemProps>(function MagneticItem(
    props,
    forwardedRef
  ) {
    // Destructure shared + discriminant
    const {
      children,
      className = "",
      dataStrength = 100,
      dataStrengthText = 50,
      disabled = false,
      onClick,
      href,
      ...rest
    } = props;

    const rootRef = useRef<HTMLElement | null>(null);
    const textRef = useRef<HTMLSpanElement>(null);

    // Forward ref
    useEffect(() => {
      if (typeof forwardedRef === "function") {
        forwardedRef(rootRef.current);
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<HTMLElement | null>).current =
          rootRef.current;
      }
    }, [forwardedRef]);

    const isMobile = () => window.innerWidth <= 540;

    const isLink = typeof href === "string";
    const anchorProps = isLink ? (props as AnchorProps) : null;
    const buttonProps = !isLink ? (props as ButtonProps) : null;

    const handleMouseMove = useCallback(
      (e: React.MouseEvent<HTMLElement>) => {
        if (isMobile() || !rootRef.current || !textRef.current || disabled)
          return;

        const el = rootRef.current;
        const rect = el.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;

        const buttonX = nx * dataStrength;
        const buttonY = ny * dataStrength;
        const textX = nx * dataStrengthText;
        const textY = ny * dataStrengthText;

        // Animate button position
        gsap.to(el, {
          duration: MAGNETIC_DURATION,
          x: buttonX,
          y: buttonY,
          rotate: "0.001deg",
          ease: "power4.out",
        });

        // Bend text towards pointer with 3D rotation
        const rotX = -ny * (TEXT_TILT_MAX * 2);
        const rotY = nx * (TEXT_TILT_MAX * 2);

        gsap.to(textRef.current, {
          duration: MAGNETIC_DURATION,
          x: textX,
          y: textY,
          rotateX: rotX,
          rotateY: rotY,
          transformPerspective: 800,
          transformOrigin: "50% 50%",
          ease: "power4.out",
        });
      },
      [dataStrength, dataStrengthText, disabled]
    );

    const handleMouseLeave = useCallback(() => {
      if (isMobile() || !rootRef.current || !textRef.current || disabled)
        return;

      // Reset button position with elastic bounce
      gsap.to(rootRef.current, {
        duration: ELASTIC_DURATION,
        x: 0,
        y: 0,
        ease: "elastic.out(1,0.6)",
      });

      // Reset text position and rotation
      gsap.to(textRef.current, {
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        duration: TEXT_ELASTIC_DURATION,
        ease: "elastic.out(1,0.3)",
      });
    }, [disabled]);

    // Cleanup on unmount
    useEffect(
      () => () => {
        const r = rootRef.current;
        const t = textRef.current;
        gsap.killTweensOf([r, t]);
      },
      []
    );

    // Determine element type
    const Element: any = isLink ? "a" : "button";

    // Compute anchor-specific attributes
    const anchorAttrs: Partial<AnchorProps> | undefined =
      isLink && anchorProps
        ? (() => {
            const { target, rel, tabIndex } = anchorProps;
            const computedRel =
              target === "_blank"
                ? rel
                  ? Array.from(
                      new Set(
                        (rel + " noopener noreferrer")
                          .split(" ")
                          .filter(Boolean)
                      )
                    ).join(" ")
                  : "noopener noreferrer"
                : rel;

            return {
              href,
              target,
              rel: computedRel,
              "aria-disabled": disabled || undefined,
              role: disabled ? "link" : undefined,
              tabIndex: disabled ? -1 : tabIndex,
            };
          })()
        : undefined;

    // Compute button-specific attributes
    const buttonAttrs: Partial<ButtonProps> | undefined =
      !isLink && buttonProps
        ? {
            type: buttonProps.type || "button",
            disabled,
          }
        : undefined;

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
      if (disabled) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      onClick?.(e as unknown as React.MouseEvent<any>);
    };

    return (
      <Element
        ref={rootRef}
        className={cn(
          "relative overflow-hidden magnetic select-none",
          disabled && "opacity-60 cursor-not-allowed",
          className
        )}
        {...(isLink ? anchorAttrs : buttonAttrs)}
        {...rest}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <span
          ref={textRef}
          className="btn-text relative z-10 inline-block will-change-transform"
        >
          {children}
        </span>
      </Element>
    );
  })
);

export default MagneticItem;
