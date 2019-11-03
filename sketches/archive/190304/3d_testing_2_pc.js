import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import math from "canvas-sketch-util/math";
import random from "canvas-sketch-util/random";
import { createGrid } from "../../../util";

const settings = {
  dimensions: [6, 4],
  units: "in",
  pixelsPerInch: 300
};

const sketch = ({ width, height }) => {
  // parameters
  const cols = 60;
  const numNoises = 10;

  // derived values
  const rows = Math.round((cols * height) / width);
  const margin = Math.max(width, height) / 20;

  // line generation
  let lines = [];
  createGrid(rows, cols)
    .filter(() => random.value() > 0.4)
    .forEach(([u, v], index) => {
      let line = [];

      const initX = math.lerp(margin, width - margin, u);
      const initY = math.lerp(margin, height - margin, v);
      line.push([initX, initY]);

      const noiseStep = 0.1;
      for (
        let noiseZ = 0;
        noiseZ < noiseStep * numNoises;
        noiseZ += noiseStep
      ) {
        const angle = random.noise3D(u, v, noiseZ, 0.5, 1) * Math.PI * 2;
        const length = margin / 20;
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
