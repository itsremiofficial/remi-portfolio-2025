import { type FC } from "react";

interface IconProps {
  className?: string;
  fill?: boolean;
  duotone?: boolean;
  width?: string | number;
}

const IconStarish2: FC<IconProps> = ({ className }) => {
  return (
    <>
      <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
        width="200"
        height="200"
        fill="none"
      >
        <g clip-path="url(#clip0_118_208)">
          <path
            d="M100 200C97.1048 105.262 94.738 102.91 0 100C94.738 97.1048 97.0903 94.738 100 0C102.895 94.738 105.262 97.0903 200 100C105.262 102.91 102.91 105.233 100 200Z"
            fill="url(#paint0_linear_118_208)"
          />
        </g>
        <defs>
          <linearGradient
            id="paint0_linear_118_208"
            x1="14"
            y1="26"
            x2="179"
            y2="179.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="currentColor" />
            <stop offset="1" stopColor="currentColor" />
          </linearGradient>
          <clipPath id="clip0_118_208">
            <rect width="200" height="200" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </>
  );
};

export default IconStarish2;
