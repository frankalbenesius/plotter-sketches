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
  angle = random.value() * Math.PI * 2,
  border = false
) {
  let lines = [];

  // define initial utility variables
  const [ax, ay] = pointA;
  const [bx, by] = pointB;
  const centerX = (bx + ax) / 2;
  const centerY = (by + ay) / 2;
  const lineLength = distanceBetweenPoints(pointA, pointB);
  const lineAngle = angle - Math.PI * 0.5; // "angle" represents angle of growing lines, not the line itself

  // can be useful to see border for debugging
  if (border) {
    let borderLine = [[ax, ay], [bx, ay], [bx, by], [ax, by], [ax, ay]];
    lines.push(borderLine);
    // let circle = createCircleLine((bx + ax) / 2, (by + ay) / 2, lineLength / 2);
    // lines.push(circle);
  }

  // create the starting line at the correct radius and angle.
  // it will start opposite the "angle" of the flow of the lines
  // and be just wide enough to cover the entirety of the bounding box
  const startLineMidpoint = [
    centerX + (Math.cos(angle + Math.PI) * lineLength) / 2,
    centerY + (Math.sin(angle + Math.PI) * lineLength) / 2
  ];
  const firstLineStartPoint = [
    startLineMidpoint[0] - (Math.cos(lineAngle) * lineLength) / 2,
    startLineMidpoint[1] - (Math.sin(lineAngle) * lineLength) / 2
  ];
  const firstLineEndPoint = [
    startLineMidpoint[0] + (Math.cos(lineAngle) * lineLength) / 2,
    startLineMidpoint[1] + (Math.sin(lineAngle) * lineLength) / 2
  ];
  const firstLine = range(0, 1.00000001, 0.01).map(v => {
    const x = lerp(firstLineStartPoint[0], firstLineEndPoint[0], v);
    const y = lerp(firstLineStartPoint[1], firstLineEndPoint[1], v);
    return [x, y];
  });

  // plotting points just for debugging
  // firstLine.forEach(([x, y]) => {
  //   const pointCircle = createCircleLine(x, y, 3);
  //   lines.push(pointCircle);
  // });

  // build a second line
  // TODO: derive this distance
  const baseLinePadding = 10;

  let noisyLines = [
    firstLine // straight & not "noisy" but will never be seen;
  ];
  let traveledDistance = 0;
  const maxDistance = lineLength * 0.7; // just cause some white space is more interesting
  while (traveledDistance < maxDistance) {
    let newLine = [];
    const shadowedLine = noisyLines[noisyLines.length - 1];
    shadowedLine.forEach(([shadowedX, shadowedY]) => {
      const noise = random.noise2D(shadowedX, shadowedY, 0.01); // abs so it always grows
      const padding = baseLinePadding + (baseLinePadding / 2) * noise; // we never want it to be totally flat
      const point = [
        shadowedX + Math.cos(angle) * padding,
        shadowedY + Math.sin(angle) * padding
      ];
      newLine.push(point);
    });
    noisyLines.push(newLine);
    traveledDistance = Math.abs(
      distanceBetweenPoints(firstLine[0], newLine[0])
    );
  }
  lines.push(...noisyLines);

  // clip all of the lines to the provided bounding box
  const box = [ax, ay, bx, by];
  lines = clipPolylinesToBox(lines, box);

  return lines;
}

const sketch = ({ width, height }) => {
  let lines = [];

  const squigglyLines = createLines(
    [width * 0.3, height * 0.3],
    [width * 0.8, height * 0.6]
  );
  lines.push(...squigglyLines);

  // const margin = Math.max(width, height) / 20;
  // const box = [margin, margin, width - margin, height - margin];
  // lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings.playground);
