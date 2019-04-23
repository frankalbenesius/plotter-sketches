import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { lerp } from "canvas-sketch-util/math";
import array from "new-array";
import { logSeed, distanceBetweenPoints } from "../../util";

const settings = {
  dimensions: [6, 4],
  units: "in",
  pixelsPerInch: 300
};

function radAngle([x1, y1], [x2, y2]) {
  // angle between -PI and +PI
  const angleBetweenRadians = Math.atan2(y2 - y1, x2 - x1);
  return angleBetweenRadians;
}

function createPoints(numCirclePoints, lineSteps) {
  // randomly generate a set of points in UV coordinates around a circle
  let pointsOnCircle = [];
  const maxPointDistance = 0.25;
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

  pointsOnCircle = pointsOnCircle.sort(point => radAngle(point, [0, 0]));

  // append first point to line so lines come back to first point at the end
  pointsOnCircle.push(pointsOnCircle[0]);

  let pathPoints = [];
  for (let i = 1; i < pointsOnCircle.length; i++) {
    const p1 = pointsOnCircle[i - 1]; // OK cause we start at 1
    const p2 = pointsOnCircle[i];

    const pointsBetween = array(lineSteps).map((_, i) => {
      const t = i / lineSteps;
      const u = lerp(p1[0], p2[0], t);
      const v = lerp(p1[1], p2[1], t);
      const noiseA = random.noise2D(u, v, 1, 1);
      const noiseB = random.noise2D(u, v, 1.5, 0.4);
      const noiseSum = noiseA + noiseB;
      return {
        uvPosition: [u, v],
        noiseA,
        noiseB,
        noiseSum
      };
    });
    pathPoints.push(...pointsBetween);
  }

  // return the points
  return pathPoints;
}

const sketch = ({ width, height }) => {
  logSeed();

  let lines = [];

  const points = createPoints(4, 60);
  points.forEach(({ uvPosition, noiseA, noiseB, noiseSum }) => {
    const [u, v] = uvPosition;
    const canvasSizer = Math.min(width, height);
    const [x, y] = [
      width / 2 + u * width * 0.4 + noiseA / 3,
      height / 2 + v * height * 0.4 + noiseA / 3
    ];

    let circleLine = [];
    const t = Math.abs(noiseA); // 0..1
    const steps = Math.floor(lerp(3, 8, t));
    const theta = (Math.PI * 2) / steps;
    for (let i = 0; i <= steps; i++) {
      const angle = theta * i;
      const r = canvasSizer / 78 + noiseB / 2;
      console.log(r);
      const point = [x + Math.cos(angle) * r, y + Math.sin(angle) * r];
      circleLine.push(point);
    }
    lines.push(circleLine);
  });

  const margin = Math.max(width, height) / 20;
  const box = [margin, margin, width - margin, height - margin];
  lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings);
