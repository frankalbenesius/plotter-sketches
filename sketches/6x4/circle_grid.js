import canvasSketch from "canvas-sketch";
import { renderPaths } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import { lerp } from "canvas-sketch-util/math";
import random from "canvas-sketch-util/random";
import { createCircleLine, createGrid, settings } from "../../util";
import createCube from "../../util/createCube";

const sketch = ({ width, height }) => {
  let lines = [];
  const margin = 0.8;

  createGrid(60, 40).map(([u, v]) => {
    const x = lerp(margin, width - margin, u);
    const y = lerp(margin, height - margin, v);

    const noise = random.noise2D(u, v);

    lines.push(createCircleLine(x + noise * margin * 0.15, y, 0.02));
  });

  // Clip all the lines to a margin
  const clipMargin = 0;
  const box = [clipMargin, clipMargin, width - clipMargin, height - clipMargin];
  lines = clipPolylinesToBox(lines, box);

  return (props) => renderPaths(lines, props);
};

canvasSketch(sketch, settings.postcard);
