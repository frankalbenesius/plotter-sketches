import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { lerp } from "canvas-sketch-util/math";
import { settings, createSphere, createGrid } from "../../util";

const sketch = ({ width, height }) => {
  let lines = [];

  lines.push(
    ...createSphere({
      center: [width * 0.5, height * 0.5],
      radius: Math.min(width, height) * 0.45,
      frequency: 6,
      amplitude: 1,
      shellLines: 100,
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

canvasSketch(sketch, {
  dimensions: [5, 3.5],
  units: "in",
  pixelsPerInch: 300,
  scaleToView: true
});
