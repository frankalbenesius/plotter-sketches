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
      radius: width * 0.4,
      frequency: 4,
      amplitude: 1,
      shellLines: 100,
      arcSteps: 200,
      arcLength: 1,
      fillLength: 1
    })
  );

  return props =>
    renderPolylines(lines, {
      ...props,
      lineWidth: 0.3
    });
};

canvasSketch(sketch, {
  dimensions: [152.4, 152.4], // 6x6in
  units: "mm",
  pixelsPerInch: 300,
  scaleToView: true
});
