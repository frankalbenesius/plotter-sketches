import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { lerp } from "canvas-sketch-util/math";
import { settings, createSphere, createGrid, logSeed } from "../../util";

const sketch = ({ width, height }) => {
  let lines = [];

  for (let i = 0; i < 10; i++) {
    lines.push(
      ...createSphere({
        center: [width * 0.5, height * 0.5],
        radius: height * (0.3 + Math.random() * 0.2),
        frequency: 0,
        amplitude: 0,
        shellLines: Math.round(Math.random() * 150) + 100,
        arcSteps: 300,
        arcLength: 0.1,
        fillLength: 1,
      })
    );
  }

  return (props) =>
    renderPolylines(lines, {
      ...props,
      lineWidth: 3,
      foreground: "#00a8cc",
      background: "#005082",
    });
};

canvasSketch(sketch, {
  dimensions: [2560, 1600],
});
