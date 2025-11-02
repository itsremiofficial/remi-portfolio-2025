import { useRef, useEffect, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useProgress } from '@react-three/drei';

interface ReadyPingProps {
  onReady?: () => void;
}

const ReadyPing = memo(({ onReady }: ReadyPingProps) => {
  const { active } = useProgress();
  const fired = useRef(false);
  const shouldCheck = useRef(true);

  // Use effect as fallback for immediate ready state
  useEffect(() => {
    if (!fired.current && !active && onReady) {
      fired.current = true;
      shouldCheck.current = false;
      onReady();
    }
  }, [active, onReady]);

  useFrame(() => {
    // Exit immediately if already fired - stops wasting render cycles
    if (!shouldCheck.current) return;

    if (!fired.current && !active) {
      fired.current = true;
      shouldCheck.current = false;
      onReady?.();
    }
  });

  return null;
});

ReadyPing.displayName = 'ReadyPing';

export default ReadyPing;
