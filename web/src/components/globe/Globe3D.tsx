import { Html, OrbitControls, QuadraticBezierLine, Stars, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, type KeyboardEvent } from "react";
import { MathUtils, Quaternion, SRGBColorSpace, Spherical, Vector3, type DirectionalLight, type Group, type Mesh } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Atmosphere } from "../three/Atmosphere";
import { latLonToXYZ, useInView, usePrefersReducedMotion } from "../three/support";
import type { GlobeMarker } from "./Globe";

export type Body = "earth" | "moon" | "mars";

export interface Globe3DProps {
  body: Body;
  texture: string;
  markers: GlobeMarker[];
  /** Id del marcador elegido: la cámara vuela hacia él. */
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** Cuerpo y textura del sitio, para el satélite que se une con líneas a sus análogos en la Tierra. */
  link?: { body: Exclude<Body, "earth">; texture: string; lat: number; lon: number } | null;
  label: string;
  help: string;
  /** Incrementarlo vuelve a centrar la vista en el primer marcador. */
  resetKey: number;
}

const RADIUS = 1;
const CAMERA_DIST = 4.3;
const KEY_STEP = MathUtils.degToRad(10);
const GLOW: Record<Body, { color: string; intensity: number }> = {
  earth: { color: "#36a3ff", intensity: 1.3 },
  moon: { color: "#c9d1dc", intensity: 0.35 },
  mars: { color: "#e0694a", intensity: 0.8 },
};

/** Globo WebGL con giro libre (mouse, touch y flechas), marcadores numerados y conexiones animadas. */
export function Globe3D(props: Globe3DProps) {
  const { label, help } = props;
  const reduced = usePrefersReducedMotion();
  const [ref, visible] = useInView<HTMLDivElement>();
  const keyRef = useRef<(event: KeyboardEvent<HTMLDivElement>) => void>(() => undefined);

  return (
    <div
      ref={ref}
      className="globe-canvas globe-3d"
      role="img"
      aria-label={label}
      aria-describedby="globe-3d-help"
      tabIndex={0}
      onKeyDown={(event) => keyRef.current(event)}
    >
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, CAMERA_DIST], fov: 40, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={visible ? "always" : "never"}
      >
        <ambientLight intensity={props.body === "earth" ? 0.35 : 0.45} />
        <Stars radius={60} depth={30} count={900} factor={2.6} saturation={0} fade speed={reduced ? 0 : 0.3} />
        <Suspense fallback={null}>
          <Scene {...props} reduced={reduced} keyRef={keyRef} />
        </Suspense>
      </Canvas>
      <p id="globe-3d-help" className="globe-3d__help">
        {help}
      </p>
    </div>
  );
}

interface SceneProps extends Globe3DProps {
  reduced: boolean;
  keyRef: { current: (event: KeyboardEvent<HTMLDivElement>) => void };
}

