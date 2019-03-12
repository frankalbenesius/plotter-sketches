import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import math from "canvas-sketch-util/math";
import { createGrid, logSeed, settings, lineFactory } from "../../util";

function getLines(x, y, width, height) {
  let lines = [];
  const sizer = Math.max(width, height) / 20;

  createGrid(10, 4).forEach(([u, v]) => {
    const point = [math.lerp(x, x + width, u), math.lerp(y, y + height, v)];
    for (let i = 0; i < 4; i++) {
      const angle = (Math.PI / 2) * i;
      const leafLines = lineFactory.zaggedLeaf(point, sizer * 2, angle, 10);
      lines.push(...leafLines);
    }
  });

  createGrid(10, 3).forEach(([u, v]) => {
    const point = [
      math.lerp(x, x + width, u),
      math.lerp(y + height / 5, y + height - height / 5, v)
    ];
    for (let i = 0; i < 4; i++) {
      const angle = (Math.PI / 2) * i;
      const leafLines = lineFactory.zaggedLeaf(point, sizer * 2, angle, 10);
      lines.push(...leafLines);
    }
  });

  const box = [x, y, x + width, y + height];
  lines = clipPolylinesToBox(lines, box);

  return lines;
}

const sketch = ({ width, height }) => {
  logSeed();

  const margin = 0.25; // 1/4 inch

  const lines = getLines(
    margin,
    margin,
    width - margin * 2,
    height - margin * 2
  );

  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings.postcard);
