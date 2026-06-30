import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useNexusStore } from '../store/nexusStore';

interface NexusLogo3DProps {
  isZoomed: boolean;
}

// Maps client theme names to active 3D colors and lights
const THEME_COLORS: Record<string, { primary: string; secondary: string; core: string; ambient: string }> = {
  'luxury-black': { primary: '#d4af37', secondary: '#f3f4f6', core: '#ffffff', ambient: '#d4af37' },
  'cyberpunk': { primary: '#ffe600', secondary: '#ff007f', core: '#00ffcc', ambient: '#ff007f' },
  'galaxy': { primary: '#a855f7', secondary: '#06b6d4', core: '#ffffff', ambient: '#a855f7' },
  'aurora': { primary: '#10b981', secondary: '#22d3ee', core: '#ffffff', ambient: '#10b981' },
  'matrix': { primary: '#00ff00', secondary: '#10b981', core: '#00ff00', ambient: '#00ff00' },
  'ocean': { primary: '#0284c7', secondary: '#38bdf8', core: '#ffffff', ambient: '#0284c7' },
};

// GPU-friendly single-buffer background particle field
const FloatingParticles = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 250;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 12;
    }
    return pos;
  }, []);

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0006;
      pointsRef.current.rotation.x += 0.0003;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#ffffff"
        sizeAttenuation
        transparent
        opacity={0.4}
        depthWrite={false}
      />
    </points>
  );
};

// Camera zooms through logo portal on login
const CameraAnimator = ({ isZoomed }: { isZoomed: boolean }) => {
  useFrame((state) => {
    const camera = state.camera as THREE.PerspectiveCamera;
    if (isZoomed) {
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, 0.04, 0.06);
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.06);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0, 0.06);
      camera.fov = THREE.MathUtils.lerp(camera.fov, 8, 0.06);
      camera.updateProjectionMatrix();
    } else {
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, 5.2, 0.04);
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.04);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0, 0.04);
      camera.fov = THREE.MathUtils.lerp(camera.fov, 55, 0.04);
      camera.updateProjectionMatrix();
    }
  });
  return null;
};

const LogoGroup = ({ isZoomed }: { isZoomed: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  
  const theme = useNexusStore((state) => state.theme);
  const colors = THEME_COLORS[theme] || THEME_COLORS['luxury-black'];

  useFrame((state) => {
    if (!groupRef.current) return;

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += 0.0035;
      ring1Ref.current.rotation.y += 0.0018;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= 0.0055;
      ring2Ref.current.rotation.z += 0.0028;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z += 0.007;
      ring3Ref.current.rotation.x -= 0.0035;
    }

    if (!isZoomed) {
      const targetX = state.pointer.y * 0.45;
      const targetY = state.pointer.x * 0.45;

      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.05);

      const elapsedTime = state.clock.getElapsedTime();
      groupRef.current.position.y = Math.sin(elapsedTime * 1.3) * 0.15;
    } else {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.08);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.08);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, 0.08);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer Ring */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.8, 0.05, 16, 100]} />
        <meshPhysicalMaterial 
          color={colors.primary} 
          roughness={0.08} 
          metalness={0.92} 
          emissive={colors.primary}
          emissiveIntensity={0.65}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
        />
      </mesh>

      {/* Middle Ring */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.3, 0.035, 16, 100]} />
        <meshPhysicalMaterial 
          color={colors.secondary} 
          roughness={0.03} 
          metalness={0.97} 
          emissive={colors.secondary}
          emissiveIntensity={0.25}
          clearcoat={1.0}
        />
      </mesh>

      {/* Inner Ring */}
      <mesh ref={ring3Ref}>
        <torusGeometry args={[0.8, 0.025, 16, 100]} />
        <meshPhysicalMaterial 
          color={colors.primary} 
          roughness={0.08} 
          metalness={0.92} 
          emissive={colors.primary}
          emissiveIntensity={0.75}
          clearcoat={1.0}
        />
      </mesh>

      {/* Center Sphere Core */}
      <mesh>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshBasicMaterial color={colors.core} />
      </mesh>

      {/* Internal lights inside logo */}
      <pointLight position={[0, 0, 0]} intensity={3.5} color={colors.core} distance={4} decay={1.5} />
      <pointLight position={[0, 0, 0]} intensity={2.5} color={colors.primary} distance={6} decay={1.5} />
      <pointLight position={[0, 0, 0]} intensity={2.5} color={colors.secondary} distance={6} decay={1.5} />
    </group>
  );
};

export default function NexusLogo3D({ isZoomed }: NexusLogo3DProps) {
  const theme = useNexusStore((state) => state.theme);
  const colors = THEME_COLORS[theme] || THEME_COLORS['luxury-black'];

  return (
    <div className="absolute inset-0 w-full h-full z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.18} />
        
        {/* Lights mapped to theme colors */}
        <directionalLight position={[5, 5, 5]} intensity={1.8} color="#ffffff" />
        <pointLight position={[-8, 5, -5]} color={colors.primary} intensity={1.2} />
        <pointLight position={[8, -5, 5]} color={colors.ambient} intensity={1.2} />
        
        <LogoGroup isZoomed={isZoomed} />
        <FloatingParticles />
        <CameraAnimator isZoomed={isZoomed} />
      </Canvas>
    </div>
  );
}
