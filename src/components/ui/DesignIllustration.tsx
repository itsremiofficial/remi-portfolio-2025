const DesignIllustration: React.FC<IllustrationProps> = ({ className }) => {
  const LOW_OPACITY = 0.28;
  const STROKE_WIDTH = 0.4;
  const COLOR_SEC = "#1c222f";
  const COLOR_CURRENT = "currentColor";

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 201.95 300"
        className={className}
      >
        <defs>
          <radialGradient
            id="radial-gradient"
            cx="112.99"
            cy="121.27"
            fx="112.99"
            fy="121.27"
            r="51.85"
            gradientTransform="rotate(13.28 101.077 133.068)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#d9a3a3" />
            <stop offset=".43" stopColor="#d93535" />
            <stop offset="1" />
          </radialGradient>
          <radialGradient
            id="radial-gradient-2"
            cx="80.32"
            cy="186.15"
            fx="80.32"
            fy="186.15"
            r="23.07"
            gradientTransform="rotate(84.34 75.02 191.402)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#eeb5b5" />
            <stop offset=".31" stopColor="#d93535" />
            <stop offset=".87" stopColor="#1e2328" />
          </radialGradient>
          <radialGradient
            id="radial-gradient-3"
            cx="9437.79"
            cy="1254.58"
            fx="9437.79"
            fy="1254.58"
            r="72.38"
            gradientTransform="matrix(1 0 0 -1 -9283.08 1352.74)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#323c43" />
            <stop offset="1" stopColor="#d93535" />
          </radialGradient>
          <radialGradient
            id="radial-gradient-4"
            cx="9440.58"
            cy="1251.79"
            fx="9440.58"
            fy="1251.79"
            r="72.38"
            gradientTransform="matrix(1 0 0 -1 -9283.08 1347.16)"
            xlinkHref="#radial-gradient-3"
          />
          <radialGradient
            id="radial-gradient-5"
            cx="9443.32"
            cy="1249.04"
            fx="9443.32"
            fy="1249.04"
            r="72.38"
            gradientTransform="matrix(1 0 0 -1 -9283.08 1341.66)"
            xlinkHref="#radial-gradient-3"
          />
          <radialGradient
            id="radial-gradient-6"
            cx="9446.13"
            cy="1246.24"
            fx="9446.13"
            fy="1246.24"
            r="72.38"
            gradientTransform="matrix(1 0 0 -1 -9283.08 1336.1)"
            xlinkHref="#radial-gradient-3"
          />
          <radialGradient
            id="radial-gradient-7"
            cx="8225.21"
            cy="-315.55"
            fx="8225.21"
            fy="-315.55"
            r="72.38"
            gradientTransform="matrix(1 0 0 -1 -8129.38 -41.44)"
            xlinkHref="#radial-gradient-3"
          />
          <radialGradient
            id="radial-gradient-8"
            cx="8228"
            cy="-318.34"
            fx="8228"
            fy="-318.34"
            r="72.38"
            gradientTransform="matrix(1 0 0 -1 -8134.96 -41.44)"
            xlinkHref="#radial-gradient-3"
          />
          <radialGradient
            id="radial-gradient-9"
            cx="8230.75"
            cy="-321.09"
            fx="8230.75"
            fy="-321.09"
            r="72.38"
            gradientTransform="matrix(1 0 0 -1 -8140.45 -41.44)"
            xlinkHref="#radial-gradient-3"
          />
          <radialGradient
            id="radial-gradient-10"
            cx="8233.55"
            cy="-323.9"
            fx="8233.55"
            fy="-323.9"
            r="72.38"
            gradientTransform="matrix(1 0 0 -1 -8146.06 -41.44)"
            xlinkHref="#radial-gradient-3"
          />
          <radialGradient
            id="radial-gradient-11"
            cx="126.5"
            cy="100.85"
            fx="126.5"
            fy="100.85"
            r="5.37"
            gradientTransform="matrix(.75414 .65672 -.2851 .3617 50.92 -6.82)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopOpacity=".99" />
            <stop offset=".86" stopOpacity="0" />
          </radialGradient>
          <radialGradient
            id="radial-gradient-12"
            cx="10"
            cy="10"
            fx="10"
            fy="10"
            r="9.32"
            xlinkHref="#radial-gradient-2"
          />
          <radialGradient
            id="radial-gradient-13"
            cx="112.35"
            cy="164.2"
            fx="112.35"
            fy="164.2"
            r="70.02"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#252b32" />
            <stop offset="1" stopColor="#d93535" />
          </radialGradient>
          <radialGradient
            id="radial-gradient-14"
            cx="39.74"
            cy="60.09"
            fx="39.74"
            fy="60.09"
            r="38.76"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#323c43" />
            <stop offset="1" stopColor="#d93535" />
          </radialGradient>
          <clipPath id="clippath">
            <path fill="none" d="M0 0h201.95v300H0z" />
          </clipPath>
        </defs>
        <g clipPath="url(#clippath)" id="OBJECTS">
          <path
            stroke={COLOR_CURRENT}
            strokeMiterlimit="10"
            fill="none"
            strokeWidth={STROKE_WIDTH}
            d="M168.01,241.73H34.15l29.98-184.95h73.9l29.98,184.95ZM157.42,241.73l-25.24-184.95M147.18,241.73l-20.65-184.95M120.88,56.78l16.06,184.95M126.69,241.73l-11.47-184.95M116.45,241.73l-6.88-184.95M106.21,241.73l-2.29-184.95M95.96,241.73l2.29-184.95M92.6,56.78l-6.88,184.95M86.95,56.78l-11.47,184.95M65.23,241.73l16.06-184.95M54.99,241.73l20.65-184.95M44.74,241.73l25.24-184.95M36.82,225.28h128.53M38.29,216.21h125.59M39.76,207.15h122.65M41.23,198.09h119.71M42.7,189.02h116.77M158,179.96H44.17M45.64,170.89h110.9M155.06,161.83H47.11M48.57,152.76h105.02M50.04,143.7h102.08M51.51,134.64h99.14M149.19,125.57H52.98M147.72,116.51H54.45M55.92,107.44h90.33M57.39,98.38h87.39M58.86,89.32h84.45M60.33,80.25h81.51M61.8,71.19h78.57M63.27,62.12h75.63"
          />
          <path
            stroke="none"
            fill={COLOR_CURRENT}
            strokeWidth={STROKE_WIDTH}
            d="M22.97,61.36h-.71v4.99h.71v-4.99ZM25.11,64.21v-.71h-4.99v.71h4.99ZM22.97,141.39h-.71v4.99h.71v-4.99ZM25.11,144.25v-.71h-4.99v.71h4.99ZM179.37,61.36h-.71v4.99h.71v-4.99ZM181.51,64.21v-.71h-4.99v.71h4.99ZM179.37,141.39h-.71v4.99h.71v-4.99ZM181.51,144.25v-.71h-4.99v.71h4.99Z"
          />
          <ellipse
            cx="101.08"
            cy="160.08"
            rx="34.47"
            ry="12.22"
            strokeWidth={STROKE_WIDTH}
            fill={COLOR_SEC}
            stroke="currentColor"
            strokeMiterlimit="10"
          />
          <circle
            cx="101.08"
            cy="133.06"
            r="31.1"
            transform="rotate(-13.28 101.088 133.095)"
            fill="url(#radial-gradient)"
          />
          <circle
            cx="75.02"
            cy="191.39"
            r="13.84"
            transform="rotate(-84.34 75.035 191.398)"
            fill="url(#radial-gradient-2)"
          />
          <path
            transform="rotate(-90 130.52 61.63)"
            fill="url(#radial-gradient-3)"
            d="M122.04 34.28h16.97v54.7h-16.97z"
          />
          <path
            transform="rotate(-90 133.31 58.84)"
            opacity={LOW_OPACITY}
            fill="url(#radial-gradient-4)"
            d="M124.83 31.49h16.97v54.7h-16.97z"
          />
          <path
            transform="rotate(-90 136.06 56.09)"
            opacity={LOW_OPACITY}
            fill="url(#radial-gradient-5)"
            d="M127.58 28.74h16.97v54.7h-16.97z"
          />
          <path
            transform="rotate(-90 138.86 53.29)"
            opacity={LOW_OPACITY}
            fill="url(#radial-gradient-6)"
            d="M130.38 25.94h16.97v54.7h-16.97z"
          />
          <path
            transform="rotate(90 71.645 237.585)"
            fill="url(#radial-gradient-7)"
            d="M63.16 210.23h16.97v54.7H63.16z"
          />
          <path
            transform="rotate(90 68.855 240.375)"
            opacity={LOW_OPACITY}
            fill="url(#radial-gradient-8)"
            d="M60.37 213.03h16.97v54.7H60.37z"
          />
          <path
            transform="rotate(90 66.11 243.12)"
            fill="url(#radial-gradient-9)"
            opacity={LOW_OPACITY}
            d="M57.63 215.77H74.6v54.7H57.63z"
          />
          <path
            transform="rotate(90 63.305 245.925)"
            opacity={LOW_OPACITY}
            fill="url(#radial-gradient-10)"
            d="M54.82 218.58h16.97v54.7H54.82z"
          />
          <path
            fill={COLOR_SEC}
            stroke={COLOR_CURRENT}
            strokeMiterlimit={10}
            strokeWidth={STROKE_WIDTH}
            d="M139.81 188.27h33.96v33.96h-33.96z"
          />
          <path
            fill={COLOR_SEC}
            stroke={COLOR_CURRENT}
            strokeMiterlimit={10}
            strokeWidth={STROKE_WIDTH}
            d="M136.76 185.22h33.96v33.96h-33.96z"
          />
          <path
            fill={COLOR_SEC}
            stroke={COLOR_CURRENT}
            strokeMiterlimit={10}
            strokeWidth={STROKE_WIDTH}
            d="M133.71 182.17h33.96v33.96h-33.96z"
          />
          <path
            fill={COLOR_SEC}
            stroke={COLOR_CURRENT}
            strokeMiterlimit={10}
            strokeWidth={STROKE_WIDTH}
            d="M130.66 179.12h33.96v33.96h-33.96z"
          />
          <path
            stroke={COLOR_CURRENT}
            strokeMiterlimit={10}
            strokeWidth={STROKE_WIDTH}
            fill="url(#radial-gradient-13)"
            d="M127.61 176.07h33.96v33.96h-33.96z"
          />
          <path
            fill={COLOR_SEC}
            stroke={COLOR_CURRENT}
            strokeMiterlimit={10}
            strokeWidth={STROKE_WIDTH}
            d="M54.94 73.41h18.8v18.8h-18.8z"
          />
          <path
            fill={COLOR_SEC}
            stroke={COLOR_CURRENT}
            strokeMiterlimit={10}
            strokeWidth={STROKE_WIDTH}
            d="M51.56 70.04h18.8v18.8h-18.8z"
          />
          <path
            stroke="currentColor"
            strokeMiterlimit="10"
            strokeWidth={STROKE_WIDTH}
            fill="url(#radial-gradient-14)"
            d="M48.19 66.66h18.8v18.8h-18.8z"
          />
        </g>
      </svg>
    </>
  );
};

export default DesignIllustration;
