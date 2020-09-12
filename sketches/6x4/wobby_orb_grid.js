import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { lerp } from "canvas-sketch-util/math";
import { settings, createSphere, createGrid } from "../../../util";

const sketch = ({ width, height }) => {
  let lines = [];
  const margin = height * 0.05;

  createGrid(7, 5).map(([u, v]) => {
    const x = lerp(margin, width - margin, u);
    const y = lerp(margin, height - margin, v);
    lines.push(
      ...createSphere({
        center: [x, y],
        radius: height * 0.1,
        frequency: 1,
        amplitude: 2,
        shellLines: 10,
        arcSteps: 200,
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
  dimensions: [5.5, 3.5],
  units: "in",
  pixelsPerInch: 300,
  scaleToView: true,
});
