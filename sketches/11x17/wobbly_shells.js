import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { lerp } from "canvas-sketch-util/math";
import { settings, createSphere, createGrid, logSeed } from "../../util";

const sketch = ({ width, height }) => {
  logSeed("25867");
  let lines = [];

  for (let i = 0; i < 5; i++) {
    lines.push(
      ...createSphere({
        center: [width * 0.5, height * 0.5],
        radius: width * 0.3,
        frequency: Math.random() * 0.5 + 0.5,
        amplitude: Math.random() * 5 + 2,
        shellLines: Math.round(Math.random() * 150) + 100,
        arcSteps: 300,
        arcLength: Math.random() * 0.2 + 0.05,
        fillLength: 1,
      })
    );
  }

  return (props) =>
    renderPolylines(lines, {
      ...props,
    });
};

canvasSketch(sketch, {
  dimensions: [17, 11],
  units: "in",
  pixelsPerInch: 300,
  scaleToView: true,
});
