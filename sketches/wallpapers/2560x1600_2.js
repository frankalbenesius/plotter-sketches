import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { lerp } from "canvas-sketch-util/math";
import { settings, createSphere, createGrid, logSeed } from "../../util";

const sketch = ({ width, height }) => {
  logSeed();
  const margin = Math.min(width, height) * -0.1;
  let lines = [];

  createGrid(128, 80).map(([u, v]) => {
    let x = lerp(margin, width - margin, u);
    let y = lerp(margin, height - margin, v);
    let xNoise = random.noise2D(u, v, 2, 0.35);
    let yNoise = random.noise2D(u + 100000, v, 2, 0.35);

    lines.push(
      ...createSphere({
        center: [x, y],
        radius: Math.min(width, height) * 0.005,
        frequency: 1,
        amplitude: 1,
        shellLines: 2,
        arcSteps: 200,
        arcLength: 1,
        fillLength: 1,
        rotation: {
          x: Math.PI * xNoise,
          y: Math.PI * yNoise,
          z: 0
        }
      })
    );
  });

  return props =>
    renderPolylines(lines, {
      ...props,
      lineWidth: 3,
      foreground: "#27496d",
      background: "#142850"
    });
};

canvasSketch(sketch, {
  dimensions: [2560, 1600]
});
