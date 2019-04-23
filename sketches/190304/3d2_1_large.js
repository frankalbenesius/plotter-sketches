import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import math from "canvas-sketch-util/math";
import random from "canvas-sketch-util/random";
import { createGrid, settings, logSeed } from "../../util";

const sketch = ({ width, height }) => {
  logSeed();

  // parameters
  const cols = 80;
  const numNoises = 20;

  // derived values
  const rows = Math.round((cols * height) / width);
  const margin = Math.max(width, height) * 0.13;

  // line generation
  let lines = [];
  createGrid(rows, cols)
    .filter(() => random.value() > 0)
    .forEach(([u, v], index) => {
      let line = [];

      const shiftX = random.noise2D(u, v, 2, 1);
      const shiftY = random.noise2D(u + 1000, v + 1000, 2, 1);
      const initX = math.lerp(margin, width - margin, u);
      const initY = math.lerp(margin, height - margin, v);
      line.push([initX + shiftX, initY + shiftY]);

      const noiseStep = 0.01;
      for (
        let noiseZ = 0;
        noiseZ < noiseStep * numNoises;
        noiseZ += noiseStep
      ) {
        const angle = math.lerp(0, Math.PI * 2, random.noise3D(u, v, noiseZ));
        const length = Math.max(width, height) * 0.001;
        const [lastX, lastY] = line[line.length - 1];
        const dx = Math.cos(angle) * length;
        const dy = Math.sin(angle) * length;
        const newPosition = [lastX + dx, lastY + dy];
        line.push(newPosition);
      }

      lines.push(line);
    });

  // rendering
  // const box = [margin, margin, width - margin, height - margin];
  // lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings.large);
