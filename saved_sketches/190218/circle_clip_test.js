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
  const gutter = margin / 6;

  const cols = 20;
  const rows = 10;
  const xRadius = (width - margin * 2 - gutter * cols) / cols / 2;
  const yRadius = (height - margin * 2 - gutter * rows) / rows / 2;
  createGrid(cols, rows).map(([u, v]) => {
    const [cx, cy] = [
      lerp(margin + xRadius, width - (margin + xRadius), u),
      lerp(margin + yRadius, height - (margin + yRadius), v)
    ];
    const noise = random.noise2D(cx, cy, 0.5, 2);
    const numLines = Math.round(lerp(2, 5, Math.abs(noise)));
    const patchLines = createCirclePatchLines(
      cx,
      cy,
      xRadius,
      yRadius,
      numLines
    );
    lines.push(...patchLines);
  });

  // const box = [margin, margin, width - margin, height - margin];
  // lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings);

function createCirclePatchLines(cx, cy, xRadius, yRadius, lineCount = 20) {
  let lines = [];

  const points = createGrid(lineCount, lineCount).map(point => {
    const [u, v] = point;

    const noise = random.noise2D(u + cx, v + cy, 2, 6);

    const inCircle = distanceBetweenPoints(point, [0.5, 0.5]) <= 0.5;

    const rawPosition = [
      lerp(cx - xRadius, cx + xRadius, u),
      lerp(cy - yRadius, cy + yRadius, v)
    ];

    const shift = clamp(noise, 0, 0.2) * Math.min(xRadius, yRadius) * 0.4;
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
