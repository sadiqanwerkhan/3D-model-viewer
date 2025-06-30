import { useRef, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Props expected from the parent component
interface Props {
  modelUrl: string; // URL to the GLTF 3D model
  textures: (THREE.Texture | null)[]; // Array of textures to overlay
  transforms: {
    scale: number; // Image scale
    position: { x: number; y: number }; // Image position offsets
  }[];
  dimensions: { x: number; y: number; z: number }; // Size of the model for scaling
}

export default function CustomCube({
  modelUrl,
  textures,
  transforms,
  dimensions,
}: Props) {
  // Reference to the group wrapping the model and texture planes
  const cubeRef = useRef<THREE.Group>(null!);

  // Load the 3D model using the GLTF loader from drei
  const { scene } = useGLTF(modelUrl);

  // Compute scale based on provided dimensions (normalizing to 1 unit scale)
  const boxScale: [number, number, number] = useMemo(
    () => [dimensions.x / 100, dimensions.y / 100, dimensions.z / 100],
    [dimensions.x, dimensions.y, dimensions.z]
  );

  // Generate planes with textures that overlay the cube face
  const imagePlanes = useMemo(() => {
    const faceWidth = 1;
    const faceHeight = 1;
    const zOffset = dimensions.z / 100 / 2; // Positioning planes slightly above the model's front face

    return textures.map((texture, index) => {
      if (!texture) return null;

      // Apply transform settings to the texture
      texture.repeat.set(transforms[index].scale, transforms[index].scale);
      texture.offset.set(
        transforms[index].position.x * 0.5 + 0.5, // Centered transformation
        transforms[index].position.y * 0.5 + 0.5
      );
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.needsUpdate = true;

      // Define a transparent material using the processed texture
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        toneMapped: false,
        opacity: index === 0 ? 1.0 : 0.6, // Slight transparency for the second layer
        depthWrite: false, // Prevents z-fighting issues
      });

      // Create a plane mesh to apply the texture on top of the cube
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(faceWidth, faceHeight),
        material
      );

      // Position the plane slightly in front of the cube to ensure visibility
      plane.position.set(0, 0, zOffset + index * 0.0001); // Small Z-offset stacking
      return plane;
    });
  }, [textures, transforms, dimensions.z]);

  return (
    <group ref={cubeRef} scale={boxScale}>
      {/* Render the loaded 3D model */}
      <primitive object={scene} />

      {/* Render the overlaying image planes (if available) */}
      {imagePlanes.map(
        (plane, index) => plane && <primitive key={index} object={plane} />
      )}
    </group>
  );
}
