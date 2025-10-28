import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import CameraOrbit from "./CameraOrbit";
import TexturedSphere from "./TexturedSphere";
import ReadyPing from "./ReadyPing";
import { useTheme } from "../../hooks/useTheme";

interface PreLoaderProps {
  onExit?: () => void;
}

const PreLoader = ({ onExit }: PreLoaderProps) => {
  const counterRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [exitTrigger, setExitTrigger] = useState(false);
  const [canvasState, setCanvasState] = useState(true);
  const [isReady, setIsReady] = useState(false);

  const { isDark } = useTheme();

  useEffect(() => {
    if (!isReady) return;

    const tl = gsap.timeline();

    tl.to(counterRef.current, { opacity: 1, duration: 0.6, delay: 2.3 });

    tl.to(
      { value: 0 },
      {
        value: 100,
        duration: 4,
        delay: 0.5,
        ease: "power3.out",
        onUpdate: function () {
          setProgress(Math.round(this.targets()[0].value));
        },
      },
      "-=0.3"
    );

    tl.to(counterRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        setExitTrigger(true);
        setTimeout(() => {
          setCanvasState(false);
        }, 3000);
      },
    });

    return () => {
      tl.kill();
    };
  }, [isReady]);

  return (
    <div className="loader fixed top-0 left-0 w-full h-screen z-[100000] pointer-events-none">
      {canvasState && (
        <Canvas
          camera={{ position: [0, 0, 6], fov: 50 }}
          className="pointer-events-none"
        >
          <color attach="background" args={[isDark ? "#1c222f" : "#ece9e1"]} />
          <Suspense fallback={null}>
            <ReadyPing onReady={() => setIsReady(true)} />
            {window.innerWidth > 1100 ? <CameraOrbit /> : null}
            <TexturedSphere exitTrigger={exitTrigger} onExitComplete={onExit} />
          </Suspense>
        </Canvas>
      )}

      <div
        ref={counterRef}
        className="absolute left-1/2 -translate-x-1/2 font-bold text-[26px] leading-[77%] tracking-wider uppercase opacity-0
                   bottom-[250px] 
                   max-[1900px]:max-h-[700px]:min-w-[1100px]:bottom-[100px]
                   max-lg:bottom-[10px] max-lg:text-[18px] text-foreground text-mono"
      >
        {progress}%
      </div>
    </div>
  );
};

export default PreLoader;
