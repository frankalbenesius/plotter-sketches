import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import math from "canvas-sketch-util/math";
import random from "canvas-sketch-util/random";
import { createGrid, logSeed, angleBetweenPoints, settings } from "../../util";
import array from "new-array";

const sketch = ({ width, height }) => {
  logSeed();

  let lines = [];
  const margin = Math.max(width, height) / 20;

  createGrid(10, 10).forEach(([u, v]) => {
    const point = [
      math.lerp(margin, width - margin, u),
      math.lerp(margin, height - margin, v)
    ];
    const randomAngle = random.value() * Math.PI * 2;
    const leafLines = createLeafLines(point, margin * 5, randomAngle);
    lines.push(...leafLines);
  });

  const box = [margin, margin, width - margin, height - margin];
  lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

function createLeafLines(leafStart = [0, 0], length = 0, angle = 0) {
  let lines = [];

  const leafRandom = random.createRandom(
    leafStart[0] * 1000 + leafStart[1] / 1000
  );
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
