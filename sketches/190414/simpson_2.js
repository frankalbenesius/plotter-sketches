const canvasSketch = require("canvas-sketch");
const { renderPolylines } = require("canvas-sketch-util/penplot");
const { clipPolylinesToBox } = require("canvas-sketch-util/geometry");
import math from "canvas-sketch-util/math";
import random from "canvas-sketch-util/random";
import { settings, createCircleLine, lineFactory, logSeed } from "../../util";

const sketch = ({ width, height }) => {
  logSeed();
  const margin = Math.min(width, height) * 0.05;
  let lines = [];

  const steps = 409;
  const extendTo = 1; // how far base circle extends to page
  const randomTheta = Math.random() * Math.PI * 2;
  const uvCirclePoints = createCircleLine(0, 0, 1, steps, randomTheta).slice(1);
  const basePoints = uvCirclePoints.map(uv => {
    const [u, v] = uv;
    const freq = 1;
    const amp = 1;
    const noiseX = random.noise2D(u, v, freq, amp);
    const noiseY = random.noise2D(u + 999999, v - 999999, freq, amp * 0.5);
    const noiseAngle = random.noise2D(u + 999999, v + 999999, freq, amp);
    const noiseEffect = 0.25; // how much of position should be based on noise
    const xy = [
      math.lerp(
        width * 0.5,
        width * extendTo,
        u * (1 - noiseEffect) + noiseX * noiseEffect
      ),
      math.lerp(
        height * 0.5,
        height * extendTo,
        v * (1 - noiseEffect) + noiseY * noiseEffect
      )
    ];
    return {
      uv,
      position: xy,
      noise: {
        x: noiseX,
        y: noiseY,
        angle: noiseAngle
      }
    };
  });

  const radius = Math.min(width, height) * 0.3;
  basePoints.forEach((circleCenter, i) => {
    const [centerX, centerY] = circleCenter.position;
    const simpleOutline = createCircleLine(centerX, centerY, radius, 150);
    const noisyOutline = simpleOutline.map(targetPoint => {
      const noise = Math.abs(
        random.noise2D(targetPoint[0], targetPoint[1], 0.2, 1)
      );
      const noisedPoint = [
        math.lerp(centerX, targetPoint[0] * 1.2, noise),
        math.lerp(centerY, targetPoint[1] * 1.2, noise)
      ];
      return noisedPoint;
    });
    lines.push(noisyOutline);
  });

  const box = [margin, margin, width - margin, height - margin];
  lines = clipPolylinesToBox(lines, box);

  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings.postcard);
