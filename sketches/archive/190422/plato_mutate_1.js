import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import random from "canvas-sketch-util/random";
import { createGrid, logSeed, settings } from "../../../../util";
import { lerp, clamp } from "canvas-sketch-util/math";

const sketch = ({ width, height }) => {
  logSeed();

  let lines = [];
  const margin = Math.min(width, height) * 0.05;

  const cols = 150;
  const rows = Math.round(cols * (11 / 14));
  const freq = 3;
  const amp = 1;
  const clampAt = 0.4 * amp;

  const points = createGrid(cols, rows).map(point => {
    const [u, v] = point;
    const noise = random.noise2D(u, v, freq, amp);
    const posNoise = clamp(noise, -clampAt, clampAt);
    const lerpMargin = margin * 2;
    return {
      position: [
        lerp(lerpMargin, width - lerpMargin, u + posNoise * 0.03),
        lerp(lerpMargin, height - lerpMargin, v + posNoise * 0.05)
      ],
      noise
    };
  });

  for (let r = 0; r < rows; r++) {
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

  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings.postcard);
