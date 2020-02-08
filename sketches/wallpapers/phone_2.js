import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { lerp } from "canvas-sketch-util/math";
import { settings, createSphere, createGrid, logSeed } from "../../util";

const sketch = ({ width, height }) => {
  logSeed();
  const margin = Math.min(width, height) * 0.05;
  let lines = [];

  createGrid(36, 74).map(([u, v]) => {
    let x = lerp(margin, width - margin, u);
    let y = lerp(margin, height - margin, v);

    // noisy
    let noise = random.noise2D(x, y, 0.5, 1);

    // less noisy
    if (u >= 0.5) {
      noise = random.noise2D(x, y, 0.0005, 1);
    }

    lines.push(
      ...createSphere({
        center: [x, y],
        radius: Math.min(width, height) * 0.02,
        frequency: 1,
        amplitude: 1,
        shellLines: 2,
        arcSteps: 200,
        arcLength: 1,
        fillLength: 1,
        rotation: {
          x: noise * Math.PI * 2,
          y: noise * 0.5 * Math.PI * 2,
          z: 0
        }
      })
    );
  });

  return props =>
    renderPolylines(lines, {
      ...props,
      lineWidth: 3,
      foreground: "#0c7b93",
      background: "#142850"
    });
};

canvasSketch(sketch, {
  dimensions: [1440, 2960]
});
