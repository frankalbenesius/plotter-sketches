import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import math from "canvas-sketch-util/math";
import {
  settings,
  createSphere,
  createGrid,
  createCircleLine
} from "../../../../util";

const sketch = ({ width, height }) => {
  let lines = [];

  const margin = 0.4;
  const frequency = 0.2;
  const amplitude = 1;
  const cols = 22;
  const diamondRadius = ((width - margin * 2) / cols) * 0.45;
  const rows = Math.round((height / width) * cols);

  createGrid(cols, rows).forEach(([u, v]) => {
    const [x, y] = [
      math.lerp(margin, width - margin, u),
      math.lerp(margin, height - margin, v)
    ];
    const noise = random.noise2D(u, v, frequency, amplitude);
    const theta = Math.abs(noise) * Math.PI * 2;
    lines.push(createCircleLine(x, y, diamondRadius * 0.2));

    if (random.value() > 0.7) {
      lines.push(createCircleLine(x, y, diamondRadius * 0.4, 40, theta, 12));
    }

    if (random.value() > 0.9) {
      lines.push(
        createCircleLine(x, y, diamondRadius * 0.4, 40, theta + Math.PI, 8)
      );
    }

    if (random.value() > 0.5) {
      lines.push(createCircleLine(x, y, diamondRadius, 4, theta));
    }
  });

  // const box = [margin, margin, width - margin, height - margin];
  // lines = clipPolylinesToBox(lines, box);
  return props =>
    renderPolylines(lines, {
      ...props
    });
};

canvasSketch(sketch, settings.postcard);
