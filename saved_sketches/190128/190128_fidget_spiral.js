const canvasSketch = require("canvas-sketch");
const { renderPolylines } = require("canvas-sketch-util/penplot");
const { clipPolylinesToBox } = require("canvas-sketch-util/geometry");

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

  const r = 0;
  const spacing = 0.0045;

  let line = [];
  for (let i = 0; i < 1025; i++) {
    const angle = 0.05 * i;
    const widener = i * spacing + r;
    const fWidener = widener + (Math.random() - 0.5) * 0.018 * Math.sqrt(i);
    const x = Math.cos(angle) * fWidener + cx;
    const y = Math.sin(angle) * fWidener + cy;
    const point = [x, y];
    line.push(point);
  }

  lines.push(line);

  // Clip all the lines to a margin
  const margin = 0.5;
  const box = [margin, margin, width - margin, height - margin];
  lines = clipPolylinesToBox(lines, box);

  // The 'penplot' util includes a utility to render
  // and export both PNG and SVG files
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings);
