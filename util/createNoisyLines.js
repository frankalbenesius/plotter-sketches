import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { lerp } from "canvas-sketch-util/math";
import range from "lodash/range";
import { distanceBetweenPoints } from "./";

export default function createNoisyLines(
  pointA = [0, 0],
  pointB = [100, 100],
  paddingMultiplier = 1,
  segmentMultiplier = 1,
  fillRatio = 0.7,
  frequency = 1,
  amplitude = 1,
  angle = random.value() * Math.PI * 2
) {
  let lines = [];

  // define initial utility variables
  const [ax, ay] = pointA;
  const [bx, by] = pointB;
  const centerX = (bx + ax) / 2;
  const centerY = (by + ay) / 2;
  const lineLength = distanceBetweenPoints(pointA, pointB);
  const lineAngle = angle - Math.PI * 0.5; // "angle" represents angle of growing lines, not the line itself
  const baseLinePadding = (lineLength / 100) * paddingMultiplier;

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
  const numLines = Math.round(300 * segmentMultiplier);
  const firstLine = range(0, 1.00000001, 1 / numLines).map(v => {
    const x = lerp(firstLineStartPoint[0], firstLineEndPoint[0], v);
    const y = lerp(firstLineStartPoint[1], firstLineEndPoint[1], v);
    return [x, y];
  });

  // plotting points just for debugging
  // firstLine.forEach(([x, y]) => {
  //   const pointCircle = createCircleLine(x, y, 3);
  //   lines.push(pointCircle);
  // });

  let noisyLines = [
    firstLine // straight & not "noisy" but will never be seen;
  ];
  let traveledDistance = 0;
  const maxDistance = lineLength * fillRatio; // just cause some white space is more interesting
  while (traveledDistance < maxDistance) {
    let newLine = [];
    const shadowedLine = noisyLines[noisyLines.length - 1];
    shadowedLine.forEach(([shadowedX, shadowedY]) => {
      const noise = random.noise2D(shadowedX, shadowedY, frequency, amplitude); // abs so it always grows
      const padding = baseLinePadding * 0.8 + (baseLinePadding / 2) * noise; // we never want it to be totally flat
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
