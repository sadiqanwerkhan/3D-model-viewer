import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface Props {
  textures: THREE.Texture[];
}

function Model({ textures }: Props) {
  const { scene } = useGLTF(
    "https://raw.githubusercontent.com/oneone-studio/interview-assets/refs/heads/main/model.glb"
  );

  useEffect(() => {
    if (textures.length === 0) return;

    const mesh = scene.getObjectByProperty("type", "Mesh") as THREE.Mesh;
    if (!mesh) return;

    mesh.material = new THREE.MeshBasicMaterial({
      map: textures[0],
      transparent: true,
    });
  }, [scene, textures]);

  return <primitive object={scene} />;
}

export default function ModelViewer({ textures }: Props) {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight />
      <OrbitControls />
      <Model textures={textures} />
    </Canvas>
  );
}
