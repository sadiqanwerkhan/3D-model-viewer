import { useState } from "react";
import ModelViewer from "./components/ModelViewer";
import ImageUploader from "./components/ImageUploader";
import { quantizeToTwoColors } from "./utils/quantizeImage";
import * as THREE from "three";

export default function App() {
  const [textures, setTextures] = useState<THREE.Texture[]>([]);
  const [imageTransform, setImageTransform] = useState({
    scale: 0.5,
    position: { x: 0, y: 0 },
  });

  const handleUpload = async (files: File[]) => {
    const canvases = await Promise.all(files.map(quantizeToTwoColors));
    const texList = canvases.map((canvas) => new THREE.CanvasTexture(canvas));
    setTextures(texList);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 border-r">
        <div className="space-y-4 p-4">
          <label className="block">
            Scale:
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.01"
              value={imageTransform.scale}
              onChange={(e) =>
                setImageTransform({
                  ...imageTransform,
                  scale: parseFloat(e.target.value),
                })
              }
            />
          </label>

          <label className="block">
            Position X:
            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              value={imageTransform.position.x}
              onChange={(e) =>
                setImageTransform({
                  ...imageTransform,
                  position: {
                    ...imageTransform.position,
                    x: parseFloat(e.target.value),
                  },
                })
              }
            />
          </label>

          <label className="block">
            Position Y:
            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              value={imageTransform.position.y}
              onChange={(e) =>
                setImageTransform({
                  ...imageTransform,
                  position: {
                    ...imageTransform.position,
                    y: parseFloat(e.target.value),
                  },
                })
              }
            />
          </label>
        </div>

        <ImageUploader onUpload={handleUpload} />
      </div>
      <div className="flex-1">
        <ModelViewer textures={textures} imageTransform={imageTransform} />
      </div>
    </div>
  );
}
