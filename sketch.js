import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
// import createGrid from "./util/createGrid";
import { lerp, clamp } from "canvas-sketch-util/math";
import array from "new-array";
import convexHull from "convexhull-js";

const settings = {
  dimensions: [5.5, 4.25],
  units: "in",
  pixelsPerInch: 300
};

random.setSeed("winter");

const createGrid = (xCount = 60, yCount = xCount) => {
  const points = [];
  for (let x = 0; x < xCount; x++) {
    for (let y = 0; y < yCount; y++) {
      const u = xCount <= 1 ? 0.5 : x / (xCount - 1);
      const v = xCount <= 1 ? 0.5 : y / (yCount - 1);
      points.push({
        noise: random.noise2D(u, v, 0.25, 2.6), // -1..1
        position: [u, v]
      });
    }
  }
  return points;
};

const sketch = ({ width, height }) => {
  const rel = Math.min(width, height);
  const margin = rel / 15;
  let lines = [];

  const ratio = width / height;
  const points = createGrid(29, 40).filter(point => Math.abs(point.noise) >= 0);

  points.forEach(point => {
    const { position, noise } = point;
    const [u, v] = position;
    const lerpMargin = margin * 1.2; // so as to not clip anything too close to edge
    const x = lerp(lerpMargin, width - lerpMargin, u);
    const y = lerp(lerpMargin, height - lerpMargin, v);

    const radius = (rel / 80) * Math.abs(noise);
    const theta = Math.PI * 2 * Math.min(1.4, Math.max(0.95, Math.abs(noise)));

    const line = [
      [x - Math.cos(theta) * radius, y - Math.sin(theta) * radius],
      [x + Math.cos(theta) * radius, y + Math.sin(theta) * radius]
    ];
    lines.push(line);
  });

  points.forEach(point => {
    const { position, noise } = point;
    const [u, v] = position;
    const lerpMargin = margin * 1.2; // so as to not clip anything too close to edge
    const x = lerp(lerpMargin, width - lerpMargin, 1 - u);
    const y = lerp(lerpMargin, height - lerpMargin, v);

    const radius = (rel / 80) * Math.abs(noise);
    const theta = Math.PI * -2 * Math.min(1.4, Math.max(0.95, Math.abs(noise)));

    const line = [
      [x - Math.cos(theta) * radius, y - Math.sin(theta) * radius],
      [x + Math.cos(theta) * radius, y + Math.sin(theta) * radius]
    ];
    lines.push(line);
  });

  // Clip all the lines to a margin
  const box = [margin, margin, width - margin, height - margin];
  lines = clipPolylinesToBox(lines, box);

  // The 'penplot' util includes a utility to render
  // and export both PNG and SVG files
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings);
