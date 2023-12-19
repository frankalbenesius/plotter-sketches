import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { lerp } from "canvas-sketch-util/math";
import { settings, createSphere, createGrid } from "../../util";

const sketch = ({ width, height }) => {
  let lines = [];
  const margin = height * 0.25;

  createGrid(6, 4).map(([u, v]) => {
    const x = lerp(margin, width - margin, u);
    const y = lerp(margin, height - margin, v);
    const rotation = {
      x: random.noise2D(u + 4000, v, 0.1, 1) * Math.PI + Math.PI * 0.25,
      y: random.noise2D(u + 1000, v, 0.1, 1) * Math.PI + Math.PI * 0.5,
      z: random.noise2D(u + 1000, v, 0.1, 1) * Math.PI + Math.PI * 0.25,
    };
    lines.push(
      ...createSphere({
        center: [x, y],
        radius: height * 0.1,
        frequency: 1,
        amplitude: 3,
        shellLines: 20,
        arcSteps: 200,
        arcLength: 1,
        fillLength: 1,
        rotation,
      })
    );
  });

  // Clip all the lines to a margin
  const clipMargin = 0;
  const box = [clipMargin, clipMargin, width - clipMargin, height - clipMargin];
  lines = clipPolylinesToBox(lines, box);

  return (props) => renderPolylines(lines, props);
};

canvasSketch(sketch, settings.postcard);
