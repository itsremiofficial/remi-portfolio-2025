import React, {
  useState,
  useRef,
  useEffect,
  type MouseEvent,
  type CSSProperties,
} from "react";
import { useTheme } from "../hooks/useTheme";
import { cn } from "../utils";

interface MagneticButtonProps {
  href?: string;
  children: React.ReactNode;
  strength?: number;
  strengthText?: number;
  className?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  target?: string;
  // Add color customization props
  fillColor?: string;
  textColor?: string;
  hoverTextColor?: string;
  borderColor?: string;
  hoverBorderColor?: string;
  [key: string]: any; // For other HTML attributes
}

interface Transform {
  x: number;
  y: number;
}

const MagneticButton = ({
  href,
  children,
  strength = 25,
  strengthText = 15,
  className = "",
  onClick,
  target,
  // Add color customization props
  fillColor,
  textColor,
  hoverTextColor,
  borderColor,
  hoverBorderColor,
  ...props
}: MagneticButtonProps) => {
  const { isDark } = useTheme();

  // Set default colors based on theme, but allow override
  const defaultFillColor = isDark ? "var(--color-light)" : "var(--color-dark)";
  const defaultTextColor = isDark ? "var(--color-light)" : "var(--color-dark)";
  const defaultHoverTextColor = "var(--color-accent)";
  const defaultBorderColor = isDark
    ? "var(--color-dark)"
    : "var(--color-light)";
  const defaultHoverBorderColor = isDark
    ? "var(--color-light)"
    : "var(--color-light)";

  // Use provided colors or fall back to defaults
  const actualFillColor = fillColor || defaultFillColor;
  const actualTextColor = textColor || defaultTextColor;
  const actualHoverTextColor = hoverTextColor || defaultHoverTextColor;
  const actualBorderColor = borderColor || defaultBorderColor;
  const actualHoverBorderColor = hoverBorderColor || defaultHoverBorderColor;

  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [magneticTransform, setMagneticTransform] = useState<Transform>({
    x: 0,
    y: 0,
  });
  const [textTransform, setTextTransform] = useState<Transform>({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 540);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseMove = (
    e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    if (isMobile || !buttonRef.current) return;

    const button = buttonRef.current;
    const bounding = button.getBoundingClientRect();

    const x =
      ((e.clientX - bounding.left) / button.offsetWidth - 0.5) * strength;
    const y =
      ((e.clientY - bounding.top) / button.offsetHeight - 0.5) * strength;

    const textX =
      ((e.clientX - bounding.left) / button.offsetWidth - 0.5) * strengthText;
    const textY =
      ((e.clientY - bounding.top) / button.offsetHeight - 0.5) * strengthText;

    setMagneticTransform({ x, y });
    setTextTransform({ x: textX, y: textY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMagneticTransform({ x: 0, y: 0 });
    setTextTransform({ x: 0, y: 0 });
  };

  const handleClick = (
    e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    if (onClick) {
      e.preventDefault();
      onClick(e);
    }
  };

  const fillStyle: CSSProperties = {
    transform: `translateY(${isHovered ? "0%" : "76%"})`,
    position: "absolute",
    top: "-50%",
    left: "-25%",
    right: 0,
    bottom: 0,
    width: "150%",
    height: "200%",
    background: actualFillColor,
    borderRadius: "50%",
    transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
    zIndex: 1,
  };

  const textStyle: CSSProperties = {
    transform: `translate(${textTransform.x}px, ${textTransform.y}px) rotate(0.001deg)`,
    transition: isMobile
      ? "none"
      : "transform 1.5s cubic-bezier(0.23, 1, 0.32, 1)",
    position: "relative",
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const textInnerStyle: CSSProperties = {
    color: isHovered ? actualHoverTextColor : actualTextColor,
    transition: `color ${
      isHovered ? "0.3s" : "0.3s"
    } cubic-bezier(0.4, 0, 0.2, 1)`,
    transitionDelay: isHovered ? "0s" : "0.3s",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const buttonStyle: CSSProperties = {
    transform: `translate(${magneticTransform.x}px, ${magneticTransform.y}px) rotate(0.001deg)`,
    transition: isMobile
      ? "none"
      : "transform 1.5s cubic-bezier(0.23, 1, 0.32, 1)",
    display: "inline-block",
    position: "relative",
    textDecoration: "none",
    borderRadius: "100px",
    borderColor: isHovered ? actualHoverBorderColor : actualBorderColor,
    background: "transparent",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "16px",
    fontWeight: "500",
    overflow: "hidden",
  };

  const buttonContent = (
    <>
      <div className="btn-fill" style={fillStyle} />
      <span className="btn-text" style={textStyle}>
        <span className="btn-text-inner change" style={textInnerStyle}>
          {children}
        </span>
      </span>
    </>
  );

  if (href) {
    return (
      <div className={`btn btn-normal ${className} p-10`}>
        <a
          ref={buttonRef as React.RefObject<HTMLAnchorElement>}
          href={href}
          target={target}
          className="btn-click magnetic"
          data-strength={strength}
          data-strength-text={strengthText}
          style={buttonStyle}
          onMouseMove={handleMouseMove as any}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick as any}
          {...props}
        >
          {buttonContent}
        </a>
      </div>
    );
  }

  return (
    <div className={`btn btn-normal group`}>
      <button
        ref={buttonRef as React.RefObject<HTMLButtonElement>}
        className={cn(
          "btn-click magnetic whitespace-nowrap border py-5 px-10",
          className
        )}
        data-strength={strength}
        data-strength-text={strengthText}
        style={buttonStyle}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick as any}
        {...props}
      >
        {buttonContent}
      </button>
    </div>
  );
};

export default MagneticButton;
