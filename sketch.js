import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";

const settings = {
  dimensions: [1024, 1024]
};

const sketch = ({ width, height }) => {
  let lines = [];
  const margin = Math.max(width, height) / 20;

  var position = [0, 0];
  let x = 0;
  while (position[0] < width && position[1] < height && x < 90) {
    const randomCirclePoint = random.onCircle(margin / 4);
    const bottomRightCirclePoint = randomCirclePoint.map(Math.abs);
    const nextPosition = [
      position[0] + bottomRightCirclePoint[0],
      position[1] + bottomRightCirclePoint[1]
    ];
    lines.push([position, nextPosition]);
    position = nextPosition;
    x++;
  }
  console.log(lines);

  const box = [margin, margin, width - margin, height - margin];
  lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings);
