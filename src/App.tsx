// import { useEffect, useState } from "react";
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls } from "@react-three/drei";
// import * as THREE from "three";

// import CustomCube from "./components/CustomCube";

// export default function App() {
//   const [textures, setTextures] = useState<(THREE.Texture | null)[]>([
//     null,
//     null,
//   ]);
//   const [transforms, setTransforms] = useState([
//     { scale: 0.5, position: { x: 0, y: 0 } },
//     { scale: 0.5, position: { x: 0, y: 0 } },
//   ]);
//   const [dimensions, setDimensions] = useState({ x: 100, y: 100, z: 100 });

//   useEffect(() => {
//     fetch(
//       "https://raw.githubusercontent.com/oneone-studio/interview-assets/refs/heads/main/api.json"
//     )
//       .then((res) => res.json())
//       .then((data) => {
//         setDimensions({
//           x: data.measurements.x.value,
//           y: data.measurements.y.value,
//           z: data.measurements.z.value,
//         });
//       });
//   }, []);

//   const handleUpload = async (file: File, index: 0 | 1) => {
//     const img = new Image();
//     img.crossOrigin = "anonymous";

//     img.onload = () => {
//       const canvas = document.createElement("canvas");
//       canvas.width = img.width;
//       canvas.height = img.height;
//       const ctx = canvas.getContext("2d")!;
//       ctx.drawImage(img, 0, 0);

//       const texture = new THREE.CanvasTexture(canvas);
//       texture.needsUpdate = true;

//       const updatedTextures = [...textures];
//       updatedTextures[index] = texture;
//       setTextures(updatedTextures);
//     };

//     img.onerror = (error) => {
//       alert("Image load failed");
//     };

//     img.src = URL.createObjectURL(file);
//   };

//   const updateTransform = (
//     index: 0 | 1,
//     key: "scale" | "x" | "y",
//     value: number
//   ) => {
//     const newTransforms = [...transforms];
//     if (key === "scale") {
//       newTransforms[index].scale = value;
//     } else {
//       newTransforms[index].position[key] = value;
//     }
//     setTransforms(newTransforms);
//   };

