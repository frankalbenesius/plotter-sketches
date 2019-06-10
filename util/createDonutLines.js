import random from "canvas-sketch-util/random";
import createCircleLine from "./createCircleLine";
import { lerp } from "canvas-sketch-util/math";

export default function createDonutLines(
  centerPoint,
  pieces,
  resolution,
  radius,
  seed = random.getRandomSeed(),
  t = 0
) {
  let donutLines = [];
  random.setSeed(seed);

  const circlePoints = createCircleLine(
    ...centerPoint,
    radius,
    pieces,
    random.value() * 2 * Math.PI
  );

  circlePoints.slice(1).forEach(circleCenter => {
    const [centerX, centerY] = circleCenter;
    const simpleOutline = createCircleLine(
      circleCenter[0],
      circleCenter[1],
      radius,
      resolution,
      random.value() * Math.PI * 2
    );
    const noisyOutline = simpleOutline.map(targetPoint => {
      const noise = Math.abs(
        random.noise3D(targetPoint[0], targetPoint[1], t, 0.0012, 1.1)
      );
      const noisedPoint = [
        lerp(centerX, targetPoint[0], noise),
        lerp(centerY, targetPoint[1], noise)
      ];
      return noisedPoint;
    });
    donutLines.push(noisyOutline);
  });

  return donutLines;
}
