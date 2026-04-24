import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleSystemProps {
  count?: number;
  color: string;
  secondaryColor?: string;
  shape: 'petals' | 'spheres' | 'embers' | 'bubbles' | 'leaves' | 'steam' | 'spices';
  spread: [number, number, number];
  speed?: number;
  size?: number;
  opacity?: number;
  rising?: boolean;
}

function Particles({ 
  count = 100, 
  color, 
  secondaryColor, 
  shape, 
  spread, 
  speed = 0.5, 
  size = 0.1,
  opacity = 0.6,
  rising = false
}: ParticleSystemProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => {
      const x = (Math.random() - 0.5) * spread[0];
      const y = (Math.random() - 0.5) * spread[1];
      const z = (Math.random() - 0.5) * spread[2];
      
      return {
        position: new THREE.Vector3(x, y, z),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.005 * speed,
          rising ? (Math.random() * 0.01 * speed + 0.005) : (Math.random() - 0.5) * 0.005 * speed,
          (Math.random() - 0.5) * 0.005 * speed
        ),
        rotation: new THREE.Vector3(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ),
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
        scale: 0.5 + Math.random() * 1,
        phase: Math.random() * Math.PI * 2,
        life: Math.random(),
      };
    });
  }, [count, spread, speed, rising]);

  const colors = useMemo(() => {
    const c1 = new THREE.Color(color);
    const c2 = new THREE.Color(secondaryColor || color);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const c = Math.random() > 0.7 ? c2 : c1;
      arr[i * 3] = c.r;
      arr[i * 3 + 1] = c.g;
      arr[i * 3 + 2] = c.b;
    }
    return arr;
  }, [count, color, secondaryColor]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    particles.forEach((p, i) => {
      // Basic movement
      p.position.x += p.velocity.x + Math.sin(time * 0.2 + p.phase) * 0.003;
      p.position.y += p.velocity.y;
      p.position.z += p.velocity.z + Math.cos(time * 0.2 + p.phase) * 0.003;

      // Wrap around logic
      if (rising) {
        if (p.position.y > spread[1] / 2) {
          p.position.y = -spread[1] / 2;
          p.position.x = (Math.random() - 0.5) * spread[0];
        }
      } else {
        if (p.position.y > spread[1] / 2) p.position.y = -spread[1] / 2;
        if (p.position.y < -spread[1] / 2) p.position.y = spread[1] / 2;
      }
      
      if (p.position.x > spread[0] / 2) p.position.x = -spread[0] / 2;
      if (p.position.x < -spread[0] / 2) p.position.x = spread[0] / 2;
      if (p.position.z > spread[2] / 2) p.position.z = -spread[2] / 2;
      if (p.position.z < -spread[2] / 2) p.position.z = spread[2] / 2;

      // Rotation
      p.rotation.x += p.rotSpeed.x;
      p.rotation.y += p.rotSpeed.y;
      p.rotation.z += p.rotSpeed.z;

      // Pulse scale for steam/embers
      const s = size * p.scale * (shape === 'steam' ? (0.8 + Math.sin(time + p.phase) * 0.2) : 1);

      dummy.position.copy(p.position);
      dummy.rotation.set(p.rotation.x, p.rotation.y, p.rotation.z);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  const geometry = useMemo(() => {
    switch (shape) {
      case 'petals':
        return new THREE.PlaneGeometry(1, 1);
      case 'spheres':
      case 'steam':
        return new THREE.SphereGeometry(0.5, 12, 12);
      case 'embers':
        return new THREE.TetrahedronGeometry(0.5, 0);
      case 'bubbles':
        return new THREE.SphereGeometry(0.5, 8, 8);
      case 'leaves':
        return new THREE.ConeGeometry(0.4, 1, 3);
      case 'spices':
        return new THREE.DodecahedronGeometry(0.5, 0);
      default:
        return new THREE.SphereGeometry(0.5, 8, 8);
    }
  }, [shape]);

  return (
    <instancedMesh ref={meshRef} args={[geometry, undefined, count]}>
      <meshStandardMaterial
        vertexColors
        transparent
        opacity={opacity}
        roughness={shape === 'steam' ? 1 : 0.4}
        metalness={shape === 'embers' ? 0.8 : 0.1}
        emissive={shape === 'embers' ? new THREE.Color(color) : new THREE.Color(0,0,0)}
        emissiveIntensity={shape === 'embers' ? 2 : 0}
      />
      <instancedBufferAttribute attach="instanceColor" args={[colors, 3]} />
    </instancedMesh>
  );
}

interface Scene3DProps {
  variant: string;
  className?: string;
}

const sceneConfigs: Record<string, ParticleSystemProps> = {
  sakura: {
    count: 100,
    color: '#FFB7C5',
    secondaryColor: '#FF69B4',
    shape: 'petals',
    spread: [15, 10, 8],
    speed: 0.2,
    size: 0.12,
    opacity: 0.7,
  },
  trattoria: {
    count: 60,
    color: '#7B8E45',
    secondaryColor: '#A52A2A',
    shape: 'leaves',
    spread: [12, 10, 8],
    speed: 0.3,
    size: 0.1,
    opacity: 0.6,
  },
  grillhouse: {
    count: 120,
    color: '#FF4500',
    secondaryColor: '#FFD700',
    shape: 'embers',
    spread: [10, 12, 8],
    speed: 1.2,
    size: 0.05,
    opacity: 0.8,
    rising: true,
  },
  lamaison: {
    count: 40,
    color: '#D4AF37',
    secondaryColor: '#F5F5DC',
    shape: 'spheres',
    spread: [15, 10, 8],
    speed: 0.1,
    size: 0.08,
    opacity: 0.4,
  },
  spiceroute: {
    count: 100,
    color: '#D2691E',
    secondaryColor: '#FF8C00',
    shape: 'spices',
    spread: [12, 10, 8],
    speed: 0.5,
    size: 0.08,
    opacity: 0.7,
  },
  morningbrew: {
    count: 50,
    color: '#FFFFFF',
    secondaryColor: '#E8DCC4',
    shape: 'steam',
    spread: [10, 15, 8],
    speed: 0.4,
    size: 0.3,
    opacity: 0.2,
    rising: true,
  },
  booknook: {
    count: 40,
    color: '#8B4513',
    secondaryColor: '#DEB887',
    shape: 'leaves', // subtle floating dust/paper
    spread: [15, 10, 8],
    speed: 0.1,
    size: 0.06,
    opacity: 0.3,
  },
  sunlitgarden: {
    count: 80,
    color: '#90EE90',
    secondaryColor: '#FFFFE0',
    shape: 'petals',
    spread: [15, 10, 10],
    speed: 0.2,
    size: 0.1,
    opacity: 0.6,
  },
  urbangrind: {
    count: 60,
    color: '#FFFFFF',
    secondaryColor: '#3E2723',
    shape: 'steam',
    spread: [12, 15, 8],
    speed: 0.5,
    size: 0.25,
    opacity: 0.15,
    rising: true,
  },
  seasidemornings: {
    count: 100,
    color: '#B0E0E6',
    secondaryColor: '#FFFFFF',
    shape: 'bubbles',
    spread: [15, 12, 10],
    speed: 0.4,
    size: 0.1,
    opacity: 0.4,
    rising: true,
  },
};

export default function ParticleScene({ variant, className }: Scene3DProps) {
  const config = sceneConfigs[variant] || sceneConfigs.lamaison;

  return (
    <div className={className} style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color={config.color} />
        <Particles {...config} />
      </Canvas>
    </div>
  );
}

