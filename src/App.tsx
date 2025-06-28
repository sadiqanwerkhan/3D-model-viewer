import { useState } from "react";
import ModelViewer from "./components/ModelViewer";
import ImageUploader from "./components/ImageUploader";

export default function App() {
  const [images, setImages] = useState<File[]>([]);

  return (
    <div className="flex h-screen">
      <div className="w-1/4 border-r">
        <ImageUploader onUpload={setImages} />
      </div>
      <div className="flex-1">
        <ModelViewer />
      </div>
    </div>
  );
}
