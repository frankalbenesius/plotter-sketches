import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import createGrid from "./util/createGrid";
import { lerp } from "canvas-sketch-util/math";
import logSeed from "./util/logSeed";
import distanceBetweenPoints from "./util/distanceBetweenPoints";

const settings = {
  dimensions: [6, 4],
  units: "in",
  pixelsPerInch: 300
};

const sketch = ({ width, height }) => {
  logSeed();

  let lines = [];
  const margin = Math.min(width, height) * 0.05;

  const cols = 60;
  const rows = 50;
  const points = createGrid(cols, rows).map(point => {
    const [u, v] = point;
    const noise = random.noise2D(u, v, 2, 3);
    return {
      position: [
        lerp(margin * 2, width - margin * 2, u + noise * 0.05),
        lerp(margin * 2, height - margin * 2, v + noise * 0.1)
      ],
      noise
    };
  });

  const xDist = (width - margin * 2) / cols;
  const yDist = (height - margin * 2) / rows;

  points.forEach(({ position, noise }, i) => {
    const [x, y] = position;
    const line = [[x + noise * 0.08, y], [x, y + noise * 0.08]];
    lines.push(line);
  });

  points.forEach(({ position, noise }) => {
    const [x, y] = position;
  });

  // const box = [margin, margin, width - margin, height - margin];
  // lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings);
