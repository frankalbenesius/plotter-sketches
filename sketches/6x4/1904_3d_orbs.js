import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { lerp } from "canvas-sketch-util/math";
import { settings, createSphere, createGrid, logSeed } from "../../util";

const sketch = ({ width, height }) => {
  logSeed("160500");

  let lines = [];
  const margin = 1;

  const centers = [
    [0, 0],
    [1, 0],
    [0.5, 0.25],
    [0, 0.5],
    [1, 0.5],
    [0.5, 0.75],
    [0, 1],
    [1, 1],
  ];
  centers.map(([u, v]) => {
    const x = lerp(margin, width - margin, u);
    const y = lerp(margin, height - margin, v);
    lines.push(
      ...createSphere({
        center: [x, y],
        radius: height * 0.1,
        frequency: 0,
        amplitude: 0,
        shellLines: 16,
        arcSteps: 140,
        arcLength: 1,
        fillLength: 1,
      })
    );
  });

  // Clip all the lines to a margin
  const clipMargin = 0;
  const box = [clipMargin, clipMargin, width - clipMargin, height - clipMargin];
  lines = clipPolylinesToBox(lines, box);

  return (props) => renderPolylines(lines, props);
};

canvasSketch(sketch, {
  dimensions: [4, 6],
  units: "in",
  pixelsPerInch: 300,
  scaleToView: true,
});
