import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useProgress } from '@react-three/drei';

interface ReadyPingProps {
  onReady?: () => void;
}

function ReadyPing({ onReady }: ReadyPingProps) {
  const { active } = useProgress();
  const fired = useRef(false);

  useFrame(() => {
    if (!fired.current && !active) {
      fired.current = true;
      onReady?.();
    }
  });

  return null;
}

export default ReadyPing;
