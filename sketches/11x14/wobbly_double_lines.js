import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { lerp } from "canvas-sketch-util/math";
import { settings, createSphere, createGrid, logSeed } from "../../util";

const sketch = ({ width, height }) => {
  logSeed(random.getRandomSeed());

  let lines = [];

  lines.push(
    ...createSphere({
      center: [width * 0.48, height * 0.5],
      radius: height * 0.4,
      frequency: 1,
      amplitude: 3,
      shellLines: 240,
      arcSteps: 200,
      arcLength: 1,
      fillLength: 1,
      rotation: {
        x: random.range(Math.PI * 0, Math.PI * 0.3) * random.sign(),
        y: random.range(Math.PI * 0, Math.PI * 0.3) * random.sign(),
        z: 0
      },
      randomizeShellLines: false
    })
  );

  return props =>
    renderPolylines(lines, {
      ...props
    });
};

canvasSketch(sketch, {
  dimensions: [14, 11],
  units: "in",
  pixelsPerInch: 300,
  scaleToView: true
});
