/**
 * Converts a full-color image on a canvas to a 2-color (black & white) version
 * using luminance-based thresholding (grayscale + binary quantization).
 *
 * This is used to simplify image textures before applying them as materials
 * in a 3D environment, optimizing performance and visual clarity.
 *
 * @param canvas HTMLCanvasElement containing the source image
 * @returns The same canvas element with quantized (binary) pixel data
 */
export function quantizeToTwoColors(
  canvas: HTMLCanvasElement
): HTMLCanvasElement {
  const ctx = canvas.getContext("2d")!;

  // Extract pixel data from the canvas (RGBA values)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Loop over every pixel in the image
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]; // Red channel
    const g = data[i + 1]; // Green channel
    const b = data[i + 2]; // Blue channel

    // Calculate luminance using standard formula for grayscale conversion
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

    // Apply binary threshold to convert to black or white
    const threshold = 128;
    const value = luminance > threshold ? 255 : 0;

    // Set R, G, B to either 0 (black) or 255 (white), keep Alpha unchanged
    data[i] = data[i + 1] = data[i + 2] = value;
  }

  // Write the modified pixel data back to the canvas
  ctx.putImageData(imageData, 0, 0);

  return canvas;
}
