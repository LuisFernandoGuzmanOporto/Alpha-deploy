import { ShaderMaterial, type Texture } from "three";

/**
 * Material de la Tierra de la portada. La textura (Blue Marble) trae el océano casi negro y los bosques muy
 * oscuros, así que aquí se le da vida sin cambiar la imagen: océano azul marino sobrio con un reflejo leve del Sol, tierra
 * algo aclarada, lado nocturno suave y un borde de atmósfera discreto. La luz viene fija desde arriba a la izquierda.
 */
export function createEarthMaterial(map: Texture): ShaderMaterial {
  return new ShaderMaterial({
    uniforms: { map: { value: map } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        vUv = uv;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D map;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vView;
      const vec3 SUN = vec3(-0.48, 0.38, 0.79);
      const vec3 OCEAN_DEEP = vec3(0.008, 0.030, 0.095);
      const vec3 OCEAN_LIT = vec3(0.016, 0.075, 0.210);
      const vec3 AIR = vec3(0.200, 0.480, 0.850);
      void main() {
        vec3 tex = texture2D(map, vUv).rgb;
        vec3 n = normalize(vNormal);
        vec3 v = normalize(vView);
        vec3 sun = normalize(SUN);
        float light = dot(n, sun);
        float day = smoothstep(-0.28, 0.62, light);
        float fresnel = pow(1.0 - max(dot(n, v), 0.0), 2.6);

        // Océano: píxeles oscuros donde domina el azul.
        float lum = dot(tex, vec3(0.2126, 0.7152, 0.0722));
        float ocean = smoothstep(1.3, 2.4, tex.b / max(tex.g, 0.0004)) * (1.0 - smoothstep(0.02, 0.08, lum));

        vec3 land = pow(tex, vec3(0.80)) * 1.20;
        vec3 sea = mix(OCEAN_DEEP, OCEAN_LIT, smoothstep(0.0, 1.0, light) * 0.8 + fresnel * 0.25);
        vec3 surface = mix(land, sea, ocean);

        // Día con terminador suave; la noche conserva un azul tenue para que no quede un hueco negro.
        vec3 color = surface * (0.10 + 0.95 * day) + surface * vec3(0.05, 0.10, 0.22) * (1.0 - day);
        // Reflejo del Sol en el agua.
        float glint = pow(max(dot(n, normalize(sun + v)), 0.0), 80.0);
        color += vec3(1.0, 0.96, 0.88) * glint * ocean * 0.18;
        // Atmósfera sobre el borde del disco.
        color += AIR * fresnel * (0.10 + 0.32 * day);

        gl_FragColor = vec4(color, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
}
