import random from "canvas-sketch-util/random";
import math from "mathjs";

export default function rotate3dLinesAboutOrigin(
  lines,
  xTheta = random.value() * Math.PI * 2,
  yTheta = random.value() * Math.PI * 2,
  zTheta = random.value() * Math.PI * 2
) {
  const xRotateMatrix = math.matrix([
    [1, 0, 0],
    [0, math.cos(xTheta), -math.sin(xTheta)],
    [0, math.sin(xTheta), math.cos(xTheta)]
  ]);
  const yRotateMatrix = math.matrix([
    [math.cos(yTheta), 0, math.sin(yTheta)],
    [0, 1, 0],
    [-math.sin(yTheta), 0, math.cos(yTheta)]
  ]);
  const zRotateMatrix = math.matrix([
    [math.cos(zTheta), -math.sin(zTheta), 0],
    [math.sin(zTheta), math.cos(zTheta), 0],
    [0, 0, 1]
  ]);
  const rotationalMatrix = math.multiply(
    xRotateMatrix,
    yRotateMatrix,
    zRotateMatrix
  );
  return lines.map(line => {
    return line.map(point => {
      const rotatedPoint = math.multiply(point, rotationalMatrix).toArray();
      return rotatedPoint;
    });
  });
}
