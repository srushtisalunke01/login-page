import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ModelProps {
  color: string;
}

// 1. Cybernetic Shoe Model
export const CyberShoe = ({ color }: ModelProps) => {
  const shoeRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (shoeRef.current) {
      // Gentle floating levitation oscillation
      const elapsedTime = state.clock.getElapsedTime();
      shoeRef.current.position.y = Math.sin(elapsedTime * 2) * 0.08;
      shoeRef.current.rotation.y = elapsedTime * 0.2;
    }
  });

  return (
    <group ref={shoeRef} scale={1.2}>
      {/* Sole Plate */}
      <mesh position={[0, -0.4, 0]}>
        <boxGeometry args={[1.8, 0.15, 0.75]} />
        <meshPhysicalMaterial 
          color="#1e293b" 
          roughness={0.8} 
          metalness={0.2} 
        />
      </mesh>
      
      {/* Midsole Layer */}
      <mesh position={[0, -0.28, 0]}>
        <boxGeometry args={[1.7, 0.12, 0.72]} />
        <meshPhysicalMaterial 
          color={color} 
          roughness={0.1} 
          metalness={0.9} 
          emissive={color}
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Main Shoe Body Upper */}
      <mesh position={[-0.1, 0, 0]}>
        <boxGeometry args={[1.2, 0.5, 0.65]} />
        <meshPhysicalMaterial 
          color="#0b0f19" 
          roughness={0.5} 
          metalness={0.8} 
          clearcoat={1.0}
        />
      </mesh>

      {/* Ankle Sock Liner Collar */}
      <mesh position={[0.2, 0.35, 0]} rotation={[0, 0, -0.35]}>
        <cylinderGeometry args={[0.25, 0.28, 0.5, 16]} />
        <meshPhysicalMaterial 
          color="#1e293b" 
          roughness={0.7} 
        />
      </mesh>

      {/* Futuristic Heel Plate Grid */}
      <mesh position={[0.5, -0.05, 0]}>
        <boxGeometry args={[0.3, 0.5, 0.6]} />
        <meshPhysicalMaterial 
          color={color} 
          roughness={0.05} 
          metalness={0.95} 
          emissive={color}
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Toe Cap Guard */}
      <mesh position={[-0.7, -0.15, 0]} scale={[1, 0.8, 1.2]}>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshPhysicalMaterial 
          color="#0f172a" 
          roughness={0.2} 
          metalness={0.9} 
        />
      </mesh>
    </group>
  );
};

// 2. Cyber Propeller Drone Model
export const CyberDrone = ({ color }: ModelProps) => {
  const droneRef = useRef<THREE.Group>(null);
  const rotorsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (droneRef.current) {
      const elapsedTime = state.clock.getElapsedTime();
      droneRef.current.position.y = Math.sin(elapsedTime * 2.5) * 0.12;
      droneRef.current.rotation.y = elapsedTime * 0.25;
    }
    if (rotorsRef.current) {
      // Rapid spin propeller rotation
      rotorsRef.current.rotation.y += 0.35;
    }
  });

  return (
    <group ref={droneRef} scale={1.1}>
      {/* Center Spherical Body Core */}
      <mesh>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshPhysicalMaterial 
          color="#0b0f19" 
          roughness={0.2} 
          metalness={0.85} 
          clearcoat={1.0}
        />
      </mesh>
      
      {/* Glowing Sensor Lens */}
      <mesh position={[-0.32, 0, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Four Arm Bars */}
      <group>
        {/* Arm X */}
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.04, 0.04, 1.6, 8]} />
          <meshPhysicalMaterial color="#334155" roughness={0.4} metalness={0.8} />
        </mesh>
        {/* Arm Y */}
        <mesh rotation={[0, 0, -Math.PI / 4]}>
          <cylinderGeometry args={[0.04, 0.04, 1.6, 8]} />
          <meshPhysicalMaterial color="#334155" roughness={0.4} metalness={0.8} />
        </mesh>
      </group>

      {/* Rotors Group (Self-rotating) */}
      <group ref={rotorsRef} position={[0, 0.35, 0]}>
        {/* Rotor Shaft */}
        <mesh>
          <cylinderGeometry args={[0.025, 0.025, 0.25, 8]} />
          <meshPhysicalMaterial color="#64748b" metalness={0.9} />
        </mesh>
        
        {/* Rotor Blade 1 */}
        <mesh position={[0.45, 0.1, 0]}>
          <boxGeometry args={[0.9, 0.015, 0.06]} />
          <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={0.6} />
        </mesh>
        
        {/* Rotor Blade 2 */}
        <mesh position={[-0.45, 0.1, 0]}>
          <boxGeometry args={[0.9, 0.015, 0.06]} />
          <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* Lower Landing Skids */}
      <group position={[0, -0.4, 0]}>
        <mesh position={[0, 0, 0.2]}>
          <boxGeometry args={[0.7, 0.03, 0.03]} />
          <meshPhysicalMaterial color="#475569" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0, -0.2]}>
          <boxGeometry args={[0.7, 0.03, 0.03]} />
          <meshPhysicalMaterial color="#475569" metalness={0.9} />
        </mesh>
      </group>
    </group>
  );
};

