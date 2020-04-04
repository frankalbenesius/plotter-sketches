import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { settings, createNoisyLines, logSeed } from "../../util";

const sketch = ({ width, height }) => {
  logSeed();
  let lines = [];
  const margin = 0.125;

  const padding = 1.1;
  const segment = 1;
  const fill = 1;
  const freq = 1;
  const amp = 0.75;
  const noisyLines = createNoisyLines(
    [0, 0],
    [width, height],
    padding,
    segment,
    fill,
    freq,
    amp
  );

  lines.push(...noisyLines.filter(() => random.value() < 1.1));

  const box = [margin, margin, width - margin, height - margin];
  lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings.postcard);
