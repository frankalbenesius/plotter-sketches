import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import random from "canvas-sketch-util/random";
import { settings, logSeed } from "../../util";
import createNoisyLines from "../../util/createNoisyLines";

const sketch = ({ width, height }) => {
  logSeed();
  let lines = [];
  const margin = Math.max(width, height) / 30;

  const startAngle = Math.random() * Math.PI;
  for (let i = 0; i < 3; i++) {
    const angle = startAngle + (i * (Math.PI * 2)) / 4;
    lines.push(
      ...createNoisyLines(
        [margin, margin],
        [width - margin, height - margin],
        1.2,
        0.6,
        0.4,
        0.4,
        1.5,
        angle
      )
    );
  }

  // const box = [margin, margin, width - margin, height - margin];
  // lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings.postcard);
