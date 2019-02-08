function createGrid(xCount, yCount) {
  const points = [];
  for (let x = 0; x < xCount; x++) {
    for (let y = 0; y < yCount; y++) {
      const u = xCount <= 1 ? 0.5 : x / (xCount - 1);
      const v = xCount <= 1 ? 0.5 : y / (yCount - 1);
      points.push([u, v]);
    }
  }
  return points;
}

export default createGrid;
