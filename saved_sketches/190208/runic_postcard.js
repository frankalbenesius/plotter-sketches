import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import createGrid from "./util/createGrid";
import { lerp, clamp } from "canvas-sketch-util/math";
import array from "new-array";
import convexHull from "convexhull-js";

const settings = {
  dimensions: [6, 4],
  units: "in",
  pixelsPerInch: 300
};

function createGlyphLines(position, meas, noise) {
  const [x, y] = position;
  const l = meas / 5;
  const pointCount = random.pick([2, 3, 4, 5, 6, 7]);
  const xyPoints = array(pointCount).map(() => {
    const [x2, y2] = random.onCircle(l * noise);
    return { x: x + x2, y: y + y2 };
  });
  const hulledXyPoints = convexHull(xyPoints);
  const randomIndex = random.rangeFloor(hulledXyPoints.length);
  const rearrangedHulledXyPoints = [
    ...hulledXyPoints.slice(randomIndex),
    ...hulledXyPoints.slice(0, randomIndex)
  ];
  let glyphLines = [];

  const convexLine = rearrangedHulledXyPoints.map(({ x, y }) => [x, y]);
  glyphLines.push(convexLine);

  // if (pointCount < 4) {
  //   const shift = meas / 50;
  //   const shiftedLine = convexLine.map(([x, y]) => [x + shift, y + shift]);
  //   glyphLines.push(shiftedLine);
  // }

  if (pointCount < 4) {
    const shift = meas / 15;
    const shiftedLine = convexLine.map(([x, y]) => [x + shift, y + shift]);
    glyphLines.push(shiftedLine);
  }

  return glyphLines;
}

const sketch = ({ width, height }) => {
  const meas = Math.min(width, height) / 13; // a measure for relative calculations

  const rows = 30;
  const columns = 40;
  const margin = Math.min(width, height) / 20;
  const points = createGrid(rows, columns).map(([u, v]) => {
    const x = lerp(margin * 1.5, width - margin * 1.5, u);
    const y = lerp(margin * 1.5, height - margin * 1.5, v);
    const noise = Math.abs(random.noise2D(u, v, 0.5, 2));
    return {
      position: [x, y],
      clampedNoise: clamp(noise, 0.25, 0.7),
      noise
    };
  });

  let lines = [];

  points.forEach(({ position, noise, clampedNoise }) => {
    lines = lines.concat(createGlyphLines(position, meas, clampedNoise));
  });

  // const box = [margin, margin, width - margin, height - margin];
  // lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings);
