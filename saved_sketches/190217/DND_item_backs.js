import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { lerp } from "canvas-sketch-util/math";
import createGrid from "../../util/createGrid";
import createCircleLine from "../../util/createCircleLine";

const settings = {
  dimensions: [6, 4],
  units: "in",
  pixelsPerInch: 300
};

function getCardBackLines(x, y, width, height) {
  const points = createGrid(14, 21).map(point => {
    const [u, v] = point;
    const noise = random.noise2D(u, v, 1, 2);
    return {
      position: [lerp(x, x + width, u), lerp(y, y + height, v)],
      noise
    };
  });
  let lines = [];

  points.forEach(point => {
    const [x, y] = point.position;
    const noise = point.noise;
    const r = (1 / 6) * Math.abs(noise) + 0.05;
    const circleLine = createCircleLine(x, y, r);
    lines.push(circleLine);
  });

  const box = [x, y, x + width, y + height];
  lines = clipPolylinesToBox(lines, box);

  return lines;
}

const sketch = ({ width, height }) => {
  let lines = [];
  const margin = 0.25; // 1/4 inch

  const leftCardBackLines = getCardBackLines(
    margin,
    margin,
    width / 2 - margin * 2,
    height - margin * 2
  );
  const rightCardBackLines = getCardBackLines(
    width / 2 + margin,
    margin,
    width / 2 - margin * 2,
    height - margin * 2
  );

  lines.push(...leftCardBackLines, ...rightCardBackLines);

  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings);
