import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { lerp } from "canvas-sketch-util/math";
import { settings, createCircleLine } from "../../../util";

const sketch = ({ width, height }) => {
  let lines = [];

  const parts = 200;
  const resolution = 200;

  const donutRadius = Math.min(width, height) * random.range(0.2, 0.26);
  const donutLinesA = createDonutLines(
    [width * 0.66, height * 0.55],
    parts,
    resolution,
    donutRadius
  );
  lines.push(...donutLinesA);
  const donutLinesB = createDonutLines(
    [width * 0.33, height * 0.45],
    parts,
    resolution,
    donutRadius
  );
  lines.push(...donutLinesB);

  // const margin = Math.max(width, height) / 20;
  // const box = [margin, margin, width - margin, height - margin];
  // lines = clipPolylinesToBox(lines, box);
  return props =>
    renderPolylines(lines, {
      ...props,
      lineWidth: 2,
      foreground: "#5BB65B",
      background: "#333E48"
    });
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
        random.noise2D(targetPoint[0], targetPoint[1], 0.0006, 1)
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

canvasSketch(sketch, settings.workScreen);
