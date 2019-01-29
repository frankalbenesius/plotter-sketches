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
  // List of polylines for our pen plot
  let lines = [];

  // Draw some circles expanding outward
  let steps = 4;
  let count = 100;
  let spacing = Math.min(width, height) * 0.05;
  let radius = Math.min(width, height) * 0.1;
  for (let j = 0; j < count; j++) {
    let r = radius + j * spacing;
    let circle = [];
    for (let i = 0; i < steps; i++) {
      let t = i / Math.max(1, steps - 1);
      let angle = Math.PI * 2 * t;
      circle.push([
        width / 2 + Math.cos(angle) * r,
        height / 2 + Math.sin(angle) * r
      ]);
    }
    lines.push(circle);
  }

  // Draw some circles expanding outward
  steps = 7;
  count = 100;
  spacing = Math.min(width, height) * 0.05;
  radius = Math.min(width, height) * 0.1;
  for (let j = 0; j < count; j++) {
    let r = radius + j * spacing;
    let circle = [];
    for (let i = 0; i < steps; i++) {
      let t = i / Math.max(1, steps - 1);
      let angle = Math.PI * 2 * t;
      circle.push([
        width / 2 + Math.cos(angle) * r,
        height / 2 + Math.sin(angle) * r
      ]);
    }
    lines.push(circle);
  }

  // Clip all the lines to a margin
  let margin = 0.65;
  const box = [margin, margin, width - margin, height - margin];
  lines = clipPolylinesToBox(lines, box);

  // The 'penplot' util includes a utility to render
  // and export both PNG and SVG files
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings);
