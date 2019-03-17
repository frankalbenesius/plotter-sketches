import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { settings, logSeed } from "../../util";
import createNoisyLines from "../../util/createNoisyLines";

const sketch = ({ width, height }) => {
  logSeed(); // "53159" was cool
  let lines = [];
  const margin = Math.max(width, height) / 8;
  const halfW = width / 2;
  const gutter = margin / 4;
  const stroke = margin * 0.8;

  const settings = [3, 0.4, 2, 2, 1];

  // J
  lines.push(
    ...createNoisyLines(
      [halfW - gutter - stroke, margin],
      [halfW - gutter, height - margin],
      ...settings
    )
  );
  lines.push(
    ...createNoisyLines(
      [margin, height - margin - stroke],
      [halfW - gutter, height - margin],
      ...settings
    )
  );
  lines.push(
    ...createNoisyLines(
      [margin, height / 2],
      [margin + stroke, height - margin],
      ...settings
    )
  );

  // O
  lines.push(
    ...createNoisyLines(
      [halfW + gutter, margin],
      [halfW + gutter + stroke, height - margin],
      ...settings
    )
  );
  lines.push(
    ...createNoisyLines(
      [halfW + gutter, margin],
      [width - margin, margin + stroke],
      ...settings
    )
  );
  lines.push(
    ...createNoisyLines(
      [width - margin - stroke, margin],
      [width - margin, height - margin],
      ...settings
    )
  );
  lines.push(
    ...createNoisyLines(
      [halfW + gutter, height - margin - stroke],
      [width - margin, height - margin],
      ...settings
    )
  );

  const box = [margin, margin, width - margin, height - margin];
  lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings.postcard);
