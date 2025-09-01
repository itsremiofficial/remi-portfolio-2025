import React from "react";

interface ModernArrowProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  strokeColor?: string;
  strokeWidth?: number | string;
}

/**
 * Optimized arrow icon.
 * - Accepts strokeColor / strokeWidth (defaults: currentColor / 1)
 * - Forwards ref
 * - Memoized to avoid unnecessary re-renders
 */
const ModernArrow = React.memo(
  React.forwardRef<SVGSVGElement, ModernArrowProps>(
    (
      { className, strokeColor = "currentColor", strokeWidth = 0, ...rest },
      ref
    ) => {
      return (
        <svg
          ref={ref}
          className={className}
          width="512"
          height="324"
          viewBox="0 0 512 324"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
          {...rest}
        >
          <path
            fill={strokeColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            vectorEffect="non-scaling-stroke"
            d="m487.824 133.828-.302 38.236-.004.493-.493.002c-44.196.2-85.725 19.694-124.594 58.564-22.235 22.235-38.452 46.663-48.661 73.287l-.2.522-.497-.258L273.03 283.9l-.415-.215.187-.428c11.87-27.16 29.471-52.401 52.793-75.723q16.59-16.59 34.871-29.253l-359.176.3h-.5V127h.5l358.555.3q-17.667-12.066-33.648-28.047-34.686-34.685-53.394-76.925l-.192-.435.425-.213 40.042-20.172.486-.245.203.504q16.216 40.243 48.965 72.994c38.869 38.869 80.398 58.362 124.594 58.562l.501.003z"
          />
        </svg>
      );
    }
  )
);

ModernArrow.displayName = "ModernArrow";

export default ModernArrow;
