import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { lerp, clamp } from "canvas-sketch-util/math";
import {
  settings,
  createGrid,
  projectUVLines,
  rotate3DLines
} from "../../util";
import createCutLines from "../../util/createCutLines";

const sketch = ({ width, height }) => {
  let lines = [];
  const margin = width * 0.1;

  createGrid(24, 24).map(point => {
    const [u, v] = point;
    const x = lerp(margin, width - margin, u);
    const y = lerp(margin, height - margin, v);
    const noise = random.noise2D(u, v, 1, 1);
    const rotation = {
      x: Math.PI * 1 * noise * 0.5,
      y: Math.PI * 1 * noise * 0.3,
      z: Math.PI * 1 * noise * 0.1
    };
    const planeLines = createRotatedPlaneLines([x, y], rotation, width * 0.024);
    lines.push(...planeLines);
  });

  // const cutMargin = 0.25;
  // const cutLineLength = 0.1;
  // lines.push(...createCutLines(width, height, cutMargin, cutLineLength));
  return props =>
    renderPolylines(lines, {
      ...props,
      lineWidth: 1,
      foreground: "#c97b33",
      background: "#eee"
    });
};

const createRotatedPlaneLines = (point, rotation, size) => {
  let gridLines3DUV = [];
  for (let x = 0; x <= 1; x += 0.1) {
    const xPos = lerp(0, 1, x);
    const startPos = [xPos, 0, 0.5];
    5;
    const endPos = [xPos, 1, 0.5];
    gridLines3DUV.push([startPos, endPos]);
  }
  for (let x = 0; x <= 1; x += 0.1) {
    const yPos = lerp(0, 1, x);
    const startPos = [0, yPos, 0.5];
    const endPos = [1, yPos, 0.5];
    gridLines3DUV.push([startPos, endPos]);
  }
  const rotatedGridLines = rotate3DLines(gridLines3DUV, rotation, [
    0.5,
    0.5,
    0.5
  ]);
  return projectUVLines(rotatedGridLines, point, size);
};

canvasSketch(sketch, settings.instagram);
