import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import math from "canvas-sketch-util/math";
import random from "canvas-sketch-util/random";
import { createGrid } from "../../../util";
import flatten from "lodash/flatten";

const settings = {
  dimensions: [6, 4],
  units: "in",
  pixelsPerInch: 300
};

const sketch = ({ width, height }) => {
  // parameters
  const cols = 24;
  const numNoises = 50;

  // derived values
  const rows = Math.round((cols * height) / width);
  const margin = Math.max(width, height) / 20;

  // line generation
  let lines = [];
  createGrid(rows, cols)
    .filter(() => random.value() > 0)
    .forEach(([u, v], index) => {
      let line = [];

      const shiftAmp = 0.5;
      const shiftX = random.noise2D(u, v, 0.5, shiftAmp);
      const shiftY = random.noise2D(u + 1000, v + 1000, 0.5, shiftAmp);
      const initX = math.lerp(0, width - 0, u);
      const initY = math.lerp(0, height - 0, v);
      line.push([initX + shiftX, initY + shiftY]);

      const noiseStep = 0.1;
      for (
        let noiseZ = 0;
        noiseZ < noiseStep * numNoises;
        noiseZ += noiseStep
      ) {
        const angle = math.lerp(
          0,
          Math.PI * 2,
          random.noise3D(u, v, noiseZ, 0.5, 0.5)
        );
        const length = margin / 20;
        const [lastX, lastY] = line[line.length - 1];
        const dx = Math.cos(angle) * length;
        const dy = Math.sin(angle) * length;
        const newPosition = [lastX + dx, lastY + dy];
        line.push(newPosition);
      }

      lines.push(line);
    });

  lines.forEach((line, i) => {
    if (i % 2 === 0) {
      line.reverse();
    }
  });
  lines = [flatten(lines)];

  // rendering
  const box = [margin, margin, width - margin, height - margin];
  lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings);