// 3. Cyber Headphones Model
export const CyberHeadphones = ({ color }: ModelProps) => {
  const headRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (headRef.current) {
      const elapsedTime = state.clock.getElapsedTime();
      headRef.current.position.y = Math.sin(elapsedTime * 1.8) * 0.08;
      headRef.current.rotation.y = elapsedTime * 0.15;
    }
  });

  return (
    <group ref={headRef} scale={1.1}>
      {/* Headband Arch (Semi-Torus) */}
      <mesh position={[0, 0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.75, 0.05, 12, 48, Math.PI]} />
        <meshPhysicalMaterial 
          color="#0b0f19" 
          roughness={0.4} 
          metalness={0.8} 
          clearcoat={1.0}
        />
      </mesh>

      {/* Left Earcup */}
      <group position={[-0.75, 0.35, 0]}>
        {/* Outer Cylinder */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} />
          <meshPhysicalMaterial 
            color="#0f172a" 
            roughness={0.3} 
            metalness={0.95} 
            clearcoat={1.0}
          />
        </mesh>
        {/* Glow Ring Highlight */}
        <mesh position={[-0.11, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.22, 0.22, 0.03, 24]} />
          <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={0.8} />
        </mesh>
        {/* Ear Cushion */}
        <mesh position={[0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.31, 0.31, 0.08, 32]} />
          <meshPhysicalMaterial color="#334155" roughness={0.9} />
        </mesh>
      </group>

      {/* Right Earcup */}
      <group position={[0.75, 0.35, 0]}>
        {/* Outer Cylinder */}
        <mesh rotation={[0, 0, -Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} />
          <meshPhysicalMaterial 
            color="#0f172a" 
            roughness={0.3} 
            metalness={0.95} 
            clearcoat={1.0}
          />
        </mesh>
        {/* Glow Ring Highlight */}
        <mesh position={[0.11, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <cylinderGeometry args={[0.22, 0.22, 0.03, 24]} />
          <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={0.8} />
        </mesh>
        {/* Ear Cushion */}
        <mesh position={[-0.08, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <cylinderGeometry args={[0.31, 0.31, 0.08, 32]} />
          <meshPhysicalMaterial color="#334155" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
};

// 4. Quantum Plasma Core Model
export const QuantumCore = ({ color }: ModelProps) => {
  const coreRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (coreRef.current) {
      const elapsedTime = state.clock.getElapsedTime();
      coreRef.current.position.y = Math.sin(elapsedTime * 2.2) * 0.1;
      coreRef.current.rotation.y = elapsedTime * 0.3;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += 0.02;
      ring1Ref.current.rotation.y += 0.015;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= 0.025;
      ring2Ref.current.rotation.z += 0.01;
    }
  });

  return (
    <group ref={coreRef} scale={1.15}>
      {/* Central Plasma Sphere */}
      <mesh>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshPhysicalMaterial 
          color={color} 
          roughness={0.05} 
          metalness={0.95} 
          emissive={color} 
          emissiveIntensity={0.9}
        />
      </mesh>

      {/* Orbit Ring 1 */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[0.75, 0.02, 12, 64]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          roughness={0.1} 
          metalness={0.95} 
          emissive="#ffffff"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Orbit Ring 2 */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[0.55, 0.015, 12, 64]} />
        <meshPhysicalMaterial 
          color={color} 
          roughness={0.1} 
          metalness={0.95} 
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Omnidirectional point light in the core */}
      <pointLight color={color} intensity={2.5} distance={4} decay={1.5} />
    </group>
  );
};
