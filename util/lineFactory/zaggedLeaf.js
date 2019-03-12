import math from "canvas-sketch-util/math";
import random from "canvas-sketch-util/random";
import array from "new-array";
import flatten from "lodash/flatten";
import angleBetweenPoints from "../angleBetweenPoints";

export default function(
  leafStart = [0, 0],
  length = 0,
  angle = 0,
  spinePointCount = 20
) {
  let lines = [];

  const leafRandom = random.createRandom();
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
