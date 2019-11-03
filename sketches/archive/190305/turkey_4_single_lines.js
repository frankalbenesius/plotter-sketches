import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import math from "canvas-sketch-util/math";
import random from "canvas-sketch-util/random";
import { createGrid, logSeed, angleBetweenPoints, settings } from "../../../util";
import array from "new-array";
import flatten from "lodash/flatten";

const sketch = ({ width, height }) => {
  logSeed();

  let lines = [];
  const margin = Math.max(width, height) / 20;

  createGrid(9, 12).forEach(([u, v]) => {
    const point = [
      math.lerp(margin, width - margin, u),
      math.lerp(margin, height - margin, v)
    ];
    const angle = (random.noise2D(u, v, 0.1, 1) * Math.PI) / 2 + Math.PI / 8;
    const leafLines = createLeafLines(point, margin * 1.5, angle);
    lines.push(...leafLines);
  });

  const box = [margin, margin, width - margin, height - margin];
  lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

function createLeafLines(leafStart = [0, 0], length = 0, angle = 0) {
  let lines = [];

  const leafRandom = random.createRandom();
  const spinePointCount = 15;
  const spineSegmentLength = length / spinePointCount;

  let spinePoints = [leafStart];
  array(spinePointCount).forEach((_, i) => {
    const lastPoint = spinePoints[spinePoints.length - 1];
    let curAngle = angle;
    if (i > 0) {
      const pointBeforeLast = spinePoints[spinePoints.length - 2];
      curAngle = angleBetweenPoints(pointBeforeLast, lastPoint);
    }
    let angleShift = Math.abs(
      Math.PI * 2 * leafRandom.noise2D(lastPoint[0], lastPoint[1], 0.005, 0.1)
    );
    if (i > spinePointCount / 2) {
      angleShift = angleShift * -1;
    }
    const newAngle = curAngle + angleShift;
    const dx = Math.cos(newAngle) * spineSegmentLength;
    const dy = Math.sin(newAngle) * spineSegmentLength;
    const spinePoint = [lastPoint[0] + dx, lastPoint[1] + dy];
    spinePoints.push(spinePoint);
  });

  let singleLine = [];
  spinePoints.forEach((point, i) => {
    if (i > 0) {
      const [x, y] = point;
      const lastPoint = spinePoints[i - 1];
      const angle = angleBetweenPoints(lastPoint, point) + Math.PI / 2;

      const peakPoint = random.range(1, 5);
      let t = (i / spinePointCount) * 2;
      if (i > spinePointCount / peakPoint) {
        t = (1 - i / spinePointCount) * 2;
      }
      const hairLength = math.lerp(length / 50, length / 10, t) * 2;
      const dx = Math.cos(angle) * hairLength * 2;
      const dy = Math.sin(angle) * hairLength * 2;
      let line = [point, [x + dx, y + dy]];
      if (i % 2 === 0) {
        line.reverse();
      }
      singleLine.push(line);
    }
  });
  lines.push(flatten(singleLine));

  return lines;
}

canvasSketch(sketch, settings.postcard);
