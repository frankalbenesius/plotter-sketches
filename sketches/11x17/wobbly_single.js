import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { lerp } from "canvas-sketch-util/math";
import { settings, createSphere, createGrid, logSeed } from "../../util";

canvasSketch(sketch, {
  dimensions: [11, 17], // 6x6in
  units: "in",
  pixelsPerInch: 300,
  scaleToView: true
});

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

  return props =>
    renderPolylines(lines, {
      ...props
    });
};
