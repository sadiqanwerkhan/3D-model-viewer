import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function Model() {
  const { scene } = useGLTF("/model.glb");
  return <primitive object={scene} />;
}

export default function ModelViewer() {
  const [modelUrl, setModelUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/oneone-studio/interview-assets/refs/heads/main/api.json"
    )
      .then((res) => res.json())
      .then((data) => setModelUrl(data.model));
  }, []);

  return (
    <div className="w-screen h-screen">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight />
        <OrbitControls />
        {modelUrl && <Model key={modelUrl} />}
      </Canvas>
    </div>
  );
}
