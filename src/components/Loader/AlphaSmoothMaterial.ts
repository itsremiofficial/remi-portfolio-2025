/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-namespace */
// import { extend, ReactThreeFiber } from "@react-three/fiber";
// import * as THREE from "three";

// class AlphaSmoothMaterial extends THREE.ShaderMaterial {
//   constructor() {
//     super({
//       uniforms: { map: { value: null } },
//       vertexShader: `
//         varying vec2 vUv;
//         void main() {
//           vUv = uv;
//           gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//         }
//       `,
//       fragmentShader: `
//         uniform sampler2D map;
//         varying vec2 vUv;
//         void main() {
//           vec4 texColor = texture2D(map, vUv);
//           float alphaThreshold = 0.05;
//           if (texColor.a < alphaThreshold) discard;
//           float alphaFactor = smoothstep(alphaThreshold, alphaThreshold + 0.05, texColor.a);
//           vec3 premultipliedRGB = texColor.rgb * alphaFactor;
//           gl_FragColor = vec4(premultipliedRGB, texColor.a * alphaFactor);
//         }
//       `,
//       transparent: true,
//       side: THREE.DoubleSide,
//     });
//   }
// }

// extend({ AlphaSmoothMaterial });

// declare global {
//   namespace JSX {
//     interface IntrinsicElements {
//       alphaSmoothMaterial: ReactThreeFiber.Object3DNode<
//         AlphaSmoothMaterial,
//         typeof AlphaSmoothMaterial
//       >;
//     }
//   }
// }

// Place this file (AlphaSmoothMaterial.ts) in your project and import it once (e.g. in TexturedSphere.tsx).
// It avoids relying on internal R3F types by declaring the JSX element as `any`, which resolves the Object3DNode error.

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

// Minimal, robust JSX declaration to avoid depending on internal R3F types.
// Using `any` prevents TypeScript errors across different @react-three/fiber versions.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      alphaSmoothMaterial: any;
    }
  }
}

export default AlphaSmoothMaterial;
