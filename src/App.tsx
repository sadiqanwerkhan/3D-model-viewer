import { useState } from "react";
import ModelViewer from "./components/ModelViewer";
import ImageUploader from "./components/ImageUploader";
import { quantizeToTwoColors } from "./utils/quantizeImage";
import * as THREE from "three";

export default function App() {
  const [textures, setTextures] = useState<THREE.Texture[]>([]);

  const handleUpload = async (files: File[]) => {
    const canvases = await Promise.all(files.map(quantizeToTwoColors));
    const texList = canvases.map((canvas) => new THREE.CanvasTexture(canvas));
    setTextures(texList);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 border-r">
        <ImageUploader onUpload={handleUpload} />
      </div>
      <div className="flex-1">
        <ModelViewer textures={textures} />
      </div>
    </div>
  );
}
