import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { random } from "canvas-sketch-util";
import { settings, createSphere, logSeed } from "../../util";

const sketch = ({ width, height }) => {
  logSeed();
  let lines = [];

  for (let i = 0; i < 1; i++) {
    lines.push(
      ...createSphere({
        center: [width * 0.5, height * 0.5],
        radius: width * random.range(0.3, 0.3),
        frequency: random.range(4, 8),
        amplitude: random.range(0.2, 0.4),
        shellLines: random.rangeFloor(50, 90),
        arcSteps: random.rangeFloor(25, 50),
        arcLength: random.range(0.8, 0.98),
        fillLength: 1,
      })
    );
  }

  return (props) =>
    renderPolylines(lines, {
      ...props,
    });
};

canvasSketch(sketch, settings.postcard);
