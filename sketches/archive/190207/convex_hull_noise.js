import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import createGrid from "../../util/createGrid";
import { lerp } from "canvas-sketch-util/math";
import array from "new-array";
import convexHull from "convexhull-js";

const settings = {
  dimensions: [1000, 1000]
};

function createGlyphLines(position, meas, noise) {
  const [x, y] = position;
  const l = meas / 5;
  const pointCount = random.rangeFloor(3, 8);
  const xyPoints = array(pointCount).map(() => {
    const [x2, y2] = random.onCircle(l * Math.abs(noise));
    return { x: x + x2, y: y + y2 };
  });
  const hulledXyPoints = convexHull(xyPoints);
  const randomIndex = random.rangeFloor(hulledXyPoints.length);
  const rearrangedHulledXyPoints = [
    ...hulledXyPoints.slice(randomIndex),
    ...hulledXyPoints.slice(0, randomIndex)
  ];
  return rearrangedHulledXyPoints.map(({ x, y }) => [x, y]);
}

const sketch = ({ width, height }) => {
  const meas = Math.min(width, height) / 10; // a measure for relative calculations

  const rows = 50;
  const columns = 50;
  const margin = meas / 2;
  const points = createGrid(rows, columns).map(([u, v]) => {
    const x = lerp(margin * 1.5, width - margin * 1.5, u);
    const y = lerp(margin * 1.5, height - margin * 1.5, v);
    return {
      position: [x, y],
      noise: random.noise2D(u, v, 0.1, 1.5)
    };
  });

  let lines = [];
  points.forEach(({ position, noise }) => {
    lines.push(createGlyphLines(position, meas, noise));
  });

  const box = [margin, margin, width - margin, height - margin];
  lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings);
