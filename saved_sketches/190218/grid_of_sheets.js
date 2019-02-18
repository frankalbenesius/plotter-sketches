import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import createGrid from "../../util/createGrid";
import { lerp, clamp } from "canvas-sketch-util/math";
import logSeed from "../../util/logSeed";
import distanceBetweenPoints from "../../util/distanceBetweenPoints";
import createCircleLine from "../../util/createCircleLine";

const settings = {
  dimensions: [6, 4],
  pixelsPerInch: 300,
  units: "in"
};

const sketch = ({ width, height }) => {
  logSeed();

  let lines = [];

  const margin = Math.min(width, height) * 0.1;

  const cols = 5;
  const rows = 3;
  const patchRadius = ((width - margin * 2) / cols) * 0.45;
  createGrid(cols, rows).map(([u, v]) => {
    const [cx, cy] = [
      lerp(margin + patchRadius, width - (margin + patchRadius), u),
      lerp(margin + patchRadius, height - (margin + patchRadius), v)
    ];
    const patchLines = createCirclePatchLines(cx, cy, patchRadius, 12);
    lines.push(...patchLines);
  });

  // const box = [margin, margin, width - margin, height - margin];
  // lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings);

function createCirclePatchLines(cx, cy, radius, lineCount = 20) {
  let lines = [];

  const points = createGrid(lineCount, lineCount).map(point => {
    const [u, v] = point;

    const noise = random.noise2D(u + cx, v + cy, 2, 6);

    const inCircle = distanceBetweenPoints(point, [0.5, 0.5]) <= 0.5;

    const rawPosition = [
      lerp(cx - radius, cx + radius, u),
      lerp(cy - radius, cy + radius, v)
    ];

    const shift = clamp(noise, 0, 0.2) * radius * 0.4;
    const shiftedPosition = rawPosition.map(pt => pt + shift);

    return {
      position: shiftedPosition,
      noise,
      inCircle
    };
  });

  // vertical lines
  for (let c = 0; c < lineCount; c++) {
    let columnLine = [];
    for (let r = 0; r < lineCount; r++) {
      const point = points[c * lineCount + r];
      // if (point.inCircle) {
      columnLine.push(point.position);
      // }
    }
    if (columnLine.length > 0) {
      lines.push(columnLine);
    }
  }

  // horizontal lines
  for (let r = 0; r < lineCount; r++) {
    let rowLine = [];
    for (let c = 0; c < lineCount; c++) {
      const point = points[c * lineCount + r];
      // if (point.inCircle) {
      rowLine.push(point.position);
      // }
    }
    if (rowLine.length > 0) {
      lines.push(rowLine);
    }
  }

  return lines;
}
