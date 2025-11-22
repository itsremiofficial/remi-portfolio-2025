import * as THREE from "three";
import { extend } from "@react-three/fiber";

// Custom Bent Plane Geometry
export class BentPlaneGeometry extends THREE.PlaneGeometry {
  constructor(
    radius: number,
    ...args: ConstructorParameters<typeof THREE.PlaneGeometry>
  ) {
    super(...args);

    const width = this.parameters.width;
    const halfWidth = width * 0.5;

    const p1 = new THREE.Vector2(-halfWidth, 0);
    const p2 = new THREE.Vector2(0, radius);
    const p3 = new THREE.Vector2(halfWidth, 0);

    const v1 = new THREE.Vector2().subVectors(p1, p2);
    const v2 = new THREE.Vector2().subVectors(p2, p3);
    const v3 = new THREE.Vector2().subVectors(p1, p3);

    const circleRadius =
      (v1.length() * v2.length() * v3.length()) / (2 * Math.abs(v1.cross(v2)));

    const center = new THREE.Vector2(0, radius - circleRadius);
    const angleTotal =
      2 * (new THREE.Vector2().subVectors(p1, center).angle() - 0.5 * Math.PI);

    const uvAttr = this.attributes.uv;
    const posAttr = this.attributes.position;
    const point = new THREE.Vector2();

    for (let i = 0; i < uvAttr.count; i++) {
      const u = 1 - uvAttr.getX(i);
      const y = posAttr.getY(i);

      point.copy(p3).rotateAround(center, angleTotal * u);
      posAttr.setXYZ(i, point.x, y, -point.y);
    }

    posAttr.needsUpdate = true;
  }
}

// Sine-Wave Animated Material
export class MeshSineMaterial extends THREE.MeshBasicMaterial {
  time: { value: number };

  constructor(params: THREE.MeshBasicMaterialParameters = {}) {
    super(params);
    this.setValues(params);
    this.time = { value: 0 };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onBeforeCompile(shader: any) {
    shader.uniforms.time = this.time;
    shader.vertexShader = `
      uniform float time;
      ${shader.vertexShader}
    `;

    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      // Wave amplitude: divided by higher number = less wavy (currently /12.0)
      // Wave frequency: PI * higher number = more waves (currently * 4.0)
      `vec3 transformed = vec3(position.x, position.y + sin(time + uv.x * PI * 4.0) / 12.0, position.z);`
    );
  }
}

// Register extensions
extend({ BentPlaneGeometry, MeshSineMaterial });

// Declare module for TypeScript
declare module "@react-three/fiber" {
  interface ThreeElements {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bentPlaneGeometry: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    meshSineMaterial: any;
  }
}
