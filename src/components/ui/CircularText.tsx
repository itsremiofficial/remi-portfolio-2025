// const CircularText = ({
//   className,
//   size,
// }: {
//   className?: string;
//   size: number | string;
// }) => {
//   return (
//     <svg className={className} viewBox={`0 0 ${size} ${size}`}>
//       <defs>
//         <path
//           id="circle-path"
//           d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
//         />
//       </defs>
//       <text>
//         <textPath href="#circle-path" startOffset="0%">
//           SVG PATH CIRCULAR TEXT EXAMPLE
//         </textPath>
//       </text>
//     </svg>
//   );
// };

// export default CircularText;

import React from "react";

interface CircularTextProps {
  text: string;
  className?: string;
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
  size = 200,
  radius = 75,
  fontSize = 16,
  fontWeight = "normal",
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
  const uniqueId = `${id}-${Math.random().toString(36).substr(2, 9)}`;

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
