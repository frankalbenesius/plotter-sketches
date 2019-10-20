import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import createGrid from "../../util/createGrid";
import { lerp, clamp } from "canvas-sketch-util/math";
import logSeed from "../../util/logSeed";
import distanceBetweenPoints from "../../util/distanceBetweenPoints";
import createCircleLine from "../../util/createCircleLine";
import { settings } from "../../util";

const sketch = ({ width, height }) => {
  logSeed("262581");

  let lines = [];

  const margin = Math.min(width, height) * 0.05;
  const gutter = margin * 0.25;

  const cols = 12;
  const rows = 9;
  const shiftMultiplier = 0.3;
  const minLines = 4;
  const maxLines = 6.5;
  const noiseFrequency = 0.06;
  const noiseAmplitude = 9;
  const innerNoiseFrequency = 0.8;
  const innerNoiseAmplitude = 5;
  const doCircles = false;

  const xRadius = (width - margin * 2 - gutter * cols) / cols / 2;
  const yRadius = (height - margin * 2 - gutter * rows) / rows / 2;
  createGrid(cols, rows).map(([u, v]) => {
    const [cx, cy] = [
      lerp(margin + xRadius, width - (margin + xRadius), u),
      lerp(margin + yRadius, height - (margin + yRadius), v)
    ];
    const noise = random.noise2D(cx, cy, noiseFrequency, noiseAmplitude);
    const numLines = Math.round(lerp(minLines, maxLines, Math.abs(noise)));
    const patchLines = createCirclePatchLines(
      cx,
      cy,
      xRadius,
      yRadius,
      numLines,
      shiftMultiplier,
      doCircles,
      innerNoiseFrequency,
      innerNoiseAmplitude
    );
    lines.push(...patchLines);
  });

  // const box = [margin, margin, width - margin, height - margin];
  // lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings.large);

function createCirclePatchLines(
  cx,
  cy,
  xRadius,
  yRadius,
  lineCount,
  shiftMultiplier,
  doCircles,
  noiseFrequency,
  noiseAmplitude
) {
  let lines = [];

  const points = createGrid(lineCount, lineCount).map(point => {
    const [u, v] = point;

    const noise = random.noise2D(
      u + cx,
      v + cy,
      noiseFrequency,
      noiseAmplitude
    );

    const inCircle = distanceBetweenPoints(point, [0.5, 0.5]) <= 0.5;

    const rawPosition = [
      lerp(cx - xRadius, cx + xRadius, u),
      lerp(cy - yRadius, cy + yRadius, v)
    ];

    const shift =
      clamp(noise, 0, 0.5) * Math.min(xRadius, yRadius) * shiftMultiplier;
    // const shiftedPosition = rawPosition.map(pt => pt + shift);
    const shiftedPosition = [
      rawPosition[0] + shift,
      rawPosition[1] + shift * 0.5
    ];

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
      if (!doCircles || point.inCircle) {
        columnLine.push(point.position);
      }
    }
    if (c % 2 === 1) {
      // just for plotter efficiency
      columnLine = columnLine.reverse();
    }
    if (!doCircles || columnLine.length > 0) {
      lines.push(columnLine);
    }
  }

  // horizontal lines
  for (let r = 0; r < lineCount; r++) {
    let rowLine = [];
    for (let c = 0; c < lineCount; c++) {
      const point = points[c * lineCount + r];
      if (!doCircles || point.inCircle) {
        rowLine.push(point.position);
      }
    }
    if (r % 2 === 1) {
      // just for plotter efficiency
      rowLine = rowLine.reverse();
    }
    if (!doCircles || rowLine.length > 0) {
      lines.push(rowLine);
    }
  }

  return lines;
}
