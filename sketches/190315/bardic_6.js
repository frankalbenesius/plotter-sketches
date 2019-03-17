import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import { lerp } from "canvas-sketch-util/math";
import random from "canvas-sketch-util/random";
import { settings, logSeed } from "../../util";
import createNoisyLines from "../../util/createNoisyLines";

const sketch = ({ width, height }) => {
  logSeed("994099"); //"328141"
  let lines = [];
  const margin = Math.max(width, height) / 30;

  const noisyLines = createNoisyLines(
    [margin * 1.5, margin],
    [width - margin * 1.5, height - margin],
    0.25,
    1.5,
    2,
    0.1,
    0.5,
    Math.PI * 0.5
  );

  for (let i = 0.1; i < 0.99; i += 0.1) {
    const boxHeight = margin * 1.3;
    const y = lerp(margin, height - margin, i);
    const line = [[margin, y], [width - margin, y]];
    lines.push(
      ...createNoisyLines(
        [margin, y - boxHeight / 2],
        [width - margin, y + boxHeight / 2],
        1,
        1,
        0.66,
        0.5,
        1
      )
    );
  }

  // lines.push(...noisyLines.filter(() => random.value() < 0.8));

  // const box = [margin, margin, width - margin, height - margin];
  // lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings.large);
