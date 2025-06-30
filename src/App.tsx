// React & Three.js Core Imports
import { useEffect, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei"; // Enables orbit-based camera control
import * as THREE from "three";

// Utility Function: Image quantization for texture optimization
import { quantizeToTwoColors } from "./utils/quantizeToTwoColors";

// Custom Component for 3D Cube
import CustomCube from "./components/CustomCube";

// UI Components (ShadCN or similar design system)
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Icon for Upload button
import { Upload } from "lucide-react";

export default function App() {
  // Stores textures for two cube faces (initially null)
  const [textures, setTextures] = useState<(THREE.Texture | null)[]>([
    null,
    null,
  ]);

  // Stores transformation settings for each face (scale, X, Y)
  const [transforms, setTransforms] = useState([
    { scale: 0.5, position: { x: 0, y: 0 } },
    { scale: 0.5, position: { x: 0, y: 0 } },
  ]);

  // Cube model dimensions (default values updated from API)
  const [dimensions, setDimensions] = useState({ x: 100, y: 100, z: 100 });

  // External GLTF model URL fetched from API
  const [modelUrl, setModelUrl] = useState<string | null>(null);

  // Refs for two separate file input buttons
  const fileInputs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Fetch model and dimensions + Restore image textures from localStorage on mount
  useEffect(() => {
    // Fetch cube model metadata (dimensions + model URL)
    fetch(
      "https://raw.githubusercontent.com/oneone-studio/interview-assets/refs/heads/main/api.json"
    )
      .then((res) => res.json())
      .then((data) => {
        setDimensions({
          x: data.measurements.x.value,
          y: data.measurements.y.value,
          z: data.measurements.z.value,
        });
        setModelUrl(data.model);
      });

    // Restore uploaded textures from localStorage
    [0, 1].forEach((index) => {
      const stored = localStorage.getItem(`image-${index}`);
      if (!stored) return;

      const img = new Image();
      img.src = stored;
      img.crossOrigin = "anonymous";

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);

        const quantized = quantizeToTwoColors(canvas);
        const texture = new THREE.CanvasTexture(quantized);
        texture.needsUpdate = true;

        setTextures((prev) => {
          const updated = [...prev];
          updated[index] = texture;
          return updated;
        });
      };
    });
  }, []);

  // Handles image upload + processing + conversion to canvas texture
  const handleUpload = (file: File, index: 0 | 1) => {
    const reader = new FileReader();

    reader.onload = () => {
      const dataURL = reader.result as string;
      localStorage.setItem(`image-${index}`, dataURL); // Persist to localStorage

      const img = new Image();
      img.src = dataURL;
      img.crossOrigin = "anonymous";

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);

        const quantized = quantizeToTwoColors(canvas); // Reduce colors for performance
        const texture = new THREE.CanvasTexture(quantized);
        texture.needsUpdate = true;

        const updatedTextures = [...textures];
        updatedTextures[index] = texture;
        setTextures(updatedTextures);
      };

      img.onerror = () => alert("Image load failed.");
    };

    reader.readAsDataURL(file);
  };

  // Update transformation settings (scale, position x/y) for each face
  const updateTransform = (
    index: 0 | 1,
    key: "scale" | "x" | "y",
    value: number
  ) => {
    const newTransforms = [...transforms];
    if (key === "scale") {
      newTransforms[index].scale = value;
    } else {
      newTransforms[index].position[key] = value;
    }
    setTransforms(newTransforms);
  };

  return (
    <div className="h-screen w-screen flex">
      {/* ==== Left Panel: Controls ==== */}
      <div className="w-1/3 h-full overflow-y-auto bg-gray-50 p-4 space-y-6 border-r">
        {[0, 1].map((index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>Image {index + 1} Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Hidden file input for Upload/Replace */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputs[index]}
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleUpload(e.target.files[0], index as 0 | 1);
                  }
                }}
              />

              {/* Upload/Replace and Remove Buttons Side-by-Side */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => fileInputs[index].current?.click()}
                  className="flex items-center gap-1"
                >
                  <Upload className="w-4 h-4" />
                  {textures[index] ? "Replace Image" : "Upload Image"}
                </Button>

                {textures[index] && (
                  <Button
                    variant="ghost"
                    className="bg-red-500 hover:bg-red-600 text-black text-xs px-2 py-1 flex items-center gap-1 w-fit rounded-sm"
                    onClick={() => {
                      const updatedTextures = [...textures];
                      updatedTextures[index] = null;
                      setTextures(updatedTextures);
                      localStorage.removeItem(`image-${index}`);
                    }}
                  >
                    <span className="text-sm">✕</span>
                    Remove
                  </Button>
                )}
              </div>

              {/* Transform Controls: Scale, X, Y */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Scale</Label>
                <Slider
                  min={0.1}
                  max={2}
                  step={0.01}
                  value={[transforms[index].scale]}
                  onValueChange={([val]) =>
                    updateTransform(index as 0 | 1, "scale", val)
                  }
                />
                <span className="text-xs text-muted-foreground">
                  {transforms[index].scale.toFixed(2)}
                </span>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Position X</Label>
                <Slider
                  min={-1}
                  max={1}
                  step={0.01}
                  value={[transforms[index].position.x]}
                  onValueChange={([val]) =>
                    updateTransform(index as 0 | 1, "x", val)
                  }
                />
                <span className="text-xs text-muted-foreground">
                  {transforms[index].position.x.toFixed(2)}
                </span>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Position Y</Label>
                <Slider
                  min={-1}
                  max={1}
                  step={0.01}
                  value={[transforms[index].position.y]}
                  onValueChange={([val]) =>
                    updateTransform(index as 0 | 1, "y", val)
                  }
                />
                <span className="text-xs text-muted-foreground">
                  {transforms[index].position.y.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Global Cube Dimensions */}
        <Card>
          <CardHeader>
            <CardTitle>Model Dimensions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {["x", "y", "z"].map((axis) => (
              <div key={axis} className="space-y-2">
                <Label className="text-sm font-semibold">
                  {axis.toUpperCase()}
                </Label>
                <Slider
                  min={10}
                  max={200}
                  value={[dimensions[axis as keyof typeof dimensions]]}
                  onValueChange={([val]) =>
                    setDimensions({ ...dimensions, [axis]: val })
                  }
                />
                <span className="text-xs text-muted-foreground">
                  {dimensions[axis as keyof typeof dimensions]}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ==== Right Panel: 3D Viewer ==== */}
      <div className="w-2/3 h-full flex items-center justify-center bg-white">
        <div className="max-w-[600px] w-full aspect-square mx-auto">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight />
            <OrbitControls />
            {modelUrl && (
              <CustomCube
                modelUrl={modelUrl}
                textures={textures}
                transforms={transforms}
                dimensions={dimensions}
              />
            )}
          </Canvas>
        </div>
      </div>
    </div>
  );
}
