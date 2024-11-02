export const blendColors = (
  foreground: number[],
  background: number[] = [255, 255, 255],
  alpha: number = 0.3,
): number[] => {
  const r = Math.round(foreground[0] * alpha + background[0] * (1 - alpha));
  const g = Math.round(foreground[1] * alpha + background[1] * (1 - alpha));
  const b = Math.round(foreground[2] * alpha + background[2] * (1 - alpha));
  return [r, g, b];
};
