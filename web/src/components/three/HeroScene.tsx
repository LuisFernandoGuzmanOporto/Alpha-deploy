import { Stars, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { DoubleSide, MathUtils, SRGBColorSpace, type Group, type Mesh } from "three";
import earthUrl from "../globe/textures/earth.jpg";
import marsUrl from "../globe/textures/mars.jpg";
import moonUrl from "../globe/textures/moon.jpg";
import { Atmosphere } from "./Atmosphere";
import { useInView, usePrefersReducedMotion } from "./support";

/**
 * Escena del hero: la Tierra con la Luna y Marte en órbitas inclinadas, estrellas y un leve
 * paralaje con el cursor. Es decorativa (aria-hidden): toda la información está en el texto.
 */
export default function HeroScene() {
  const reduced = usePrefersReducedMotion();
  const [ref, visible] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className="hero-scene" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 9], fov: 34 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={!visible ? "never" : reduced ? "demand" : "always"}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[-2, 2, 8]} intensity={2.8} color="#fff6e8" />
        <directionalLight position={[6, -2, -4]} intensity={0.5} color="#36a3ff" />
        <Suspense fallback={null}>
          <System still={reduced} />
        </Suspense>
        <Stars radius={70} depth={40} count={1400} factor={3.2} saturation={0} fade speed={reduced ? 0 : 0.4} />
      </Canvas>
    </div>
  );
}

function System({ still }: { still: boolean }) {
  const { earth, moon, mars } = useTexture({ earth: earthUrl, moon: moonUrl, mars: marsUrl });
  for (const texture of [earth, moon, mars]) texture.colorSpace = SRGBColorSpace;
  // Anisotropía moderada: la Tierra se ve nítida en los bordes sin pesar en móviles.
  earth.anisotropy = 4;

  const rig = useRef<Group>(null);
  const earthRef = useRef<Mesh>(null);
  const moonOrbit = useRef<Group>(null);
  const marsOrbit = useRef<Group>(null);

  useFrame((state, delta) => {
    if (rig.current) {
      // Paralaje: el sistema se inclina suavemente hacia el cursor.
      rig.current.rotation.y = MathUtils.damp(rig.current.rotation.y, state.pointer.x * 0.25, 3, delta);
      rig.current.rotation.x = MathUtils.damp(rig.current.rotation.x, -state.pointer.y * 0.15, 3, delta);
    }
    if (still) return;
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.06;
    if (moonOrbit.current) moonOrbit.current.rotation.y += delta * 0.22;
    if (marsOrbit.current) marsOrbit.current.rotation.y += delta * 0.12;
  });

  return (
    <group ref={rig}>
      <group rotation={[0.18, 0, -0.32]}>
        <mesh ref={earthRef} rotation={[0, -1.2, 0]}>
          <sphereGeometry args={[1.3, 96, 96]} />
          <meshStandardMaterial map={earth} roughness={0.85} metalness={0.05} />
        </mesh>
        <Atmosphere radius={1.3} color="#36a3ff" intensity={1.25} />

        <group rotation={[0.42, 0, 0.1]}>
          <OrbitRing radius={2.2} />
          <group ref={moonOrbit} rotation={[0, -0.9, 0]}>
            <mesh position={[2.2, 0, 0]}>
              <sphereGeometry args={[0.3, 48, 48]} />
              <meshStandardMaterial map={moon} roughness={1} />
            </mesh>
          </group>
        </group>

        <group rotation={[-0.3, 0, -0.18]}>
          <OrbitRing radius={3.05} />
          <group ref={marsOrbit} rotation={[0, 0.5, 0]}>
            <mesh position={[3.05, 0, 0]}>
              <sphereGeometry args={[0.26, 48, 48]} />
              <meshStandardMaterial map={mars} roughness={1} />
            </mesh>
            <group position={[3.05, 0, 0]}>
              <Atmosphere radius={0.26} color="#e0694a" intensity={0.7} />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

function OrbitRing({ radius }: { radius: number }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.005, radius + 0.005, 160]} />
      <meshBasicMaterial color="#48dfff" transparent opacity={0.22} side={DoubleSide} depthWrite={false} />
    </mesh>
  );
}
