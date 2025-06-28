import * as IQ from "image-q";

export async function quantizeToTwoColors(
  file: File
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const width = img.width;
      const height = img.height;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas context not found");

      ctx.drawImage(img, 0, 0);

      const pc = IQ.utils.PointContainer.fromHTMLCanvasElement(canvas);

      const wuQuant = new (IQ as any).image.quantization.WuQuant();
      wuQuant.sample(pc);
      const reduced = wuQuant.quantize();

      const points = reduced.getPointArray();

      const outCanvas = document.createElement("canvas");
      outCanvas.width = width;
      outCanvas.height = height;
      const outCtx = outCanvas.getContext("2d");
      if (!outCtx) return reject("Output canvas context not found");

      const imageData = outCtx.createImageData(width, height);

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        imageData.data[i * 4 + 0] = p.r;
        imageData.data[i * 4 + 1] = p.g;
        imageData.data[i * 4 + 2] = p.b;
        imageData.data[i * 4 + 3] = p.a;
      }

      outCtx.putImageData(imageData, 0, 0);
      resolve(outCanvas);
    };

    img.onerror = () => reject("Failed to load image");
    img.src = URL.createObjectURL(file);
  });
}
