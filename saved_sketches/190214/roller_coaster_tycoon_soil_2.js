import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import createGrid from "../../util/createGrid";
import { lerp, clamp } from "canvas-sketch-util/math";
import logSeed from "../../util/logSeed";
import distanceBetweenPoints from "../../util/distanceBetweenPoints";
import { settings } from "../../util";

const sketch = ({ width, height }) => {
  logSeed();

  let lines = [];
  const margin = Math.min(width, height) * 0.05;

  const cols = 140 * 0.8;
  const rows = 110 * 0.8;
  const points = createGrid(cols, rows).map(point => {
    const [u, v] = point;
    const noise = random.noise2D(u, v, 5, 3);
    const clampVal = (u + v) * 0.3;
    const posNoise = clamp(noise, -clampVal, clampVal);
    const lerpMargin = margin * 1.5;
    const shift = 0.05;
    return {
      position: [
        lerp(lerpMargin, width - lerpMargin, u + posNoise * shift),
        lerp(lerpMargin, height - lerpMargin, v + posNoise * shift)
      ],
      noise
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

  // const box = [margin, margin, width - margin, height - margin];
  // lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings.large);
