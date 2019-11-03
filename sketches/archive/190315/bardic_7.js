import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import { lerp } from "canvas-sketch-util/math";
import random from "canvas-sketch-util/random";
import { settings, logSeed } from "../../../util";
import createNoisyLines from "../../util/createNoisyLines";

const sketch = ({ width, height }) => {
  logSeed();
  let lines = [];
  const margin = Math.max(width, height) / 30;

  const startAngle = Math.random() * Math.PI;
  for (let i = 0; i < 4; i++) {
    const angle = startAngle + (i * (Math.PI * 2)) / 4;
    lines.push(
      ...createNoisyLines(
        [margin, margin],
        [width - margin, height - margin],
        0.8,
        1.5,
        0.45,
        random.range(0.3, 0.6),
        1.2,
        angle
      )
    );
  }

  // const box = [margin, margin, width - margin, height - margin];
  // lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings.large);
