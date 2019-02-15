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

  const cols = 50;
  const rows = 40;
  const points = createGrid(cols, rows).map(point => {
    const [u, v] = point;
    return {
      position: [
        lerp(margin * 5, width - margin * 5, u),
        lerp(margin, height - margin, v)
      ],
      noise: random.noise2D(u, v, 1.4, 1)
    };
  });

  const xDist = (width - margin * 2) / cols;
  const yDist = (height - margin * 2) / rows;

  points.forEach(({ position, noise }, i) => {
    const [x, y] = position;
    const line = [
      [x + noise + xDist, y],
      [x + noise, y],
      [x + noise, y + yDist / 2]
    ];
    lines.push(line);
  });

  points.forEach(({ position, noise }) => {
    const [x, y] = position;
  });

  const box = [margin, margin, width - margin, height - margin];
  lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings);
