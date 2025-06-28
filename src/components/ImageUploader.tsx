import { useState } from "react";

interface Props {
  onUpload: (files: File[]) => void;
}

export default function ImageUploader({ onUpload }: Props) {
  const [previews, setPreviews] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const selected = Array.from(files).slice(0, 2);
    const urls = selected.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    onUpload(selected);
  };

  return (
    <div className="p-4 space-y-4">
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        className="border p-2"
      />
      <div className="flex gap-4">
        {previews.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`Preview ${idx + 1}`}
            className="w-32 h-32 object-cover border"
          />
        ))}
      </div>
    </div>
  );
}
