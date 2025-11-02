import { extend } from "@react-three/fiber";
import * as THREE from "three";

class AlphaSmoothMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: { map: { value: null } },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D map;
        varying vec2 vUv;
        void main() {
          vec4 texColor = texture2D(map, vUv);
          float alphaThreshold = 0.05;
          if (texColor.a < alphaThreshold) discard;
          float alphaFactor = smoothstep(alphaThreshold, alphaThreshold + 0.05, texColor.a);
          vec3 premultipliedRGB = texColor.rgb * alphaFactor;
          gl_FragColor = vec4(premultipliedRGB, texColor.a * alphaFactor);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }
}

extend({ AlphaSmoothMaterial });

// Properly typed JSX element declaration using module augmentation
declare module "@react-three/fiber" {
  interface ThreeElements {
    alphaSmoothMaterial: {
      attach?: string;
      "uniforms-map-value"?: THREE.Texture | null;
      [key: string]: unknown;
    };
  }
}

export default AlphaSmoothMaterial;
