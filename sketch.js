const canvasSketch = require("canvas-sketch");
const { renderPolylines } = require("canvas-sketch-util/penplot");
const { clipPolylinesToBox } = require("canvas-sketch-util/geometry");

import SimplexNoise from "simplex-noise";

const simplex = new SimplexNoise();

const postcardCMs = [15.24, 10.16];
const settings = {
  dimensions: postcardCMs,
  pixelsPerInch: 300,
  units: "cm"
};

const sketch = ({ width, height }) => {
  const cx = width / 2;
  const cy = height / 2;
  // List of polylines for our pen plot
  let lines = [];

  const r = 0.05;
  const spacing = 0.003;

  let line = [];
  let line2 = [];
  for (let i = 100; i < 1000; i++) {
    const angle = 0.05 * i;
    const widener = i * spacing + r;

    const fWidener = simplex.noise2D(i * 100, 0) * 0.2 + widener;
    const x = Math.cos(angle) * fWidener + cx;
    const y = Math.sin(angle) * fWidener + cy;
    const point = [x, y];
    line.push(point);

    const fWidener2 = simplex.noise2D((i + 5) * 100, 0) * 0.2 + widener;
    const x2 = Math.cos(angle) * fWidener2 + cx;
    const y2 = Math.sin(angle) * fWidener2 + cy;
    const point2 = [x2, y2];
    line2.push(point2);
  }

  lines.push(line);
  lines.push(line2);

  // Clip all the lines to a margin
  const margin = 0.5;
  const box = [margin, margin, width - margin, height - margin];
  lines = clipPolylinesToBox(lines, box);

  // The 'penplot' util includes a utility to render
  // and export both PNG and SVG files
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings);

function valBetween(val, min, max) {
  return Math.min(max, Math.max(min, val));
}
