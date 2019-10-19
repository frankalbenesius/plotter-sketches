import random from "canvas-sketch-util/random";
import math from "mathjs";

export function rotate3DLines(
  lines3D = [],
  rotation = {
    x: random.value() * Math.PI * 2,
    y: random.value() * Math.PI * 2,
    z: random.value() * Math.PI * 2
  },
  center = [0, 0, 0]
) {
  const xRotateMatrix = math.matrix([
    [1, 0, 0],
    [0, math.cos(rotation.x), -math.sin(rotation.x)],
    [0, math.sin(rotation.x), math.cos(rotation.x)]
  ]);
  const yRotateMatrix = math.matrix([
    [math.cos(rotation.y), 0, math.sin(rotation.y)],
    [0, 1, 0],
    [-math.sin(rotation.y), 0, math.cos(rotation.y)]
  ]);
  const zRotateMatrix = math.matrix([
    [math.cos(rotation.z), -math.sin(rotation.z), 0],
    [math.sin(rotation.z), math.cos(rotation.z), 0],
    [0, 0, 1]
  ]);
  const rotationalMatrix = math.multiply(
    xRotateMatrix,
    yRotateMatrix,
    zRotateMatrix
  );
  return lines3D.map(line3D => {
    return line3D.map(point3D => {
      const shiftedPoint = point3D.map((value, i) => value - center[i]);
      const rotatedPoint = math
        .multiply(shiftedPoint, rotationalMatrix)
        .toArray();
      const unshiftedRotatedPoint = rotatedPoint.map(
        (value, i) => value + center[i]
      );
      return unshiftedRotatedPoint;
    });
  });
}

export function rotate3dLinesAboutOrigin(
  lines,
  xTheta = random.value() * Math.PI * 2,
  yTheta = random.value() * Math.PI * 2,
  zTheta = random.value() * Math.PI * 2
) {
  return rotate3DLines(lines, { x: xTheta, y: yTheta, z: zTheta }, [0, 0]);
}

export default rotate3dLinesAboutOrigin;
