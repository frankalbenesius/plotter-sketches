import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { lerp } from "canvas-sketch-util/math";
import range from "lodash/range";
import { settings, distanceBetweenPoints, createCircleLine } from "../../util";

function createLines(
  pointA = [0, 0],
  pointB = [100, 100],
  angle = 0,
  border = false
) {
  let lines = [];

  const [ax, ay] = pointA;
  const [bx, by] = pointB;
  const centerX = (bx + ax) / 2;
  const centerY = (by + ay) / 2;
  const lineLength = distanceBetweenPoints(pointA, pointB);

  const midpointStart = [
    centerX + (Math.cos(angle + Math.PI) * lineLength) / 2,
    centerY + (Math.sin(angle + Math.PI) * lineLength) / 2
  ];
  const midpointEnd = [
    midpointStart[0] + Math.cos(angle) * lineLength,
    midpointStart[1] + Math.sin(angle) * lineLength
  ];
  const midPoints = range(0, 1.000000001, 0.05).map(v => {
    const x = lerp(midpointStart[0], midpointEnd[0], v);
    const y = lerp(midpointStart[1], midpointEnd[1], v);
    return [x, y];
  });

  const lineAngle = angle - Math.PI * 0.5; // "angle" represents angle of growing lines, not the line itself
  midPoints.forEach(midpoint => {
    const lineStart = [
      midpoint[0] - (Math.cos(lineAngle) * lineLength) / 2,
      midpoint[1] - (Math.sin(lineAngle) * lineLength) / 2
    ];
    const lineEnd = [
      midpoint[0] + (Math.cos(lineAngle) * lineLength) / 2,
      midpoint[1] + (Math.sin(lineAngle) * lineLength) / 2
    ];
    const line = range(0, 1.00000001, 0.05).map(v => {
      const x = lerp(lineStart[0], lineEnd[0], v);
      const y = lerp(lineStart[1], lineEnd[1], v);
      return [x, y];
    });
    line.forEach(([x, y]) => {
      const pointCircle = createCircleLine(x, y, 3);
      lines.push(pointCircle);
    });
    lines.push(line);
  });

  if (border) {
    let borderLine = [[ax, ay], [bx, ay], [bx, by], [ax, by], [ax, ay]];
    lines.push(borderLine);
    let circle = createCircleLine((bx + ax) / 2, (by + ay) / 2, lineLength / 2);
    lines.push(circle);
  }

  // const box = [ax, ay, bx, by];
  // lines = clipPolylinesToBox(lines, box);

  return lines;
}

const sketch = ({ width, height }) => {
  let lines = [];

  const squigglyLines = createLines(
    [width * 0.2, height * 0.2],
    [width * 0.9, height * 0.9],
    Math.PI * 0.4,
    true
  );
  lines.push(...squigglyLines);

  // const margin = Math.max(width, height) / 20;
  // const box = [margin, margin, width - margin, height - margin];
  // lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings.playground);
