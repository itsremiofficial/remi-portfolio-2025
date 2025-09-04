/* eslint-disable @typescript-eslint/no-explicit-any */
import gsap from "gsap";
import React, { useRef, useEffect, useCallback, forwardRef, memo } from "react";
import { cn } from "../utils";

const HIDDEN_Y = "76%";
const ZOOM_HIDDEN_Y = "-76%";
const HOVER_DELAY = 50;

declare global {
  interface Window {
    __magneticCurrentHovered?: HTMLElement | null;
  }
}

// Shared props
interface BaseProps {
  children: React.ReactNode;
  className?: string;
  fillClassName?: string;
  dataStrength?: number;
  dataStrengthText?: number;
  isZoomDetail?: boolean;
  // We include disabled here to normalize logic; for <a> it's "soft-disabled"
  disabled?: boolean;
}

// Anchor variant (explicitly allow a soft disabled prop)
type AnchorProps = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "disabled" | "href"> & {
    href: string;
  };

// Button variant
type ButtonProps = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

export type MagneticButtonProps = AnchorProps | ButtonProps;

const MagneticButton = memo(
  forwardRef<HTMLElement, MagneticButtonProps>(function MagneticButton(
    props,
    forwardedRef
  ) {
    // Destructure shared + discriminant
    const {
      children,
      className = "",
      fillClassName = "",
      dataStrength = 100,
      dataStrengthText = 50,
      isZoomDetail = false,
      disabled = false,
      onClick,
      href,
      ...rest
    } = props;

    const rootRef = useRef<HTMLElement | null>(null);
    const fillRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Forward ref
    useEffect(() => {
      if (typeof forwardedRef === "function") {
        forwardedRef(rootRef.current);
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<HTMLElement | null>).current =
          rootRef.current;
      }
    }, [forwardedRef]);

    const getCurrentHovered = useCallback(
      () => window.__magneticCurrentHovered || null,
      []
    );
    const setGlobalCurrentHovered = useCallback((el: HTMLElement | null) => {
      window.__magneticCurrentHovered = el;
    }, []);

    const isMobile = () => window.innerWidth <= 540;

    const isLink = typeof href === "string";
    const anchorProps = isLink ? (props as AnchorProps) : null;
    const buttonProps = !isLink ? (props as ButtonProps) : null;

    const setFillHidden = useCallback(
      (fill: HTMLElement) => {
        if (isZoomDetail) {
          gsap.set(fill, {
            y: ZOOM_HIDDEN_Y,
            background: "transparent",
            immediateRender: true,
          });
        } else {
          gsap.set(fill, { y: HIDDEN_Y });
        }
      },
      [isZoomDetail]
    );

    useEffect(() => {
      if (fillRef.current) setFillHidden(fillRef.current);
    }, [setFillHidden]);

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

        gsap.to(el, {
          duration: 1.2,
          x: buttonX,
          y: buttonY,
          rotate: "0.001deg",
          ease: "power4.out",
        });

        gsap.to(textRef.current, {
          duration: 1.2,
          x: textX,
          y: textY,
          rotate: "0.001deg",
          ease: "power4.out",
        });
      },
      [dataStrength, dataStrengthText, disabled]
    );

    const handleMouseLeave = useCallback(() => {
      if (isMobile() || !rootRef.current || !textRef.current || disabled)
        return;

      gsap.to(rootRef.current, {
        duration: 1.3,
        x: 0,
        y: 0,
        ease: "elastic.out(1,0.6)",
      });

      gsap.to(textRef.current, {
        duration: 1.3,
        x: 0,
        y: 0,
        ease: "elastic.out(1,0.6)",
      });
    }, [disabled]);

    const handlePointerEnter = useCallback(() => {
      if (isMobile() || !rootRef.current || !fillRef.current || disabled)
        return;

      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);

      const prevBtn = getCurrentHovered();
      if (prevBtn && prevBtn !== rootRef.current) {
        const prevFill = prevBtn.querySelector(
          ".btn-fill"
        ) as HTMLElement | null;
        if (prevFill) {
          gsap.killTweensOf(prevFill);
          gsap.to(prevFill, {
            duration: 0.5,
            y: HIDDEN_Y,
            ease: "power2.inOut",
            overwrite: "auto",
          });
        }
      }

      setGlobalCurrentHovered(rootRef.current);

      hoverTimeoutRef.current = setTimeout(() => {
        const fill = fillRef.current;
        if (!fill) return;
        gsap.killTweensOf(fill);
        if (isZoomDetail) {
          setFillHidden(fill);
          return;
        }
        gsap.fromTo(
          fill,
          { y: HIDDEN_Y },
          {
            duration: 0.7,
            y: "0%",
            ease: "cubic-bezier(0.7,0,0.2,1)",
            overwrite: "auto",
          }
        );
      }, HOVER_DELAY);
    }, [
      getCurrentHovered,
      setGlobalCurrentHovered,
      isZoomDetail,
      setFillHidden,
      disabled,
    ]);

    const handlePointerLeave = useCallback(
      (e: React.PointerEvent<HTMLElement>) => {
        if (isMobile() || !rootRef.current || !fillRef.current || disabled)
          return;
        if (
          e.pointerType === "mouse" &&
          rootRef.current.contains(e.relatedTarget as Node)
        )
          return;

        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);

        const fill = fillRef.current;
        gsap.killTweensOf(fill);

        if (isZoomDetail) {
          setFillHidden(fill);
        } else {
          gsap.to(fill, {
            duration: 0.45,
            y: ZOOM_HIDDEN_Y,
            ease: "cubic-bezier(0.8,0,0.3,1)",
            overwrite: "auto",
          });
        }

        if (getCurrentHovered() === rootRef.current) {
          setGlobalCurrentHovered(null);
        }
      },
      [
        getCurrentHovered,
        setGlobalCurrentHovered,
        isZoomDetail,
        setFillHidden,
        disabled,
      ]
    );

    useEffect(
      () => () => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        const r = rootRef.current;
        const t = textRef.current;
        const f = fillRef.current;
        gsap.killTweensOf([r, t, f]);
        if (getCurrentHovered() === r) setGlobalCurrentHovered(null);
      },
      [getCurrentHovered, setGlobalCurrentHovered]
    );

    const Element: any = isLink ? "a" : "button";

    // Anchor-specific computed attributes
    let anchorAttrs: Partial<AnchorProps> | undefined;
    if (isLink && anchorProps) {
      const { target, rel, tabIndex } = anchorProps;
      const computedRel =
        target === "_blank"
          ? rel
            ? Array.from(
                new Set(
                  (rel + " noopener noreferrer").split(" ").filter(Boolean)
                )
              ).join(" ")
            : "noopener noreferrer"
          : rel;

      anchorAttrs = {
        href,
        target,
        rel: computedRel,
        "aria-disabled": disabled || undefined,
        role: disabled ? "link" : undefined,
        tabIndex: disabled ? -1 : tabIndex,
      };
    }

    // Button-specific attributes
    let buttonAttrs: Partial<ButtonProps> | undefined;
    if (!isLink && buttonProps) {
      buttonAttrs = {
        type: buttonProps.type || "button",
        disabled,
      };
    }

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
          "relative overflow-hidden hashover magnetic select-none",
          disabled && "opacity-60 cursor-not-allowed",
          className
        )}
        {...(isLink ? anchorAttrs : buttonAttrs)}
        {...rest}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <div
          ref={fillRef}
          className={cn(
            "btn-fill absolute left-[-10%] top-[-50%] rounded-[50%] w-[120%] h-[200%] pointer-events-none will-change-transform",
            fillClassName
          )}
          style={{
            transform: `translateY(${isZoomDetail ? ZOOM_HIDDEN_Y : HIDDEN_Y})`,
          }}
        />
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

export default MagneticButton;
