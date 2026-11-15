import { useMemo } from "react";
import { AdditiveBlending, BackSide, Color, ShaderMaterial } from "three";

/** Halo de atmósfera con efecto Fresnel: una esfera algo mayor, dibujada por dentro y sumando luz. */
export function Atmosphere({ radius, color, intensity = 1 }: { radius: number; color: string; intensity?: number }) {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: { glowColor: { value: new Color(color) }, intensity: { value: intensity } },
        vertexShader: /* glsl */ `
          varying vec3 vNormal;
          varying vec3 vView;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vNormal = normalize(normalMatrix * normal);
            vView = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: /* glsl */ `
          uniform vec3 glowColor;
          uniform float intensity;
          varying vec3 vNormal;
          varying vec3 vView;
          void main() {
            float rim = pow(1.0 - abs(dot(vNormal, vView)), 3.0);
            gl_FragColor = vec4(glowColor, rim * intensity);
          }`,
        side: BackSide,
        blending: AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
    [color, intensity],
  );
  return (
    <mesh scale={1.14} material={material}>
      <sphereGeometry args={[radius, 48, 48]} />
    </mesh>
  );
}
