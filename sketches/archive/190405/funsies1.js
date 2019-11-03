import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { lerp } from "canvas-sketch-util/math";
import { settings, createCircleLine } from "../../../util";

const sketch = ({ width, height }) => {
  let lines = [];

  const parts = 160;
  const resolution = 120;

  const donutRadius = Math.min(width, height) * random.range(0.2, 0.25);
  const donutLinesA = createDonutLines(
    [width * 0.66, height * random.range(0.4, 0.6)],
    parts,
    resolution,
    donutRadius
  );
  lines.push(...donutLinesA);
  const donutLinesB = createDonutLines(
    [width * 0.35, height * random.range(0.4, 0.6)],
    parts,
    resolution,
    donutRadius
  );
  lines.push(...donutLinesB);

  // const margin = Math.max(width, height) / 20;
  // const box = [margin, margin, width - margin, height - margin];
  // lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

function createDonutLines(centerPoint, pieces, resolution, radius) {
  let donutLines = [];

  const circlePoints = createCircleLine(
    ...centerPoint,
    radius,
    pieces,
    random.value() * 2 * Math.PI
  );

  circlePoints.forEach(circleCenter => {
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
        random.noise2D(targetPoint[0], targetPoint[1], 0.08, 1.1)
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

canvasSketch(sketch, settings.large);
