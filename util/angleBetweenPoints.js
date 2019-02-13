export default function([x1, y1], [x2, y2]) {
  // angle between -PI and +PI
  const angleBetweenRadians = Math.atan2(y2 - y1, x2 - x1);
  return angleBetweenRadians;
}
