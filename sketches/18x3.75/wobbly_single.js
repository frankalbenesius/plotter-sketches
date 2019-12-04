import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { lerp } from "canvas-sketch-util/math";
import { settings, createSphere, createGrid, logSeed } from "../../util";

const sketch = ({ width, height }) => {
  logSeed();
  let lines = [];

  const balls = 8;
  for (let i = 0; i <= balls; i++) {
    lines.push(
      ...createSphere({
        center: [lerp(0, width, i / balls), height * 0.5],
        radius: height * 0.4,
        frequency: i * 0.5,
        amplitude: 1.2,
        shellLines: 50,
        arcSteps: 400,
        rotation: {
          x: random.range(Math.PI * 0, Math.PI * 0.3) * random.sign(),
          y: random.range(Math.PI * 0, Math.PI * 0.3) * random.sign(),
          z: 0
        }
      })
    );
  }

  return props =>
    renderPolylines(lines, {
      ...props,
      foreground: "#00e691",
      background: "#00ffa2",
      lineWidth: "0.01"
    });
};

canvasSketch(sketch, {
  dimensions: [18, 3.75],
  units: "in",
  pixelsPerInch: 300,
  scaleToView: true
});
