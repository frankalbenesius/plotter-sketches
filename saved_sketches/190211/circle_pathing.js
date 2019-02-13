import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import distanceBetweenPoints from "./util/distanceBetweenPoints";
import logSeed from "./util/logSeed";
import { lerp } from "canvas-sketch-util/math";
import array from "new-array";

const settings = {
  dimensions: [6, 4],
  units: "in",
  pixelsPerInch: 300
};

function createPoints(numCirclePoints, lineSteps) {
  // randomly generate a set of points in UV coordinates around a circle
  let pointsOnCircle = [];
  const maxPointDistance = numCirclePoints * 0.05;
  let loopSafety = 0;
  let loopMax = 2000;
  while (pointsOnCircle.length < numCirclePoints && loopSafety < loopMax) {
    const randomCirclePoint = random.onCircle(1);
    const distancesFromOtherPoints = pointsOnCircle.map(point =>
      distanceBetweenPoints(point, randomCirclePoint)
    );
    if (distancesFromOtherPoints.every(dist => dist > maxPointDistance)) {
      pointsOnCircle.push(randomCirclePoint);
    }

    loopSafety += 1;
  }
  if (loopSafety === loopMax) {
    console.warn(
      `Only got ${pointsOnCircle.length} outer points of ${numCirclePoints}.`
    );
  }

  // append first point to line so lines come back to first point at the end
  pointsOnCircle.push(pointsOnCircle[0]);

  let pathPoints = [];
  for (let i = 1; i < pointsOnCircle.length; i++) {
    const p1 = pointsOnCircle[i - 1]; // OK cause we start at 1
    const p2 = pointsOnCircle[i];

    // angle between -PI and +PI
    const angleBetweenRadians = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
    const absAngle = Math.abs(angleBetweenRadians);
    // if (absAngle > Math.PI / 6 && absAngle < (Math.PI / 6) * 5) {
    const pointsBetween = array(lineSteps).map((_, i) => {
      const t = i / lineSteps;
      const u = lerp(p1[0], p2[0], t);
      const v = lerp(p1[1], p2[1], t);
      return {
        uvPosition: [u, v],
        noise2d: random.noise2D(u, v, 0.6, 1.5)
      };
    });
    pathPoints.push(...pointsBetween);
    // }
  }

  pathPoints = pathPoints.map((point, i) => {
    return {
      ...point,
      noise1d: random.noise1D(i, 10, 1.5)
    };
  });

  // return the points
  return pathPoints;
}

const sketch = ({ width, height }) => {
  logSeed();

  let lines = [];

  const points = createPoints(4, 90);
  points.forEach(({ uvPosition, noise2d, noise1d }) => {
    const [u, v] = uvPosition;
    const canvasSizer = Math.min(width, height);
    const [x, y] = [width / 2 + u * width * 0.4, height / 2 + v * height * 0.4];

    let circleLine = [];
    const steps = 30;
    const theta = (Math.PI * 2) / steps;
    for (let i = 0; i <= steps; i++) {
      const angle = theta * i + noise1d;
      const r = canvasSizer / 78;
      const point = [
        x + noise2d / 2 + Math.cos(angle) * r,
        y + noise2d / 2 + Math.sin(angle) * r
      ];
      circleLine.push(point);
    }
    lines.push(circleLine);
  });

  // const margin = Math.max(width, height) / 20;
  // const box = [margin, margin, width - margin, height - margin];
  // lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings);
