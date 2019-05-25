import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { lerp } from "canvas-sketch-util/math";
import { settings, createSphere, createGrid } from "../../util";

const sketch = ({ width, height }) => {
  let lines = [];

  const sphereLines = createSphere({
    center: [width * 0.5, height * 0.5],
    radius: Math.min(width, height) * 0.4,
    frequency: 4,
    amplitude: 1,
    shellLines: 400,
    arcSteps: 100,
    arcLength: 1,
    rotation: {
      x: Math.PI * 0.5,
      y: 0,
      z: Math.PI * 2 * random.value()
    }
  });

  lines.push(...sphereLines);

  // const margin = Math.max(width, height) / 20;
  // const box = [margin, margin, width - margin, height - margin];
  // lines = clipPolylinesToBox(lines, box);
  return props =>
    renderPolylines(lines, {
      ...props,
      foreground: "#cc5500",
      background: "#e0d668"
    });
};

canvasSketch(sketch, settings.playground);
