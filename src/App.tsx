import { useState } from "react";
import ModelViewer from "./components/ModelViewer";
import ImageUploader from "./components/ImageUploader";
import { quantizeToTwoColors } from "./utils/quantizeImage";
import { mergeCanvases } from "./utils/mergeCanvases";
import * as THREE from "three";

export default function App() {
  const [textures, setTextures] = useState<THREE.Texture[]>([]);
  const [imageTransform, setImageTransform] = useState({
    scale: 0.5,
    position: { x: 0, y: 0 },
  });

  const [dimensions, setDimensions] = useState({
    x: 100,
    y: 100,
    z: 100,
  });

  const handleUpload = async (files: File[]) => {
    const canvases = await Promise.all(files.map(quantizeToTwoColors));
    let finalCanvas = canvases[0];
    if (canvases.length === 2) {
      finalCanvas = mergeCanvases(canvases[0], canvases[1]);
    }
    const texList = [new THREE.CanvasTexture(finalCanvas)];
    setTextures(texList);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 border-r">
        <div className="space-y-6 p-4">
          <div className="space-y-4">
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

            <label className="block">
              Dimension X:
              <input
                type="range"
                min={10}
                max={200}
                value={dimensions.x}
                onChange={(e) =>
                  setDimensions({ ...dimensions, x: parseInt(e.target.value) })
                }
              />
            </label>

            <label className="block">
              Dimension Y:
              <input
                type="range"
                min={10}
                max={200}
                value={dimensions.y}
                onChange={(e) =>
                  setDimensions({ ...dimensions, y: parseInt(e.target.value) })
                }
              />
            </label>

            <label className="block">
              Dimension Z:
              <input
                type="range"
                min={10}
                max={200}
                value={dimensions.z}
                onChange={(e) =>
                  setDimensions({ ...dimensions, z: parseInt(e.target.value) })
                }
              />
            </label>
          </div>

          <ImageUploader onUpload={handleUpload} />
        </div>
      </div>

      <div className="flex-1">
        <ModelViewer
          textures={textures}
          imageTransform={imageTransform}
          dimensions={dimensions}
        />
      </div>
    </div>
  );
}
