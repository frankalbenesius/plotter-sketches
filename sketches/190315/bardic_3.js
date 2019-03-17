import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { lerp } from "canvas-sketch-util/math";
import range from "lodash/range";
import {
  settings,
  distanceBetweenPoints,
  createGrid,
  logSeed
} from "../../util";
import createNoisyLines from "../../util/createNoisyLines";

const sketch = ({ width, height }) => {
  logSeed();
  let lines = [];
  const margin = Math.max(width, height) / 30;

  const noisyLines = createNoisyLines([0, 0], [width, height]);

  lines.push(...noisyLines.filter(() => random.value() < 0.8));

  const box = [margin, margin, width - margin, height - margin];
  lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings.postcard);
