import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { lerp } from "canvas-sketch-util/math";

import {
  settings,
  createCircleLine,
  rotate3dLinesAboutOrigin,
  orthographicProjection
} from "../../util";

const randomAngle = () => random.value() * Math.PI * 2;

const sketch = ({ width, height }) => {
  let unprojectedLines = [];

  const numLines = 200;
  const radius = 0.45;
  const steps = 100;

  for (let i = 0; i < numLines; i++) {
    const flatCircleLine = createCircleLine(
      0,
      0,
      radius,
      steps,
      randomAngle(),
      Math.round(steps * random.range(0.05, 0.1))
    );
    const unflatCircleLine = flatCircleLine.map(([x, y]) => [x, y, 0]);
    const unrotatedLines = [unflatCircleLine];
    const rotatedLines = rotate3dLinesAboutOrigin(unrotatedLines);
    unprojectedLines.push(...rotatedLines);
  }

  const lines = orthographicProjection(unprojectedLines, width, height);

  // const margin = Math.max(width, height) / 20;
  // const box = [margin, margin, width - margin, height - margin];
  // lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings.postcard);
