import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { settings, logSeed } from "../../util";
import createNoisyLines from "../../util/createNoisyLines";

const sketch = ({ width, height }) => {
  logSeed(); // "53159" was cool
  let lines = [];
  const margin = Math.max(width, height) / 30;

  const noisyLines = createNoisyLines(
    [0, 0],
    [width, height * 0.8],
    0.7,
    1.2,
    1.5,
    0.5,
    1
  );
  lines.push(...noisyLines.filter(() => random.value() < 0.8));

  const noisySquare = createNoisyLines(
    [width * 0.2, height * 0.4],
    [width * 0.5, height * 0.9],
    1,
    1.2,
    1.5,
    0.5,
    1
  );
  lines.push(...noisySquare.filter(() => random.value() < 0.8));

  const box = [margin, margin, width - margin, height - margin];
  lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings.large);
