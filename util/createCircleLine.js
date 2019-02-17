function createCircleLine(x, y, r, steps = 30) {
  let circleLine = [];
  const theta = (Math.PI * 2) / steps;
  for (let i = 0; i <= steps; i++) {
    const angle = theta * i;
    const point = [x + Math.cos(angle) * r, y + Math.sin(angle) * r];
    circleLine.push(point);
  }
  return circleLine;
}

export default createCircleLine;
