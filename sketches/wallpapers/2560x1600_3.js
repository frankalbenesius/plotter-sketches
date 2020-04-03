import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { lerp } from "canvas-sketch-util/math";
import { settings, createSphere, createGrid, logSeed } from "../../util";

const sketch = ({ width, height }) => {
  logSeed();
  let lines = [];

  lines.push(
    ...createSphere({
      center: [width * 0.5, height * 0.5],
      radius: height * 0.4,
      frequency: 2.5,
      amplitude: 1,
      shellLines: 140,
      arcSteps: 200,
      arcLength: 0.8,
      fillLength: 1,
      rotation: {
        x: random.range(Math.PI * 0, Math.PI * 0.3) * random.sign(),
        y: random.range(Math.PI * 0, Math.PI * 0.3) * random.sign(),
        z: 0
      }
    })
  );

  return props =>
    renderPolylines(lines, {
      ...props,
      lineWidth: 3,
      foreground: "#a4c5c6",
      background: "#856c8b",
    });
};

canvasSketch(sketch, {
  dimensions: [2560, 1600],
});
