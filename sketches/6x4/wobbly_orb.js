import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import random from "canvas-sketch-util/random";
import { settings, logSeed, createSphere } from "../../util";

const sketch = ({ width, height }) => {
  logSeed();
  let lines = [];

  lines.push(
    ...createSphere({
      center: [width * 0.5, height * 0.5],
      radius: width * 0.3,
      frequency: 1,
      amplitude: 1,
      shellLines: 60,
      arcSteps: 8,
      arcLength: 1,
      fillLength: 1,
      rotation: {
        x: random.range(Math.PI * 0, Math.PI * 0.3) * random.sign(),
        y: random.range(Math.PI * 0, Math.PI * 0.3) * random.sign(),
        z: 0,
      },
    })
  );

  return (props) =>
    renderPolylines(lines, {
      ...props,
    });
};

canvasSketch(sketch, settings.postcard);
