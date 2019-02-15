import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import createGrid from "./util/createGrid";
import { lerp } from "canvas-sketch-util/math";
import logSeed from "./util/logSeed";

const settings = {
  dimensions: [6, 4],
  units: "in",
  pixelsPerInch: 300
};

const sketch = ({ width, height }) => {
  logSeed();

  let lines = [];
  const margin = Math.min(width, height) * 0.05;

  const points = createGrid(50, 40).map(point => {
    const [u, v] = point;
    return {
      position: [
        lerp(margin, width - margin, u),
        lerp(margin, height - margin, v)
      ],
      noise: random.noise2D(u, v, 8, 1.2)
    };
  });

  points.forEach(({ position, noise }) => {
    const [x, y] = position;

    const adjX = x + noise * margin * 1.2;
    const line = [
      [adjX, y],
      [adjX + margin * 0.75 * noise, y],
      [adjX + margin * 0.9 * noise, y + noise * margin]
    ];
    lines.push(line);

    const adjY = y + noise * margin;
    const diagonalLine = [
      [x + noise / 20, adjY],
      [x + noise / 20, adjY + margin * 0.75 * noise]
    ];
    // lines.push(verticalLine);
  });

  const box = [margin, margin, width - margin, height - margin];
  lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings);