//   return (
//     <div className="flex h-screen">
//       <div className="w-1/3 border-r p-4 space-y-6 overflow-y-auto">
//         {[0, 1].map((index) => (
//           <div key={index} className="space-y-2 p-4 border rounded-lg">
//             <label className="block font-bold text-sm">
//               Upload Image {index + 1}
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => {
//                   if (e.target.files?.[0])
//                     handleUpload(e.target.files[0], index as 0 | 1);
//                 }}
//                 className="block mt-1 w-full"
//               />
//             </label>

//             <div className="space-y-2">
//               <label className="block text-sm">
//                 Scale: {transforms[index].scale.toFixed(2)}
//                 <input
//                   type="range"
//                   min="0.1"
//                   max="2"
//                   step="0.01"
//                   value={transforms[index].scale}
//                   onChange={(e) =>
//                     updateTransform(
//                       index as 0 | 1,
//                       "scale",
//                       parseFloat(e.target.value)
//                     )
//                   }
//                   className="w-full"
//                 />
//               </label>

//               <label className="block text-sm">
//                 Position X: {transforms[index].position.x.toFixed(2)}
//                 <input
//                   type="range"
//                   min="-1"
//                   max="1"
//                   step="0.01"
//                   value={transforms[index].position.x}
//                   onChange={(e) =>
//                     updateTransform(
//                       index as 0 | 1,
//                       "x",
//                       parseFloat(e.target.value)
//                     )
//                   }
//                   className="w-full"
//                 />
//               </label>

//               <label className="block text-sm">
//                 Position Y: {transforms[index].position.y.toFixed(2)}
//                 <input
//                   type="range"
//                   min="-1"
//                   max="1"
//                   step="0.01"
//                   value={transforms[index].position.y}
//                   onChange={(e) =>
//                     updateTransform(
//                       index as 0 | 1,
//                       "y",
//                       parseFloat(e.target.value)
//                     )
//                   }
//                   className="w-full"
//                 />
//               </label>
//             </div>
//           </div>
//         ))}

//         <hr className="my-4" />

//         <label className="block font-bold">Dimensions</label>

//         <label className="block">
//           X: {dimensions.x}
//           <input
//             type="range"
//             min={10}
//             max={200}
//             value={dimensions.x}
//             onChange={(e) =>
//               setDimensions({ ...dimensions, x: parseInt(e.target.value) })
//             }
//             className="w-full"
//           />
//         </label>

//         <label className="block">
//           Y: {dimensions.y}
//           <input
//             type="range"
//             min={10}
//             max={200}
//             value={dimensions.y}
//             onChange={(e) =>
//               setDimensions({ ...dimensions, y: parseInt(e.target.value) })
//             }
//             className="w-full"
//           />
//         </label>

//         <label className="block">
//           Z: {dimensions.z}
//           <input
//             type="range"
//             min={10}
//             max={200}
//             value={dimensions.z}
//             onChange={(e) =>
//               setDimensions({ ...dimensions, z: parseInt(e.target.value) })
//             }
//             className="w-full"
//           />
//         </label>
//       </div>

//       <div className="flex-1">
//         <Canvas camera={{ position: [0, 0, 5] }}>
//           <ambientLight />
//           <OrbitControls />
//           <CustomCube
//             textures={textures}
//             transforms={transforms}
//             dimensions={dimensions}
//           />
//         </Canvas>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import CustomCube from "./components/CustomCube";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function App() {
  const [textures, setTextures] = useState<(THREE.Texture | null)[]>([
    null,
    null,
  ]);
  const [transforms, setTransforms] = useState([
    { scale: 0.5, position: { x: 0, y: 0 } },
    { scale: 0.5, position: { x: 0, y: 0 } },
  ]);
  const [dimensions, setDimensions] = useState({ x: 100, y: 100, z: 100 });

  useEffect(() => {
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
      });
  }, []);

  const handleUpload = async (file: File, index: 0 | 1) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;

      const updatedTextures = [...textures];
      updatedTextures[index] = texture;
      setTextures(updatedTextures);
    };

    img.onerror = () => {
      alert("Image load failed");
    };

    img.src = URL.createObjectURL(file);
  };

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
    <div className="flex h-screen">
      <div className="w-1/3 border-r p-4 space-y-6 overflow-y-auto bg-gray-50">
        {[0, 1].map((index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>Image {index + 1} Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0])
                      handleUpload(e.target.files[0], index as 0 | 1);
                  }}
                  className="mb-2"
                />
              </Label>

              <div>
                <Label>Scale: {transforms[index].scale.toFixed(2)}</Label>
                <Slider
                  min={0.1}
                  max={2}
                  step={0.01}
                  value={[transforms[index].scale]}
                  onValueChange={([val]) =>
                    updateTransform(index as 0 | 1, "scale", val)
                  }
                />
              </div>

              <div>
                <Label>
                  Position X: {transforms[index].position.x.toFixed(2)}
                </Label>
                <Slider
                  min={-1}
                  max={1}
                  step={0.01}
                  value={[transforms[index].position.x]}
                  onValueChange={([val]) =>
                    updateTransform(index as 0 | 1, "x", val)
                  }
                />
              </div>

              <div>
                <Label>
                  Position Y: {transforms[index].position.y.toFixed(2)}
                </Label>
                <Slider
                  min={-1}
                  max={1}
                  step={0.01}
                  value={[transforms[index].position.y]}
                  onValueChange={([val]) =>
                    updateTransform(index as 0 | 1, "y", val)
                  }
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardHeader>
            <CardTitle>Dimensions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>X: {dimensions.x}</Label>
              <Slider
                min={10}
                max={200}
                value={[dimensions.x]}
                onValueChange={([val]) =>
                  setDimensions({ ...dimensions, x: val })
                }
              />
            </div>
            <div>
              <Label>Y: {dimensions.y}</Label>
              <Slider
                min={10}
                max={200}
                value={[dimensions.y]}
                onValueChange={([val]) =>
                  setDimensions({ ...dimensions, y: val })
                }
              />
            </div>
            <div>
              <Label>Z: {dimensions.z}</Label>
              <Slider
                min={10}
                max={200}
                value={[dimensions.z]}
                onValueChange={([val]) =>
                  setDimensions({ ...dimensions, z: val })
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 bg-white">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight />
          <OrbitControls />
          <CustomCube
            textures={textures}
            transforms={transforms}
            dimensions={dimensions}
          />
        </Canvas>
      </div>
    </div>
  );
}
