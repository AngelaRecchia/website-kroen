import { ShaderMaterial } from "three";

/**
 * Shader originali Codrops / the-substance (GLSL1).
 * Three r184 li transpila per WebGL2 se non si imposta glslVersion.
 * @see https://github.com/drcmda/the-substance/blob/master/src/components/CustomMaterial.js
 */
const vertexShader = /* glsl */ `
  uniform float uScale;
  uniform float uShift;
  varying vec2 vUv;

  void main() {
    vec3 pos = position;
    pos.y = pos.y + ((sin(uv.x * 3.1415926535897932384626433832795) * uShift * 1.5) * 0.14);
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uShift;
  uniform float uScale;
  varying vec2 vUv;

  void main() {
    float angle = 1.55;
    vec2 p = (vUv - vec2(0.5, 0.5)) * (1.0 - uScale) + vec2(0.5, 0.5);
    vec2 offset = uShift / 5.5 * vec2(cos(angle), sin(angle));

    vec4 cr = texture2D(uMap, p + offset);
    vec4 cga = texture2D(uMap, p);
    vec4 cb = texture2D(uMap, p - offset);
    gl_FragColor = vec4(cr.r, cga.g, cb.b, cga.a);
  }
`;

export function createSubstanceMaterial(map) {
  const material = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uMap: { value: map },
      uScale: { value: 0 },
      uShift: { value: 0 },
    },
    transparent: false,
    depthWrite: true,
    toneMapped: false,
  });

  return material;
}
