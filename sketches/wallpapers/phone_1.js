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
      frequency: 1,
      amplitude: 1,
      shellLines: 120,
      arcSteps: 200,
      arcLength: 1,
      fillLength: 1
    })
  );
  lines.push(
    ...createSphere({
      center: [width * 0.5, height * 0.5],
      radius: width * 2,
      frequency: 1,
      amplitude: 1,
      shellLines: 20,
      arcSteps: 200,
      arcLength: 1,
      fillLength: 1
    })
  );

  return props =>
    renderPolylines(lines, {
      ...props,
      lineWidth: 3,
      foreground: "#e7b18a",
      background: "#b1535a"
    });
};

canvasSketch(sketch, {
  dimensions: [1440, 2960]
});
