import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { lerp } from "canvas-sketch-util/math";
import { settings, createSphere, createGrid } from "../../../util";

const sketch = ({ width, height }) => {
  let lines = [];

  const sphereLines = createSphere({
    center: [width * 0.5, height * 0.5],
    radius: Math.min(width, height) * 0.4,
    frequency: 4,
    amplitude: 0.6,
    shellLines: 200,
    arcSteps: 200,
  });

  lines.push(...sphereLines);

  // const margin = Math.max(width, height) / 20;
  // const box = [margin, margin, width - margin, height - margin];
  // lines = clipPolylinesToBox(lines, box);
  return props =>
    renderPolylines(lines, {
      ...props,
      lineWidth: 2,
      foreground: "#92c84c",
      background: "#909090"
    });
};

canvasSketch(sketch, settings.workScreen);
