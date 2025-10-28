import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';

function CameraOrbit() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    function onMouseMove(event: MouseEvent) {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    }
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  useFrame(() => {
    targetRotation.current.x +=
      (mouse.current.y * 0.6 - targetRotation.current.x) * 0.05;
    targetRotation.current.y +=
      (mouse.current.x * 0.6 - targetRotation.current.y) * 0.05;

    const radius = 6;
    const phi = Math.PI / 2 - targetRotation.current.x;
    const theta = targetRotation.current.y + Math.PI;

    camera.position.x = radius * Math.sin(phi) * Math.cos(theta);
    camera.position.y = radius * Math.cos(phi);
    camera.position.z = radius * Math.sin(phi) * Math.sin(theta);

    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default CameraOrbit;
