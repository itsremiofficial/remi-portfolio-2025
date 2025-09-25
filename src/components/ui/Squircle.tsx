/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useId } from "react";

interface SquircleProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  radius?: number;
  fill?: string;
  className?: string;
  children?: React.ReactNode;
}

const isHtmlChild = (child: React.ReactNode): boolean => {
  if (child == null) return false;
  if (typeof child === "string" || typeof child === "number") return true;
  if (Array.isArray(child)) return child.some(isHtmlChild);
  if (React.isValidElement(child)) {
    // If element type is a string (eg 'div', 'span') it's an HTML element.
    // If it's a function or object it's a React component or SVG element.
    return (
      typeof child.type === "string" &&
      child.type !== "svg" &&
      child.type !== "path"
    );
  }
  return false;
};

const Squircle: React.FC<SquircleProps> = ({
  width = 450,
  height = 600,
  radius = 60,
  fill = "#D9D9D9",
  className = "",
  children,
  ...props
}) => {
  const id = useId();
  const clipId = `rounded-clip-${id}`;

  const maxRadius = Math.min(width / 2, height / 2);
  const r = Math.min(radius, maxRadius);
  const c = r * 0.8;

  const generatePath = (): string => {
    return [
      `M ${r} 0`,
      `H ${width - r}`,
      `C ${width - r + c} 0, ${width} ${r - c}, ${width} ${r}`,
      `V ${height - r}`,
      `C ${width} ${height - r + c}, ${width - r + c} ${height}, ${
        width - r
      } ${height}`,
      `H ${r}`,
      `C ${r - c} ${height}, 0 ${height - r + c}, 0 ${height - r}`,
      `V ${r}`,
      `C 0 ${r - c}, ${r - c} 0, ${r} 0`,
      `Z`,
    ].join(" ");
  };

  const pathD = generatePath();

  // Detect if any child is an HTML element or string/number — then render via foreignObject
  const childrenArray = React.Children.toArray(children);
  const hasHtml = childrenArray.some(isHtmlChild);

  // foreignObject inner div props need the XHTML xmlns attribute which isn't in React's div props type.
  // We keep typings correct by casting the props object to `any` when spreading.
  const foreignDivProps: any = {
    xmlns: "http://www.w3.org/1999/xhtml",
    style: {
      width: "100%",
      height: "100%",
      boxSizing: "border-box",
      overflow: "hidden",
      display: "flex",
      alignItems: "stretch",
      justifyContent: "stretch",
    },
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={className}
      {...props}
    >
      <defs>
        <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
          <path d={pathD} />
        </clipPath>
      </defs>

      {/* background shape */}
      <path fill={fill} d={pathD} />

      {/* SVG children — clipped via <g> */}
      {children && !hasHtml && (
        <g clipPath={`url(#${clipId})`}>
          <g>{children}</g>
        </g>
      )}

      {/* HTML children — wrapped in foreignObject and clipped */}
      {children && hasHtml && (
        <g clipPath={`url(#${clipId})`}>
          <foreignObject x={0} y={0} width={width} height={height}>
            <div {...foreignDivProps}>{children}</div>
          </foreignObject>
        </g>
      )}
    </svg>
  );
};

export default Squircle;
