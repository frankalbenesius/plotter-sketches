import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import math from "canvas-sketch-util/math";
import random from "canvas-sketch-util/random";
import { createGrid } from "../../../util";

const settings = {
  dimensions: [1024, 1024]
};

const sketch = ({ width, height }) => {
  // parameters
  const cols = 30;
  const numNoises = 30;

  // derived values
  const rows = Math.round((cols * height) / width);
  const margin = Math.max(width, height) / 20;

  // line generation
  let lines = [];
  createGrid(rows, cols).forEach(([u, v], index) => {
    let line = [];

    const initX = math.lerp(margin, width - margin, u);
    const initY = math.lerp(margin, height - margin, v);
    line.push([initX, initY]);

    for (let noiseZ = 0; noiseZ < numNoises; noiseZ += 1) {
      const angle = random.noise3D(u, v, noiseZ, 0.1, 1) * Math.PI * 2;
      const shift = margin * 10000; // just to make angle & length different
      // const length = random.noise3D(u + shift, v + shift, noiseZ, 1, 100);
      const length = margin / 15;
      const [lastX, lastY] = line[line.length - 1];
      const dx = Math.cos(angle) * length;
      const dy = Math.sin(angle) * length;
      const newPosition = [lastX + dx, lastY + dy];
      line.push(newPosition);
    }

    lines.push(line);
  });

  // rendering
  const box = [margin, margin, width - margin, height - margin];
  lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings);
