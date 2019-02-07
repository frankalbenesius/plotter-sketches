const canvasSketch = require("canvas-sketch");
const { renderPolylines } = require("canvas-sketch-util/penplot");
const { clipPolylinesToBox } = require("canvas-sketch-util/geometry");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");

const settings = {
  dimensions: "postcard",
  orientation: "landscape",
  pixelsPerInch: 300
};

const createGrid = (xCount = 60, yCount = xCount) => {
  const points = [];
  for (let x = 0; x < xCount; x++) {
    for (let y = 0; y < yCount; y++) {
      const u = xCount <= 1 ? 0.5 : x / (xCount - 1);
      const v = xCount <= 1 ? 0.5 : y / (yCount - 1);
      points.push({
        noise: random.noise2D(u, v, 0.5, 3), // -1..1
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
  const widthPoints = 40;
  const heightPoints = widthPoints * ratio;
  const points = createGrid(widthPoints, heightPoints).filter(
    () => random.value() >= 0
  );

  points.forEach(point => {
    const { position, noise } = point;
    const [u, v] = position;
    const lerpMargin = margin * 1.2; // so as to not clip anything too close to edge
    const x = lerp(lerpMargin, width - lerpMargin, u);
    const y = lerp(lerpMargin, height - lerpMargin, v);

    const radius = (rel / 120) * Math.abs(noise) * 5;
    const theta = Math.PI * 2 * Math.abs(noise);

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
