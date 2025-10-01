import React from "react";

interface CircularTextProps {
  text: string;
  className?: string;
  textClassName?: string;
  size?: number | string;
  radius?: number;
  fontSize?: number | string;
  fontWeight?: string | number;
  fill?: string;
  startOffset?: string;
  letterSpacing?: string;
  fontFamily?: string;
  direction?: "clockwise" | "counterclockwise";
  reversed?: boolean;
  animate?: boolean;
  animationDuration?: string;
  id?: string;
}

const CircularText: React.FC<CircularTextProps> = ({
  text,
  className = "",
  textClassName = "",
  size = 200,
  radius = 75,
  fontSize = 16,
  fontWeight = "light",
  fill = "currentColor",
  startOffset = "0%",
  letterSpacing = "normal",
  fontFamily = "inherit",
  direction = "clockwise",
  reversed = false,
  animate = false,
  animationDuration = "10s",
  id = "circle-path",
}) => {
  // Generate unique ID to avoid conflicts when multiple components are used
  const uniqueId = `${id}-${Math.random().toString(36).substring(2, 9)}`;

  // Calculate center and adjust radius based on size
  const center = typeof size === "number" ? size / 2 : 100;
  const adjustedRadius =
    typeof size === "number" ? (radius * size) / 200 : radius;

  // Create path based on direction
  const pathDirection = direction === "clockwise" ? "1,1" : "1,0";
  const pathD = `M ${center}, ${center} m -${adjustedRadius}, 0 a ${adjustedRadius},${adjustedRadius} 0 ${pathDirection} ${
    adjustedRadius * 2
  },0 a ${adjustedRadius},${adjustedRadius} 0 ${pathDirection} -${
    adjustedRadius * 2
  },0`;

  // Process text (reverse if needed)
  const processedText = reversed ? text.split("").reverse().join("") : text;

  // Animation styles
  const animationStyle = animate
    ? {
        animation: `rotate-text ${animationDuration} linear infinite`,
      }
    : {};

  return (
    <>
      {animate && (
        <style>
          {`
            @keyframes rotate-text {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      )}
      <svg
        className={className}
        viewBox={`0 0 ${size} ${size}`}
        style={animationStyle}
        id={id}
      >
        <defs>
          <path id={uniqueId} d={pathD} />
        </defs>
        <text
          fontSize={fontSize}
          fontWeight={fontWeight}
          fill={fill}
          letterSpacing={letterSpacing}
          fontFamily={fontFamily}
          dominantBaseline="middle"
          className={textClassName}
        >
          <textPath href={`#${uniqueId}`} startOffset={startOffset}>
            {processedText}
          </textPath>
        </text>
      </svg>
    </>
  );
};

CircularText.displayName = "CircularText";

export default CircularText;
