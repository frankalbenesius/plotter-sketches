import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { lerp } from "canvas-sketch-util/math";
import { settings, createCircleLine, createGrid } from "../../util";

const sketch = ({ width, height }) => {
  const margin = Math.max(width, height) * 0.12;
  let lines = [];

  const pieces = 90;
  const resolution = 140;
  const donutRadius = Math.min(width, height) * 0.06;
  createGrid(6, 5).map(([u, v]) => {
    const point = [
      lerp(margin, width - margin, u),
      lerp(margin, height - margin, v)
    ];
    lines.push(...createDonutLines(point, pieces, resolution, donutRadius));
  });

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
        random.noise2D(targetPoint[0], targetPoint[1], 0.3, 1)
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
