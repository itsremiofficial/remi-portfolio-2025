import { useMemo, type FC, type ReactNode } from "react";

interface SquircleProps {
  width?: number;
  height?: number;
  roundness?: number;
  color?: string;
  children?: ReactNode;
}

const Squircle: FC<SquircleProps> = ({
  width = 100,
  height,
  roundness = 1,
  color = "#7788aa",
  children,
}) => {
  const w = width;
  const h = height || width;

  const path = useMemo(() => {
    const wm = w * (h / w);
    const r = -(w / 20) + (w / 10) * roundness;
    const p = `
      M ${w / 2},0
      C ${r},0        0,${r}        0,${wm / 2} 
        0,${wm - r}     ${r},${wm}    ${w / 2},${wm} 
        ${w - r},${wm}  ${w},${wm - r}  ${w},${wm / 2} 
        ${w},${r}     ${w - r},0      ${w / 2},0
    `;
    return p.replace(/  +/g, " ").replace(/\n/gi, "");
  }, [w, h, roundness]);

  const svg = useMemo(() => {
    const s = `<svg xmlns='http://www.w3.org/2000/svg'><path d='${path}' fill='${color}'></path></svg>`;
    return s.replace(/#/g, "%23").replace(/</g, "%3C").replace(/>/g, "%3E");
  }, [path, color]);

  const bgImage = `url("data:image/svg+xml;utf8,${svg}")`;

  return (
    <div
      className="squircle"
      style={{
        width: `${w}px`,
        height: `${h}px`,
        backgroundImage: bgImage,
      }}
    >
      {children}
    </div>
  );
};

export default Squircle;
