import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { lerp } from "canvas-sketch-util/math";
import { settings, createCircleLine } from "../../util";

const sketch = ({ width, height }) => {
  let lines = [];

  const donutConfig = {
    center: [width * 0.5, height * 0.5],
    lines: 100,
    resolution: 4,
    radius: Math.min(width, height) * 0.25,
    amplitude: 0.1,
    frequency: 0.4
  };
  const donutLines = createDonutLines(donutConfig);
  lines.push(...donutLines);

  const margin = Math.max(width, height) * 0.05;
  const box = [margin, margin, width - margin, height - margin];
  lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

const defaultConfig = {
  center: [0.5, 0.5],
  lines: 100,
  resolution: 400,
  radius: 1,
  amplitude: 0.04,
  frequency: 1
};
function createDonutLines(config = defaultConfig) {
  const { center, lines, resolution, radius, amplitude, frequency } = {
    ...defaultConfig,
    ...config
  };
  let donutLines = [];

  const circlePoints = createCircleLine(
    ...center,
    radius,
    lines,
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
        random.noise2D(targetPoint[0], targetPoint[1], amplitude, frequency)
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

canvasSketch(sketch, settings.postcard);