function Scene({ body, texture, markers, selectedId, onSelect, link, reduced, keyRef, resetKey }: SceneProps) {
  const map = useTexture(texture);
  map.colorSpace = SRGBColorSpace;
  map.anisotropy = 4;
  const controls = useRef<OrbitControlsImpl>(null);
  const camera = useThree((state) => state.camera);
  const flyTo = useRef<Vector3 | null>(null);
  const keyLight = useRef<DirectionalLight>(null);
  const lightOffset = useMemo(() => new Vector3(), []);

  // La lista de marcadores llega nueva en cada render: se memoriza por contenido para no recentrar la cámara.
  const markersKey = markers.map((m) => `${m.id}:${m.lat}:${m.lon}:${m.badge}`).join("|");
  const points = useMemo(
    () => markers.map((m) => ({ marker: m, position: new Vector3(...latLonToXYZ(m.lat, m.lon, RADIUS)) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [markersKey],
  );

  // Al cambiar el cuerpo, la selección o pedir "volver", la cámara vuela al marcador.
  const focusId = selectedId ?? points[0]?.marker.id ?? null;
  useEffect(() => {
    const target = points.find((p) => p.marker.id === focusId);
    const direction = target ? target.position.clone().normalize() : new Vector3(0, 0.25, 1).normalize();
    // Un poco por encima del punto para ver también las conexiones.
    flyTo.current = direction.add(new Vector3(0, 0.18, 0)).normalize().multiplyScalar(CAMERA_DIST);
    if (reduced) {
      camera.position.copy(flyTo.current);
      flyTo.current = null;
      controls.current?.update();
    }
  }, [focusId, points, body, resetKey, reduced, camera]);

  keyRef.current = (event) => {
    const dTheta = event.key === "ArrowLeft" ? -KEY_STEP : event.key === "ArrowRight" ? KEY_STEP : 0;
    const dPhi = event.key === "ArrowUp" ? -KEY_STEP : event.key === "ArrowDown" ? KEY_STEP : 0;
    if (!dTheta && !dPhi) return;
    event.preventDefault();
    flyTo.current = null;
    const spherical = new Spherical().setFromVector3(camera.position);
    spherical.theta += dTheta;
    spherical.phi = MathUtils.clamp(spherical.phi + dPhi, 0.15, Math.PI - 0.15);
    camera.position.setFromSpherical(spherical);
    controls.current?.update();
  };

  useFrame((_, delta) => {
    // La luz principal acompaña a la cámara (arriba a la izquierda): la cara visible siempre queda iluminada.
    if (keyLight.current) {
      lightOffset.set(-0.9, 0.7, 0).applyQuaternion(camera.quaternion);
      keyLight.current.position.copy(camera.position).normalize().add(lightOffset).multiplyScalar(6);
    }
    if (!flyTo.current) return;
    // Interpolación esférica: la cámara rodea el globo en vez de atravesarlo.
    const from = new Spherical().setFromVector3(camera.position);
    const to = new Spherical().setFromVector3(flyTo.current);
    let dTheta = to.theta - from.theta;
    if (dTheta > Math.PI) dTheta -= Math.PI * 2;
    if (dTheta < -Math.PI) dTheta += Math.PI * 2;
    const k = 1 - Math.exp(-4 * delta);
    from.theta += dTheta * k;
    from.phi += (to.phi - from.phi) * k;
    from.radius += (to.radius - from.radius) * k;
    camera.position.setFromSpherical(from);
    controls.current?.update();
    if (Math.abs(dTheta) < 0.002 && Math.abs(to.phi - from.phi) < 0.002) flyTo.current = null;
  });

  const targetPositions = useMemo(() => points.map((p) => p.position), [points]);
  const glow = GLOW[body];
  const satellite = body === "earth" && link ? link : null;

  return (
    <>
      <OrbitControls
        ref={controls}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.55}
        minDistance={1.8}
        maxDistance={7}
        autoRotate={!reduced && !selectedId}
        autoRotateSpeed={0.35}
        onStart={() => {
          flyTo.current = null;
        }}
      />
      <directionalLight ref={keyLight} intensity={2.4} color="#fff6e8" />
      <mesh>
        <sphereGeometry args={[RADIUS, 96, 96]} />
        <meshStandardMaterial map={map} roughness={body === "earth" ? 0.82 : 1} metalness={0.02} />
      </mesh>
      <Atmosphere radius={RADIUS} color={glow.color} intensity={glow.intensity} />

      {points.map(({ marker, position }) => (
        <Marker
          key={marker.id}
          marker={marker}
          position={position}
          selected={marker.id === selectedId}
          onSelect={onSelect}
          reduced={reduced}
        />
      ))}

      {satellite && <Satellite link={satellite} targets={targetPositions} reduced={reduced} />}
    </>
  );
}

function Marker({
  marker,
  position,
  selected,
  onSelect,
  reduced,
}: {
  marker: GlobeMarker;
  position: Vector3;
  selected: boolean;
  onSelect: (id: string) => void;
  reduced: boolean;
}) {
  const pulse = useRef<Mesh>(null);
  const label = useRef<HTMLButtonElement>(null);
  const normal = useMemo(() => position.clone().normalize(), [position]);
  const camDir = useMemo(() => new Vector3(), []);
  const isSite = marker.kind === "site";
  const color = isSite ? "#48dfff" : "#ffb566";

  useFrame((state) => {
    // El número se atenúa cuando el punto queda detrás del globo.
    camDir.copy(state.camera.position).normalize();
    const facing = normal.dot(camDir);
    if (label.current) {
      const hidden = facing < 0.08;
      label.current.style.opacity = hidden ? "0" : "1";
      label.current.style.pointerEvents = hidden ? "none" : "auto";
      label.current.tabIndex = hidden ? -1 : 0;
    }
    if (pulse.current && !reduced) {
      const t = (state.clock.elapsedTime * 0.8 + marker.lat * 0.01) % 1;
      pulse.current.scale.setScalar(1 + t * 2.4);
      (pulse.current.material as { opacity: number }).opacity = 0.55 * (1 - t);
    }
  });

  // El anillo de pulso se apoya sobre la superficie (perpendicular a la normal).
  const flat = useMemo(() => new Quaternion().setFromUnitVectors(new Vector3(0, 0, 1), normal), [normal]);

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[selected ? 0.026 : 0.019, 16, 16]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh ref={pulse} quaternion={flat}>
        <ringGeometry args={[0.022, 0.03, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} depthWrite={false} toneMapped={false} />
      </mesh>
      <Html center zIndexRange={[20, 0]} position={normal.clone().multiplyScalar(0.07)}>
        <button
          ref={label}
          type="button"
          className={`globe-pin globe-pin--${marker.kind}${selected ? " is-selected" : ""}`}
          onClick={() => onSelect(marker.id)}
          aria-pressed={selected}
          aria-label={marker.title ?? marker.id}
        >
          {marker.badge || "◆"}
        </button>
      </Html>
    </group>
  );
}

/** Luna o Marte en miniatura junto a la Tierra, con líneas animadas hacia cada análogo. */
function Satellite({
  link,
  targets,
  reduced,
}: {
  link: NonNullable<Globe3DProps["link"]>;
  targets: Vector3[];
  reduced: boolean;
}) {
  const map = useTexture(link.texture);
  map.colorSpace = SRGBColorSpace;
  const holder = useRef<Group>(null);
  const lines = useRef<({ material: { dashOffset: number } } | null)[]>([]);
  // El satélite flota sobre el centro del grupo de análogos, algo hacia el norte, para verse junto a ellos.
  const anchor = useMemo(() => {
    const centroid = targets.reduce((sum, p) => sum.add(p), new Vector3());
    if (centroid.lengthSq() < 1e-6) centroid.set(0, 0, 1);
    // Girado 40° hacia un lado: al mirar los análogos de frente, el satélite queda junto a ellos y no delante.
    centroid.normalize().applyAxisAngle(new Vector3(0, 1, 0), MathUtils.degToRad(40));
    return centroid.add(new Vector3(0, 0.45, 0)).normalize().multiplyScalar(1.7);
  }, [targets]);
  // El sitio en la superficie del satélite, girado para mirar hacia la Tierra.
  const sitePoint = useMemo(() => new Vector3(...latLonToXYZ(link.lat, link.lon, 0.2)), [link.lat, link.lon]);

  useEffect(() => {
    if (!holder.current) return;
    // Orienta el satélite para que el sitio mire hacia el centro de la Tierra.
    const toEarth = anchor.clone().negate().normalize();
    holder.current.quaternion.setFromUnitVectors(sitePoint.clone().normalize(), toEarth);
  }, [anchor, sitePoint]);

  useFrame((_, delta) => {
    if (reduced) return;
    for (const line of lines.current) if (line) line.material.dashOffset -= delta * 0.35;
  });

  const start = useMemo(() => anchor.clone().add(anchor.clone().negate().normalize().multiplyScalar(0.2)), [anchor]);

  return (
    <>
      <group position={anchor} ref={holder}>
        <mesh>
          <sphereGeometry args={[0.2, 48, 48]} />
          <meshStandardMaterial map={map} roughness={1} />
        </mesh>
        <mesh position={sitePoint}>
          <sphereGeometry args={[0.016, 12, 12]} />
          <meshBasicMaterial color="#48dfff" toneMapped={false} />
        </mesh>
      </group>
      {targets.map((end, i) => {
        const mid = start.clone().add(end).multiplyScalar(0.5);
        mid.setLength(Math.max(mid.length(), 1) + 0.45);
        return (
          <QuadraticBezierLine
            key={`${end.x}-${end.y}-${i}`}
            ref={(el) => {
              lines.current[i] = el as unknown as { material: { dashOffset: number } } | null;
            }}
            start={start}
            end={end}
            mid={mid}
            color={i === 0 ? "#ffb566" : "#48dfff"}
            lineWidth={i === 0 ? 1.8 : 1.1}
            transparent
            opacity={i === 0 ? 0.95 : 0.55 - i * 0.06}
            dashed
            dashSize={0.06}
            gapSize={0.04}
          />
        );
      })}
    </>
  );
}
