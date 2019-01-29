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
  const spacing = 0.0012;

  let line = [];
  for (let i = 0; i < 7400; i++) {
    const angle = 0.05 * i;
    const widener = i * spacing + r;
    const fidgettedWidener =
      widener + (Math.random() - 0.5) * 0.02 * Math.sqrt(i);

    const lowerBound = widener * 0.95;
    const upperBound = widener * 1.0;
    const boundedFidgettedWidener = valBetween(
      fidgettedWidener,
      lowerBound,
      upperBound
    );

    const x =
      Math.cos(angle / Math.sqrt(i / 1000)) * boundedFidgettedWidener + cx;
    const y =
      Math.sin(angle / Math.sqrt(i / 1000)) * boundedFidgettedWidener + cy;
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

function valBetween(val, min, max) {
  return Math.min(max, Math.max(min, val));
}
