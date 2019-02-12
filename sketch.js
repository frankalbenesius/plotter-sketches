import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import distanceBetweenPoints from "./util/distanceBetweenPoints";
import logSeed from "./util/logSeed";

const settings = {
  dimensions: [1024, 1024]
};

function createPoints() {
  // randomly generate a set of points in UV coordinates around a circle
  const numCirclePoints = random.pick([8, 9, 10, 11]);
  let pointsOnCircle = [];
  const maxPointDistance = numCirclePoints * 0.02;
  let loopSafety = 0;
  let loopMax = 2000;
  while (pointsOnCircle.length < numCirclePoints && loopSafety < loopMax) {
    const randomCirclePoint = random.onCircle(1);
    const distancesFromOtherPoints = pointsOnCircle.map(point =>
      distanceBetweenPoints(point, randomCirclePoint)
    );
    if (distancesFromOtherPoints.every(dist => dist > maxPointDistance))
      pointsOnCircle.push(randomCirclePoint);

    loopSafety += 1;
  }
  if (loopSafety === loopMax) {
    console.warn(
      `Only got ${pointsOnCircle.length} outer points of ${numCirclePoints}.`
    );
  }

  // append first point to line so lines come back to first point at the end
  pointsOnCircle.push(pointsOnCircle[0]);

  // return the points
  return pointsOnCircle;
}

const sketch = ({ width, height }) => {
  logSeed();

  let lines = [];

  const points = createPoints();
  const line = points.map(uvPoint => {
    const radius = Math.min(width, height) * 0.4;
    const xyPoint = [
      width / 2 + uvPoint[0] * radius,
      height / 2 + uvPoint[1] * radius
    ];
    return xyPoint;
  });
  lines.push(line);

  // const margin = Math.max(width, height) / 20;
  // const box = [margin, margin, width - margin, height - margin];
  // lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings);
