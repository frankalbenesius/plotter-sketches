import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { lerp } from "canvas-sketch-util/math";

import {
  settings,
  createCircleLine,
  createGrid,
  createSphere
} from "../../util";

const sketch = ({ width, height }) => {
  const freq = 0.1;
  const amp = 1;
  const cols = 12;
  const shellLines = 10;
  const shells = 1; // doesn't do much yet
  const arcSteps = 100;
  const arcLength = 1;
  const percentBlank = 0.3;
  const marginPct = 0.15;
  const radiusPct = 0.45;

  let lines = [];

  const margin = Math.min(width, height) * marginPct;
  const radius = ((width - margin * 2) / cols) * radiusPct;
  const rows = Math.round(cols * (height / width));
  createGrid(cols, rows).map(([u, v]) => {
    const point = [
      lerp(margin, width - margin, u),
      lerp(margin, height - margin, v)
    ];
    if (random.value() > percentBlank) {
      const rotation = {
        x: Math.PI * 2 * random.noise2D(u, v, freq, amp),
        y: Math.PI * 2 * random.noise2D(u + 2000, v, freq, amp),
        z: Math.PI * 2 * random.noise2D(u + 30, v - 40, freq, amp)
      };
      lines.push(
        ...createSphere({
          center: point,
          radius: radius,
          shellLines,
          shells,
          arcSteps,
          arcLength,
          rotation: rotation
        })
      );
    } else {
      lines.push(createCircleLine(point[0], point[1], radius));
    }
  });

  // const box = [margin, margin, width - margin, height - margin];
  // lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings.postcard);
