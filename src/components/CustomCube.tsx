// import { useRef } from "react";
// import { useFrame } from "@react-three/fiber";
// import * as THREE from "three";

// interface Props {
//   textures: (THREE.Texture | null)[];
//   transforms: {
//     scale: number;
//     position: { x: number; y: number };
//   }[];
//   dimensions: { x: number; y: number; z: number };
// }

// export default function CustomCube({
//   textures,
//   transforms,
//   dimensions,
// }: Props) {
//   const cubeRef = useRef<THREE.Mesh>(null!);

//   console.log("textures[0]:", textures[0]);

//   useFrame(() => {
//     if (cubeRef.current) {
//       cubeRef.current.rotation.y += 0.005;
//     }
//   });

//   const boxScale: [number, number, number] = [
//     dimensions.x / 100,
//     dimensions.y / 100,
//     dimensions.z / 100,
//   ];

//   return (
//     <mesh ref={cubeRef} scale={boxScale}>
//       <boxGeometry args={[2, 2, 2]} />
//       {Array.from({ length: 6 }).map((_, i) => (
//         <meshBasicMaterial
//           key={i}
//           attach={`material-${i}`}
//           map={textures[0] || undefined}
//           toneMapped={false}
//           transparent
//         />
//       ))}
//     </mesh>

//     // <mesh ref={cubeRef} scale={boxScale}>
//     //   <boxGeometry args={[2, 2, 2]} />

//     //   {/* Face order: +X, -X, +Y, -Y, +Z (front), -Z (back) */}

//     //   {/* Right Face (default white) */}
//     //   <meshBasicMaterial attach="material-0" color="white" />

//     //   {/* Left Face (default white) */}
//     //   <meshBasicMaterial attach="material-1" color="white" />

//     //   {/* Top Face (default white) */}
//     //   <meshBasicMaterial attach="material-2" color="white" />

//     //   {/* Bottom Face (default white) */}
//     //   <meshBasicMaterial attach="material-3" color="white" />

//     //   {/* Front Face (+Z) */}
//     //   <meshBasicMaterial
//     //     attach="material-4"
//     //     map={textures[0] || undefined}
//     //     transparent
//     //     toneMapped={false}
//     //   />

//     //   {/* Back Face (-Z) */}
//     //   <meshBasicMaterial
//     //     attach="material-5"
//     //     map={textures[1] || undefined}
//     //     transparent
//     //     toneMapped={false}
//     //   />
//     // </mesh>
//   );
// }

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  textures: (THREE.Texture | null)[];
  transforms: {
    scale: number;
    position: { x: number; y: number };
  }[];
  dimensions: { x: number; y: number; z: number };
}

export default function CustomCube({
  textures,
  transforms,
  dimensions,
}: Props) {
  const cubeRef = useRef<THREE.Mesh>(null!);

  console.log("textures[0]:", textures[0]);
  console.log("textures[1]:", textures[1]);
  console.log("Current dimensions:", dimensions);
  console.log("Current transforms:", transforms);

  useFrame(() => {
    if (cubeRef.current) {
      cubeRef.current.rotation.y += 0.005;
    }
  });

  const boxScale: [number, number, number] = useMemo(
    () => [dimensions.x / 100, dimensions.y / 100, dimensions.z / 100],
    [dimensions.x, dimensions.y, dimensions.z]
  );

  console.log("Box scale:", boxScale);

  // Create materials with proper texture handling and transforms
  const materials = useMemo(() => {
    const mats = [
      new THREE.MeshBasicMaterial({ color: "white" }), // Right Face
      new THREE.MeshBasicMaterial({ color: "white" }), // Left Face
      new THREE.MeshBasicMaterial({ color: "white" }), // Top Face
      new THREE.MeshBasicMaterial({ color: "white" }), // Bottom Face
      new THREE.MeshBasicMaterial({
        map: textures[0] || null,
        transparent: true,
        toneMapped: false,
      }), // Front Face
      new THREE.MeshBasicMaterial({
        map: textures[1] || null,
        transparent: true,
        toneMapped: false,
      }), // Back Face
    ];

    // Apply transforms to textures if they exist
    if (textures[0] && transforms[0]) {
      textures[0].needsUpdate = true;
      // Apply scale and offset to texture
      textures[0].repeat.set(transforms[0].scale, transforms[0].scale);
      textures[0].offset.set(
        transforms[0].position.x * 0.5 + 0.5,
        transforms[0].position.y * 0.5 + 0.5
      );
    }

    if (textures[1] && transforms[1]) {
      textures[1].needsUpdate = true;
      // Apply scale and offset to texture
      textures[1].repeat.set(transforms[1].scale, transforms[1].scale);
      textures[1].offset.set(
        transforms[1].position.x * 0.5 + 0.5,
        transforms[1].position.y * 0.5 + 0.5
      );
    }

    return mats;
  }, [textures, transforms]);

  return (
    <mesh ref={cubeRef} scale={boxScale}>
      <boxGeometry args={[2, 2, 2]} />
      <primitive object={materials[0]} attach="material-0" />
      <primitive object={materials[1]} attach="material-1" />
      <primitive object={materials[2]} attach="material-2" />
      <primitive object={materials[3]} attach="material-3" />
      <primitive object={materials[4]} attach="material-4" />
      <primitive object={materials[5]} attach="material-5" />
    </mesh>
  );
}
