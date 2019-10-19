import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { lerp } from "canvas-sketch-util/math";

import { settings, createGrid, createSphere, logSeed } from "../../util";

const sketch = ({ width, height }) => {
  logSeed("391391");

  const cols = 2;
  const freq = 0.05;
  const amp = 1;
  const shellLines = 10;
  const arcSteps = 200;
  const arcLength = 1;
  const margin = 0.5; // half inch
  const actualWidth = width - margin * 2;
  const radius = actualWidth * (1 / cols) * 0.5;
  const rows = Math.round(cols * (height / width));

  let lines = [];

  createGrid(cols, rows).map(([u, v]) => {
    const point = [
      lerp(margin + radius, width - margin - radius, u),
      lerp(margin + radius, height - margin - radius, v)
    ];
    const noise = random.noise2D(u + Math.random() * 5, v, freq, amp);
    const rotation = {
      x: Math.PI * 2 * noise + Math.PI,
      y: Math.PI * 2 * noise * 3,
      z: Math.PI * 2 * noise * 6
    };
    lines.push(
      ...createSphere({
        center: point,
        radius: radius,
        shellLines,
        arcSteps,
        arcLength,
        rotation
      })
    );
    const newRotation = {
      ...rotation,
      y: rotation.y + Math.PI
    };
    lines.push(
      ...createSphere({
        center: point,
        radius: radius,
        shellLines,
        arcSteps,
        arcLength,
        rotation: newRotation
      })
    );
  });

  // const box = [margin, margin, width - margin, height - margin];
  // lines = clipPolylinesToBox(lines, box);
  return props =>
    renderPolylines(lines, {
      ...props,
      lineWidth: 0.076
      // foreground: "#3400f1",
      // background: "#00ffa2"
    });
};

canvasSketch(sketch, settings.tshirt);
