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
      radius: width * 0.4,
      frequency: 3,
      amplitude: 0.5,
      shellLines: 50,
      arcSteps: 200,
      arcLength: 1,
      fillLength: 1,
      rotation: {
        x: random.range(Math.PI * 0, Math.PI * 0.3) * random.sign(),
        y: random.range(Math.PI * 0, Math.PI * 0.3) * random.sign(),
        z: 0,
      },
    })
  );

  return (props) =>
    renderPolylines(lines, {
      ...props,
      foreground: "#00909e",
      background: "#dae1e7",
    });
};

canvasSketch(sketch, {
  dimensions: [5, 5],
  units: "in",
  pixelsPerInch: 300,
  scaleToView: true,
});
