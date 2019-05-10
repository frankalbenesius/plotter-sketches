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
