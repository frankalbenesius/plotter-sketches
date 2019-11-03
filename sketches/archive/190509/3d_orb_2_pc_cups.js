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
} from "../../../../util";

const randomAngle = () => random.value() * Math.PI * 2;

const sketch = ({ width, height }) => {
  let unprojectedLines = [];

  const numLines = 80;
  const radius = 0.38;
  const steps = 100;

  for (let i = 0; i < numLines; i++) {
    const flatCircleLine = createCircleLine(
      0,
      0,
      radius,
      steps,
      0,
      Math.round(steps / 2)
    );
    const unflatCircleLine = flatCircleLine.map(([x, y]) => [x, y, 0]);
    const unrotatedLines = [unflatCircleLine];
    const rotatedLines = rotate3dLinesAboutOrigin(
      unrotatedLines,
      Math.PI * random.value(),
      0,
      Math.PI * random.value()
    );
    unprojectedLines.push(...rotatedLines);
  }

  const lines = orthographicProjection(
    rotate3dLinesAboutOrigin(unprojectedLines),
    width,
    height
  );

  // const margin = Math.max(width, height) / 20;
  // const box = [margin, margin, width - margin, height - margin];
  // lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings.postcard);
