import { useRef, useEffect, memo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';

const CameraOrbit = memo(() => {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const frameCountRef = useRef(0);

  useEffect(() => {
    // Cache window dimensions to avoid repeated access
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Throttle mousemove - update every ~16ms (60fps max)
    let rafId: number | null = null;
    let lastX = 0;
    let lastY = 0;

    function onMouseMove(event: MouseEvent) {
      lastX = event.clientX;
      lastY = event.clientY;

      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        mouse.current.x = (lastX / windowWidth) * 2 - 1;
        mouse.current.y = (lastY / windowHeight) * 2 - 1;
        rafId = null;
      });
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  useFrame(() => {
    // Skip every other frame for smoother performance (30fps orbit is still smooth)
    frameCountRef.current++;
    if (frameCountRef.current % 2 !== 0) return;

    // Lerp target rotation
    targetRotation.current.x +=
      (mouse.current.y * 0.6 - targetRotation.current.x) * 0.05;
    targetRotation.current.y +=
      (mouse.current.x * 0.6 - targetRotation.current.y) * 0.05;

    // Constants
    const radius = 6;
    const halfPi = Math.PI * 0.5;

    // Calculate spherical coordinates
    const phi = halfPi - targetRotation.current.x;
    const theta = targetRotation.current.y + Math.PI;

    // Cache trigonometric calculations
    const sinPhi = Math.sin(phi);
    const cosPhi = Math.cos(phi);
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    // Update camera position
    camera.position.x = radius * sinPhi * cosTheta;
    camera.position.y = radius * cosPhi;
    camera.position.z = radius * sinPhi * sinTheta;

    camera.lookAt(0, 0, 0);
  });

  return null;
});

CameraOrbit.displayName = 'CameraOrbit';

export default CameraOrbit;
