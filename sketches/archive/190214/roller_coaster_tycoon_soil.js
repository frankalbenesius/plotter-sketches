import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import createGrid from "../../../util/createGrid";
import { lerp, clamp } from "canvas-sketch-util/math";
import logSeed from "../../../util/logSeed";

const settings = {
  dimensions: [6, 4],
  units: "in",
  pixelsPerInch: 300,
};

const sketch = ({ width, height }) => {
  logSeed();

  let lines = [];
  const margin = Math.min(width, height) * 0.02;

  const cols = 90;
  const rows = 60;
  const points = createGrid(cols, rows).map((point) => {
    const [u, v] = point;
    const noise = random.noise2D(u, v, 3, 1);
    const posNoise = clamp(noise, -1, 1);
    const lerpMargin = margin * 2;
    return {
      position: [
        lerp(lerpMargin, width - lerpMargin, u + posNoise * 0.04),
        lerp(lerpMargin, height - lerpMargin, v + posNoise * 0.04),
      ],
      noise,
    };
  });

  // vertical lines
  for (let c = 0; c < cols; c++) {
    let columnLine = [];
    for (let r = 0; r < rows; r++) {
      columnLine.push(points[c * rows + r].position);
    }
    lines.push(columnLine);
  }

  for (let r = 0; r < rows; r++) {
    let rowLine = [];
    for (let c = 0; c < cols; c++) {
      const point = points[c * rows + r].position;
      rowLine.push(point);
    }
    lines.push(rowLine);
  }

  const box = [margin, margin, width - margin, height - margin];
  // lines = lines.filter(() => Math.random() > 0.3);
  lines = clipPolylinesToBox(lines, box);
  return (props) => renderPolylines(lines, props);
};

canvasSketch(sketch, settings);
