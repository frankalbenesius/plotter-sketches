import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { lerp } from "canvas-sketch-util/math";
import range from "lodash/range";
import { settings, distanceBetweenPoints } from "../../util";
import createNoisyLines from "../../util/createNoisyLines";

const sketch = ({ width, height }) => {
  let lines = [];
  const margin = Math.max(width, height) / 20;
  const gutter = margin / 4; // half margin

  lines.push(
    ...createNoisyLines(
      [width * (0 / 3) + margin, margin],
      [width * (1 / 3) - gutter, height - margin]
    )
  );
  lines.push(
    ...createNoisyLines(
      [width * (1 / 3) + gutter, margin],
      [width * (2 / 3) - gutter, height - margin]
    )
  );
  lines.push(
    ...createNoisyLines(
      [width * (2 / 3) + gutter, margin],
      [width * (3 / 3) - margin, height - margin]
    )
  );

  // const box = [margin, margin, width - margin, height - margin];
  // lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings.postcard);
