import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import math from "canvas-sketch-util/math";
import random from "canvas-sketch-util/random";
import {
  createGrid,
  logSeed,
  angleBetweenPoints,
  settings,
  createCircleLine
} from "../../util";
import array from "new-array";

const sketch = ({ width, height }) => {
  logSeed();

  let lines = [];
  const margin = Math.max(width, height) / 20;

  for (let k = 0; k < 3; k++) {
    for (let i = 6; i < 9; i++) {
      const radius = margin / 5 + i / 10;
      const center = [math.lerp(0, width, k / 2), height / 2];
      const circlePoints = createCircleLine(center[0], center[1], radius);
      circlePoints.forEach(point => {
        const angle = angleBetweenPoints(center, point);
        const length = (margin * 20) / i;
        const leafLines = createLeafLines(point, length, angle);
        lines.push(...leafLines);
      });
    }
  }

  const box = [margin, margin, width - margin, height - margin];
  lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

function createLeafLines(leafStart = [0, 0], length = 0, angle = 0) {
  let lines = [];

  const leafRandom = random.createRandom();
  const spinePointCount = 30;
  const spineSegmentLength = length / spinePointCount;
  let spineLine = [leafStart];
  array(spinePointCount).forEach((_, i) => {
    const lastPoint = spineLine[spineLine.length - 1];
    let curAngle = angle;
    if (i > 0) {
      const pointBeforeLast = spineLine[spineLine.length - 2];
      curAngle = angleBetweenPoints(pointBeforeLast, lastPoint);
    }
    let angleShift = Math.abs(
      Math.PI * 2 * leafRandom.noise2D(lastPoint[0], lastPoint[1], 1, 0.05)
    );
    if (i > spinePointCount / 2) {
      angleShift = angleShift * -1;
    }
    const newAngle = curAngle + angleShift;
    const dx = Math.cos(newAngle) * spineSegmentLength;
    const dy = Math.sin(newAngle) * spineSegmentLength;
    const spinePoint = [lastPoint[0] + dx, lastPoint[1] + dy];
    spineLine.push(spinePoint);
  });
  lines.push(spineLine);

  spineLine.forEach((point, i) => {
    if (i > 0) {
      const [x, y] = point;
      const lastPoint = spineLine[i - 1];
      const angle = angleBetweenPoints(lastPoint, point) + Math.PI / 2;
      let t = (i / spinePointCount) * 2;
      if (i > spinePointCount / 2) {
        t = (1 - i / spinePointCount) * 2;
      }
      const hairLength = math.lerp(length / 50, length / 10, t);
      const dx = Math.cos(angle) * hairLength * 2;
      const dy = Math.sin(angle) * hairLength * 2;
      lines.push([point, [x + dx, y + dy]]);
    }
  });

  return lines;
}

canvasSketch(sketch, settings.postcard);
