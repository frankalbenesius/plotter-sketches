import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { createGrid, logSeed, settings } from "../../util";
import { lerp, clamp } from "canvas-sketch-util/math";

const sketch = ({ width, height }) => {
  logSeed();

  let lines = [];
  const margin = Math.min(width, height) * 0.05;

  const cols = 200;
  const rows = Math.round(cols * (4 / 6));
  const points = createGrid(cols, rows).map(point => {
    const [u, v] = point;
    const noise = random.noise2D(u, v, 3, 1.4);
    const posNoise = clamp(noise, -1, 1);
    const lerpMargin = margin * 2;
    return {
      position: [
        lerp(lerpMargin, width - lerpMargin, u + posNoise * 0.02),
        lerp(lerpMargin, height - lerpMargin, v + posNoise * 0.06)
      ],
      noise
    };
  });

  // vertical lines
  const vertLineCount = 12;
  for (let c = 0; c < cols; c++) {
    if ((c + vertLineCount / 2) % (vertLineCount * 2) < vertLineCount) {
      let columnLine = [];
      for (let r = 0; r < rows; r++) {
        columnLine.push(points[c * rows + r].position);
      }
      if (c % 2 === 0) {
        columnLine.reverse();
      }
      lines.push(columnLine);
    }
  }

  const horizLineCount = 4;
  for (let r = 0; r < rows; r++) {
    if ((r + horizLineCount * 1.5) % (horizLineCount * 2) < horizLineCount) {
      let rowLine = [];
      for (let c = 0; c < cols; c++) {
        const point = points[c * rows + r].position;
        rowLine.push(point);
      }
      if (r % 2 === 0) {
        rowLine.reverse();
      }
      lines.push(rowLine);
    }
  }

  const box = [margin, margin, width - margin, height - margin];
  lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings.postcard);
