import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { createGrid, logSeed, settings } from "../../util";
import { lerp, clamp } from "canvas-sketch-util/math";

const sketch = ({ width, height }) => {
  let lines = [];
  const margin = Math.min(width, height) * 0.025;

  const cols = 100;
  const freq = 2;
  const amp = 2;
  const clampRatio = 0.2;
  const xShiftRatio = 1;
  const yShiftRatio = 1;

  const rows = Math.round(cols * (4 / 6));
  const points = createGrid(cols, rows).map((point) => {
    const [u, v] = point;
    const noise = random.noise2D(u, v, freq, amp);

    /* clampRatio based on x position... */
    // const clampVal = amp * u;

    const clampVal = amp * clampRatio;
    const posNoise = clamp(noise, -1 * clampVal, clampVal);

    const lerpMargin = margin * 2;
    const origX = lerp(lerpMargin, width - lerpMargin, u);
    const origY = lerp(lerpMargin, height - lerpMargin, v);

    const xShift = posNoise * margin * xShiftRatio;
    const yShift = posNoise * margin * yShiftRatio;

    const x = origX + xShift;
    const y = origY + yShift;

    return {
      position: [x, y],
      noise,
    };
  });

  // vertical lines
  for (let c = 0; c < cols - 0; c++) {
    let columnLine = [];
    for (let r = 0; r < rows; r++) {
      columnLine.push(points[c * rows + r].position);
    }
    if (c % 2 === 0) {
      columnLine.reverse();
    }
    lines.push(columnLine);
  }

  // horizontal lines
  for (let r = 0; r < rows - 0; r++) {
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

  const box = [margin, margin, width - margin, height - margin];
  lines = clipPolylinesToBox(lines, box);
  return (props) => renderPolylines(lines, props);
};

canvasSketch(sketch, settings.postcard);
