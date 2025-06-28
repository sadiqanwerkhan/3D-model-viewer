export function mergeCanvases(
  base: HTMLCanvasElement,
  overlay: HTMLCanvasElement
): HTMLCanvasElement {
  const width = Math.max(base.width, overlay.width);
  const height = Math.max(base.height, overlay.height);

  const merged = document.createElement("canvas");
  merged.width = width;
  merged.height = height;
  const ctx = merged.getContext("2d")!;

  ctx.drawImage(base, 0, 0);
  ctx.drawImage(overlay, 0, 0);

  return merged;
}
