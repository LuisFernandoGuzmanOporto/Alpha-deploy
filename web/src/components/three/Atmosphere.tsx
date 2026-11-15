import { useMemo } from "react";
import { AdditiveBlending, BackSide, Color, ShaderMaterial } from "three";

interface Props {
  radius: number;
  color: string;
  intensity?: number;
  /** Tamaño del halo respecto al planeta. */
  scale?: number;
  /** "rim": aro que brilla más en el borde exterior. "halo": resplandor pegado al planeta que se apaga hacia fuera. */
  falloff?: "rim" | "halo";
}

/** Halo de atmósfera con efecto Fresnel: una esfera algo mayor, dibujada por dentro y sumando luz. */
export function Atmosphere({ radius, color, intensity = 1, scale = 1.14, falloff = "rim" }: Props) {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          glowColor: { value: new Color(color) },
          intensity: { value: intensity },
          // Valor de |n·v| justo donde el halo toca el borde del planeta: ahí el resplandor es máximo.
          limb: { value: Math.sqrt(1 - 1 / (scale * scale)) },
          halo: { value: falloff === "halo" ? 1 : 0 },
        },
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
          uniform float limb;
          uniform float halo;
          varying vec3 vNormal;
          varying vec3 vView;
          void main() {
            float facing = abs(dot(vNormal, vView));
            float rim = pow(1.0 - facing, 3.0);
            float soft = pow(clamp(facing / limb, 0.0, 1.0), 2.4);
            gl_FragColor = vec4(glowColor, mix(rim, soft, halo) * intensity);
          }`,
        side: BackSide,
        blending: AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
    [color, intensity, scale, falloff],
  );
  return (
    <mesh scale={scale} material={material}>
      <sphereGeometry args={[radius, 48, 48]} />
    </mesh>
  );
}
