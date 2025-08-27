import type { FC } from "react";

export interface IconProps {
  className?: string;
  fill?: boolean;
  duotone?: boolean;
  width?: string | number;
}
const IconLinkedIn: FC<IconProps> = ({
  className,
  fill = false,
  duotone = true,
}) => {
  return (
    <>
      {!fill ? (
        <svg
          className={className}
          width="25"
          height="25"
          viewBox="0 0 25 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            d="M22.98,16.24v6.15c0,.36-.29.65-.65.65h-3.25c-.36,0-.65-.29-.65-.65v-5.96c0-.89.26-3.9-2.32-3.9-2.01,0-2.41,2.06-2.49,2.98v6.88c0,.36-.29.65-.65.65h-3.15c-.36,0-.65-.29-.65-.65v-12.82c0-.36.29-.65.65-.65h3.15c.36,0,.65.29.65.65v1.11c.74-1.12,1.85-1.98,4.2-1.98,5.21,0,5.18,4.87,5.18,7.54Z"
          />
          <path
            fill="currentColor"
            d="M7.78,4.83c0,1.59-1.29,2.88-2.88,2.88s-2.88-1.29-2.88-2.88,1.29-2.88,2.88-2.88,2.88,1.29,2.88,2.88Z"
          />
          <rect
            fill="currentColor"
            x="2.68"
            y="8.91"
            width="4.46"
            height="14.13"
            rx=".71"
            ry=".71"
          />
        </svg>
      ) : (
        <svg
          className={className}
          width="25"
          height="25"
          viewBox="0 0 25 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity={duotone ? "0.4" : "1"}
            fill="currentColor"
            d="M22.98,16.24v6.15c0,.36-.29.65-.65.65h-3.25c-.36,0-.65-.29-.65-.65v-5.96c0-.89.26-3.9-2.32-3.9-2.01,0-2.41,2.06-2.49,2.98v6.88c0,.36-.29.65-.65.65h-3.15c-.36,0-.65-.29-.65-.65v-12.82c0-.36.29-.65.65-.65h3.15c.36,0,.65.29.65.65v1.11c.74-1.12,1.85-1.98,4.2-1.98,5.21,0,5.18,4.87,5.18,7.54Z"
          />
          <path
            fill="currentColor"
            d="M7.78,4.83c0,1.59-1.29,2.88-2.88,2.88s-2.88-1.29-2.88-2.88,1.29-2.88,2.88-2.88,2.88,1.29,2.88,2.88Z"
          />
          <rect
            fill="currentColor"
            x="2.68"
            y="8.91"
            width="4.46"
            height="14.13"
            rx=".71"
            ry=".71"
          />
        </svg>
      )}
    </>
  );
};

export default IconLinkedIn;
