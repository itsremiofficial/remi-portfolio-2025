import { useTheme } from "../../hooks/useTheme";

const DevIllustration: React.FC<IllustrationProps> = ({ className }) => {
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
        <g clipPath="url(#deva)">
          <mask
            id="devb"
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
          <g mask="url(#devb)">
            <path
              stroke={COLOR_CURRENT}
              strokeMiterlimit={10}
              strokeWidth={0.5}
              d="m166.099 247.55-29.17-40.58m17.33 40.58-23.87-40.58m12.03 40.58-18.57-40.58m6.73 40.58-13.26-40.58m1.41 40.58-7.95-40.58m-3.89 40.58-2.65-40.58m-9.19 40.58 2.66-40.58m-14.5 40.58 7.96-40.58m-19.8 40.58 13.26-40.58m-25.1 40.58 18.56-40.58m-30.4 40.58 23.87-40.58m-35.71 40.58 29.17-40.58m-38.33 36.97h148.57m-146.87-1.99h145.17m-143.47-1.99h141.77m-140.08-1.99h138.38m-136.68-1.99h134.98m-133.28-1.99h131.59m-129.89-1.98h128.19m-126.49-1.99h124.79m-123.09-1.99h121.39m-119.7-1.99h118m-116.3-1.99h114.6m-112.9-1.99h111.21m-109.51-1.99h107.81m-106.11-1.98h104.41m-102.71-1.99h101.01m-99.31-1.99h97.61m-95.92-1.99h94.22m-92.52-1.99h90.83m-89.13-1.99h87.43m33.65 39.41H23.609l34.65-40.58h85.43z"
            />
            <path
              fill="url(#devc)"
              d="M151.5 140.82a9.26 9.26 0 1 0 0-18.52 9.26 9.26 0 0 0 0 18.52"
            />
            <path
              fill={COLOR_CURRENT}
              d="M21.04 198.39h2.4v.8h-2.4v2.4h-.8v-2.4h-2.4v-.8h2.4v-2.4h.8zm155.84-2.4h-.8v2.4h-2.41v.8h2.41v2.4h.8v-2.4h2.39v-.8h-2.39zM21.04 52.93h-.8v2.4h-2.39v.8h2.39v2.4h.8v-2.4h2.41v-.8h-2.41zm155.84 2.41v-2.41h-.8v2.41h-2.4v.8h2.4v2.39h.8v-2.39h2.4v-.8z"
            />
            <path
              fill={COLOR_SEC}
              stroke={COLOR_CURRENT}
              strokeMiterlimit={10}
              strokeWidth={0.4}
              d="M100.97 228.07c-27.14 0-49.14-2.27-49.14-5.07s22-5.07 49.14-5.07 49.14 2.27 49.14 5.07-22 5.07-49.14 5.07Z"
            />
            <path fill="url(#devd)" d="M51.09 171.22 98.9 223.7v-41.84z" />
            <path fill="url(#deve)" d="M146.72 171.22 98.9 181.86v41.84z" />
            <path
              fill="url(#devf)"
              d="m51.09 171.22 47.64-10.33 47.99 10.33-47.82 10.64z"
            />
            <path
              fill="url(#devg)"
              d="M98.9 165.36c8.285 0 15-6.716 15-15s-6.715-15-15-15-15 6.716-15 15 6.716 15 15 15"
            />
            <path fill="url(#devh)" d="M98.9 55.19v74.29l47.82-10.65z" />
            <path fill="url(#devi)" d="M98.9 55.19v74.29l-47.81-10.65z" />
            <path
              fill="url(#devj)"
              d="M98.9 174.17c9.765 0 17.681-1.768 17.681-3.95s-7.916-3.95-17.68-3.95c-9.765 0-17.68 1.768-17.68 3.95s7.915 3.95 17.68 3.95"
              opacity={0.3}
            />
            <path
              fill="url(#devk)"
              d="M75.329 110.339c8.647-4.534 14.836-9.776 13.823-11.708s-8.844.177-17.492 4.712c-8.648 4.534-14.837 9.776-13.824 11.708s8.845-.178 17.493-4.712"
              opacity={0.3}
            />
            <path
              fill="url(#devl)"
              d="M62.03 108.3c9.19 0 16.64-7.45 16.64-16.64s-7.45-16.64-16.64-16.64-16.64 7.45-16.64 16.64 7.45 16.64 16.64 16.64"
            />
          </g>
        </g>
        <defs>
          <radialGradient
            id="devc"
            cx={0}
            cy={0}
            r={1}
            gradientTransform="translate(155.04 128.04)scale(15.44)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#D9A3A3" />
            <stop offset={0.43} stopColor="#D93535" />
            <stop offset={1} />
          </radialGradient>
          <radialGradient
            id="devd"
            cx={0}
            cy={0}
            r={1}
            gradientTransform="translate(58.04 224.16)scale(71.7)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#1C222F" />
            <stop offset={1} stopColor="#D93535" />
          </radialGradient>
          <radialGradient
            id="deve"
            cx={0}
            cy={0}
            r={1}
            gradientTransform="translate(100.69 178.03)scale(53.56)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#1C222F" />
            <stop offset={1} stopColor="#D93535" />
          </radialGradient>
          <radialGradient
            id="devf"
            cx={0}
            cy={0}
            r={1}
            gradientTransform="translate(98.91 171.38)scale(34.61)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#1C222F" />
            <stop offset={1} stopColor="#D93535" />
          </radialGradient>
          <radialGradient
            id="devg"
            cx={0}
            cy={0}
            r={1}
            gradientTransform="translate(104.65 144.66)scale(25.02)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#D9A3A3" />
            <stop offset={0.43} stopColor="#D93535" />
            <stop offset={1} />
          </radialGradient>
          <radialGradient
            id="devh"
            cx={0}
            cy={0}
            r={1}
            gradientTransform="translate(91.61 128.29)scale(86.88)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#1C222F" />
            <stop offset={1} stopColor="#D93535" />
          </radialGradient>
          <radialGradient
            id="devi"
            cx={0}
            cy={0}
            r={1}
            gradientTransform="translate(18.5 70.47)scale(114.39)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#1C222F" />
            <stop offset={1} stopColor="#D93535" />
          </radialGradient>
          <radialGradient
            id="devj"
            cx={0}
            cy={0}
            r={1}
            gradientTransform="matrix(18.88822 -.88414 .15332 3.27541 93.617 170.583)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopOpacity={0.99} />
            <stop offset={0.86} stopOpacity={0} />
          </radialGradient>
          <radialGradient
            id="devk"
            cx={0}
            cy={0}
            r={1}
            gradientTransform="matrix(16.31753 -9.5543 1.65682 2.82963 61.209 114.162)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopOpacity={0.99} />
            <stop offset={0.86} stopOpacity={0} />
          </radialGradient>
          <radialGradient
            id="devl"
            cx={0}
            cy={0}
            r={1}
            gradientTransform="translate(65.78 85.23)scale(26.43)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#D9A3A3" />
            <stop offset={0.43} stopColor="#D93535" />
            <stop offset={1} />
          </radialGradient>
          <clipPath id="deva">
            <path fill={COLOR_CURRENT} d="M0 0h201.95v300H0z" />
          </clipPath>
        </defs>
      </svg>
    </>
  );
};

export default DevIllustration;
