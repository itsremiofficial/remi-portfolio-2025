import { useTheme } from "../../hooks/useTheme";

const DesignIllustration: React.FC<IllustrationProps> = ({ className }) => {
  const { isDark } = useTheme();

  const LOW_OPACITY = 0.28;
  const STROKE_WIDTH = 0.5;

  const COLOR_SEC = isDark ? "var(--color-background)" : "#1c222f";

  const COLOR_CURRENT = "currentColor";

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 202 300"
        fill="none"
        className={className}
      >
        <g clipPath="url(#desa)">
          <mask
            id="desb"
            width={202}
            height={300}
            x={0}
            y={0}
            maskUnits="userSpaceOnUse"
            style={{
              maskType: "luminance",
            }}
          >
            <path fill="#fff" d="M201.95 0H0v300h201.95z" />
          </mask>
          <g mask="url(#desb)">
            <path
              stroke={COLOR_CURRENT}
              strokeMiterlimit={10}
              strokeWidth={STROKE_WIDTH}
              d="m157.418 241.73-25.24-184.95m15 184.95-20.65-184.95m-5.65 0 16.06 184.95m-10.25 0-11.47-184.95m1.23 184.95-6.88-184.95m-3.36 184.95-2.29-184.95m-7.96 184.95 2.29-184.95m-5.65 0-6.88 184.95m1.23-184.95-11.47 184.95m-10.25 0 16.06-184.95m-26.3 184.95 20.65-184.95m-30.9 184.95 25.24-184.95m-33.16 168.5h128.53m-127.06-9.07h125.59m-124.12-9.06h122.65m-121.18-9.06h119.71m-118.24-9.07h116.77m-1.47-9.06H44.168m1.47-9.07h110.9m-1.48-9.06H47.108m1.46-9.07h105.02m-103.55-9.06h102.08m-100.61-9.06h99.14m-1.46-9.07h-96.21m94.74-9.06h-93.27m1.47-9.07h90.33m-88.86-9.06h87.39m-85.92-9.06h84.45m-82.98-9.07h81.51m-80.04-9.06h78.57m-77.1-9.07h75.63m29.11 179.61H34.148l29.98-184.95h73.9z"
            />
            <path
              fill={COLOR_CURRENT}
              d="M22.97 61.36h-.71v4.99h.71zm2.14 2.85v-.71h-4.99v.71zm-2.14 77.18h-.71v4.99h.71zm2.14 2.86v-.71h-4.99v.71zm154.259-82.89h-.71v4.99h.71zm2.14 2.85v-.71h-4.99v.71zm-2.14 77.18h-.71v4.99h.71zm2.14 2.86v-.71h-4.99v.71z"
            />
            <path
              fill={COLOR_SEC}
              stroke={COLOR_CURRENT}
              strokeMiterlimit={10}
              strokeWidth={STROKE_WIDTH}
              d="M101.079 172.3c19.038 0 34.47-5.471 34.47-12.22s-15.432-12.22-34.47-12.22-34.47 5.471-34.47 12.22 15.433 12.22 34.47 12.22Z"
            />
            <path
              fill="url(#desc)"
              d="M101.069 164.16c17.176 0 31.1-13.924 31.1-31.1s-13.924-31.1-31.1-31.1-31.1 13.924-31.1 31.1 13.924 31.1 31.1 31.1"
            />
            <path
              fill="url(#desd)"
              d="M75.03 205.25c7.643 0 13.84-6.196 13.84-13.84s-6.197-13.84-13.84-13.84c-7.644 0-13.84 6.196-13.84 13.84s6.196 13.84 13.84 13.84"
            />
            <path fill="url(#dese)" d="M157.87 53.14h-54.7v16.97h54.7z" />
            <path
              fill="url(#desf)"
              d="M160.659 50.35h-54.7v16.97h54.7z"
              opacity={LOW_OPACITY}
            />
            <path
              fill="url(#desg)"
              d="M163.409 47.6h-54.7v16.97h54.7z"
              opacity={LOW_OPACITY}
            />
            <path
              fill="url(#desh)"
              d="M166.21 44.8h-54.7v16.97h54.7z"
              opacity={LOW_OPACITY}
            />
            <path fill="url(#desi)" d="M98.999 229.1h-54.7v16.97h54.7z" />
            <path
              fill="url(#desj)"
              d="M96.2 231.89H41.5v16.97h54.7z"
              opacity={LOW_OPACITY}
            />
            <path
              fill="url(#desk)"
              d="M93.46 234.64h-54.7v16.97h54.7z"
              opacity={LOW_OPACITY}
            />
            <path
              fill="url(#desl)"
              d="M90.65 237.44h-54.7v16.97h54.7z"
              opacity={LOW_OPACITY}
            />
            <path
              fill="url(#desm)"
              d="M122.66 116.77c-.73 1.09-3.61.44-6.43-1.46s-4.5-4.32-3.77-5.41 3.61-.44 6.43 1.46 4.5 4.32 3.77 5.41"
            />
            <path
              fill="url(#desn)"
              d="M126.26 108.72c0 3.09-2.5 5.59-5.59 5.59s-5.59-2.5-5.59-5.59 2.5-5.59 5.59-5.59 5.59 2.5 5.59 5.59"
            />
            <path
              fill={COLOR_SEC}
              stroke={COLOR_CURRENT}
              strokeMiterlimit={10}
              strokeWidth={STROKE_WIDTH}
              d="M173.769 188.27h-33.96v33.96h33.96z"
            />
            <path
              fill={COLOR_SEC}
              stroke={COLOR_CURRENT}
              strokeMiterlimit={10}
              strokeWidth={STROKE_WIDTH}
              d="M170.72 185.22h-33.96v33.96h33.96z"
            />
            <path
              fill={COLOR_SEC}
              stroke={COLOR_CURRENT}
              strokeMiterlimit={10}
              strokeWidth={STROKE_WIDTH}
              d="M167.669 182.17h-33.96v33.96h33.96z"
            />
            <path
              fill={COLOR_SEC}
              stroke={COLOR_CURRENT}
              strokeMiterlimit={10}
              strokeWidth={STROKE_WIDTH}
              d="M164.618 179.12h-33.96v33.96h33.96z"
            />
            <path
              fill="url(#deso)"
              stroke={COLOR_CURRENT}
              strokeMiterlimit={10}
              strokeWidth={STROKE_WIDTH}
              d="M161.569 176.07h-33.96v33.96h33.96z"
            />
            <path
              fill={COLOR_SEC}
              stroke={COLOR_CURRENT}
              strokeMiterlimit={10}
              strokeWidth={STROKE_WIDTH}
              d="M73.74 73.41h-18.8v18.8h18.8z"
            />
            <path
              fill={COLOR_SEC}
              stroke={COLOR_CURRENT}
              strokeMiterlimit={10}
              strokeWidth={STROKE_WIDTH}
              d="M70.359 70.04h-18.8v18.8h18.8z"
            />
            <path
              fill="url(#desp)"
              stroke={COLOR_CURRENT}
              strokeMiterlimit={10}
              strokeWidth={STROKE_WIDTH}
              d="M66.99 66.66h-18.8v18.8h18.8z"
            />
          </g>
        </g>
        <defs>
          <radialGradient
            id="desc"
            cx={0}
            cy={0}
            r={1}
            gradientTransform="translate(112.989 121.27)scale(51.85)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#D9A3A3" />
            <stop offset={0.43} stopColor="#D93535" />
            <stop offset={1} />
          </radialGradient>
          <radialGradient
            id="desd"
            cx={0}
            cy={0}
            r={1}
            gradientTransform="translate(80.34 186.16)scale(23.07)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#EEB5B5" />
            <stop offset={0.31} stopColor="#D93535" />
            <stop offset={0.87} stopColor="#1C222F" />
          </radialGradient>
          <radialGradient
            id="dese"
            cx={0}
            cy={0}
            r={1}
            gradientTransform="matrix(0 -72.38 72.38 0 167.05 37.44)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#1C222F" />
            <stop offset={1} stopColor="#D93535" />
          </radialGradient>
          <radialGradient
            id="desf"
            cx={0}
            cy={0}
            r={1}
            gradientTransform="matrix(0 -72.38 72.38 0 169.839 34.65)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#1C222F" />
            <stop offset={1} stopColor="#D93535" />
          </radialGradient>
          <radialGradient
            id="desg"
            cx={0}
            cy={0}
            r={1}
            gradientTransform="rotate(-90 102.25 -70.34)scale(72.38)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#1C222F" />
            <stop offset={1} stopColor="#D93535" />
          </radialGradient>
          <radialGradient
            id="desh"
            cx={0}
            cy={0}
            r={1}
            gradientTransform="matrix(0 -72.38 72.38 0 175.43 29.1)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#1C222F" />
            <stop offset={1} stopColor="#D93535" />
          </radialGradient>
          <radialGradient
            id="desi"
            cx={0}
            cy={0}
            r={1}
            gradientTransform="matrix(0 72.38 -72.38 0 35.119 261.77)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#1C222F" />
            <stop offset={1} stopColor="#D93535" />
          </radialGradient>
          <radialGradient
            id="desj"
            cx={0}
            cy={0}
            r={1}
            gradientTransform="matrix(0 72.38 -72.38 0 32.33 264.56)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#1C222F" />
            <stop offset={1} stopColor="#D93535" />
          </radialGradient>
          <radialGradient
            id="desk"
            cx={0}
            cy={0}
            r={1}
            gradientTransform="matrix(0 72.38 -72.38 0 29.58 267.31)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#1C222F" />
            <stop offset={1} stopColor="#D93535" />
          </radialGradient>
          <radialGradient
            id="desl"
            cx={0}
            cy={0}
            r={1}
            gradientTransform="rotate(90 -121.67 148.44)scale(72.38)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#1C222F" />
            <stop offset={1} stopColor="#D93535" />
          </radialGradient>
          <radialGradient
            id="desm"
            cx={0}
            cy={0}
            r={1}
            gradientTransform="matrix(-10.2032 -9.29846 -6.14196 5.063 122.34 117.13)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopOpacity={LOW_OPACITY} />
            <stop offset={0.736} stopOpacity={0} />
          </radialGradient>
          <radialGradient
            id="desn"
            cx={0}
            cy={0}
            r={1}
            gradientTransform="translate(122.81 106.6)scale(9.32)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#EEB5B5" />
            <stop offset={0.31} stopColor="#D93535" />
            <stop offset={0.87} stopColor="#1C222F" />
          </radialGradient>
          <radialGradient
            id="deso"
            cx={0}
            cy={0}
            r={1}
            gradientTransform="translate(112.349 164.2)scale(70.02)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#1C222F" />
            <stop offset={1} stopColor="#D93535" />
          </radialGradient>
          <radialGradient
            id="desp"
            cx={0}
            cy={0}
            r={1}
            gradientTransform="translate(39.74 60.09)scale(38.76)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#1C222F" />
            <stop offset={1} stopColor="#D93535" />
          </radialGradient>
          <clipPath id="desa">
            <path fill="#fff" d="M0 0h201.95v300H0z" />
          </clipPath>
        </defs>
      </svg>
    </>
  );
};

export default DesignIllustration;
