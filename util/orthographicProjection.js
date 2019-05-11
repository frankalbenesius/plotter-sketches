import { lerp } from "canvas-sketch-util/math";
export default function project3dLines(lines, width, height) {
  const sizer = Math.min(width, height);
  const centerX = width / 2;
  const centerY = height / 2;
  return lines.map(line => {
    return line.map(point => {
      const [u, v] = point;
      return [centerX + u * sizer, centerY + v * sizer];
    });
  });
}

export function projectUVLines(lines3D, center, width, height = width) {
  const [cx, cy] = center;
  return lines3D.map(line3D => {
    return line3D.map(uvPoint3D => {
      const [u, v] = uvPoint3D; // ignores the z value (cause orthographic)
      const x = lerp(cx - width / 2, cx + width / 2, u);
      const y = lerp(cy - height / 2, cy + height / 2, v);
      return [x, y];
    });
  });
}
