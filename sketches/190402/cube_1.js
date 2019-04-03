import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { lerp, clamp } from "canvas-sketch-util/math";
import { settings } from "../../util";
import math from "mathjs";

const sketch = ({ width, height }) => {
  let lines = [];

  const rows = 5;
  const limit = 0.15;
  const xTheta = random.value() * Math.PI * 2;
  const yTheta = random.value() * Math.PI * 2;
  const zTheta = random.value() * Math.PI * 2;

  for (let a = 0; a <= 1; a += 1 / (rows - 1)) {
    for (let b = 0; b <= 1; b += 1 / (rows - 1)) {
      for (let c = 0; c <= 1; c += 1 / (rows - 1)) {
        const point = [
          lerp(-limit, limit, a),
          lerp(-limit, limit, b),
          lerp(-limit, limit, c)
        ];
        const cubeWidth = clamp(
          math.abs(random.noise3D(...point, 1, 0.03)),
          0.01,
          0.03
        );
        const cubeLines3d = createCubeLines(point, cubeWidth);
        const rotatedCubeLines3d = rotate3dLinesAboutOrigin(
          cubeLines3d,
          xTheta,
          yTheta,
          zTheta
        );
        const cubeLines = project3dLines(rotatedCubeLines3d, width, height);
        lines.push(...cubeLines);
      }
    }
  }

  const margin = Math.min(width, height) * 0.05;
  const box = [margin, margin, width - margin, height - margin];
  lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};
canvasSketch(sketch, settings.postcard);

function createCubeLines(point, width) {
  const [x, y, z] = point;
  const size = width / 2;
  const cubeLines3d = [
    [
      [x - size, y - size, z - size],
      [x - size, y - size, z + size],
      [x - size, y + size, z + size],
      [x - size, y + size, z - size],
      [x - size, y - size, z - size]
    ],
    [
      [x + size, y - size, z - size],
      [x + size, y - size, z + size],
      [x + size, y + size, z + size],
      [x + size, y + size, z - size],
      [x + size, y - size, z - size]
    ],
    [[x + size, y - size, z - size], [x - size, y - size, z - size]],
    [[x + size, y + size, z - size], [x - size, y + size, z - size]],
    [[x + size, y - size, z + size], [x - size, y - size, z + size]],
    [[x + size, y + size, z + size], [x - size, y + size, z + size]]
  ];
  return cubeLines3d;
}

function project3dLines(lines, width, height) {
  const sizer = Math.max(width, height);
  const centerX = width / 2;
  const centerY = height / 2;
  return lines.map(line => {
    return line.map(point => {
      const [u, v] = point;
      return [centerX + u * sizer, centerY + v * sizer];
    });
  });
}

function rotate3dLinesAboutOrigin(lines, xTheta, yTheta, zTheta) {
  const xMatrix = math.matrix([
    [1, 0, 0],
    [0, math.cos(xTheta), -math.sin(xTheta)],
    [0, math.sin(xTheta), math.cos(xTheta)]
  ]);
  const yMatrix = math.matrix([
    [math.cos(yTheta), 0, math.sin(yTheta)],
    [0, 1, 0],
    [-math.sin(yTheta), 0, math.cos(yTheta)]
  ]);
  const zMatrix = math.matrix([
    [math.cos(zTheta), -math.sin(zTheta), 0],
    [math.sin(zTheta), math.cos(zTheta), 0],
    [0, 0, 1]
  ]);
  return lines.map(line => {
    return line.map(point => {
      const rotatedPoint = math
        .multiply(
          math.multiply(math.multiply(point, xMatrix), yMatrix),
          zMatrix
        )
        .toArray();
      return rotatedPoint;
    });
  });
}
