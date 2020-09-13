import { lerp, clamp } from "canvas-sketch-util/math";
import random from "canvas-sketch-util/random";

import { createCircleLine, rotate3DLines, projectUVLines } from ".";
import { createRandomRotation } from "./rotate3DLines";

export default function ({
  center,
  radius,
  numLines,
  rotation = createRandomRotation(),
}) {
  let lines = [];

  const center3d = [0.5, 0.5, 0.5];
  const cube = create3dCubeLines(center3d, radius, numLines);
  lines.push(...cube);

  const rotatedCubeLines = rotate3DLines(lines, rotation, center3d);

  const projectedLines = projectUVLines(rotatedCubeLines, center, radius * 2);
  return projectedLines;
}

function create3dCubeLines(point, width, numLines) {
  const [x, y, z] = point;
  const half = width / 2;
  console.log("numLines", numLines);

  let cubeLines3d = [];
  for (let i = 0; i < numLines; i++) {
    const spaceBetween = 1 / (numLines - 1);
    const curX = lerp(x - half, x + half, i * spaceBetween);
    cubeLines3d.push([
      [curX, y - half, z - half],
      [curX, y - half, z + half],
      [curX, y + half, z + half],
      [curX, y + half, z - half],
      [curX, y - half, z - half],
    ]);
  }

  // for (let i = 0; i < numLines; i++) {
  //   const spaceBetween = 1 / (numLines - 1);
  //   const curY = lerp(y - half, y + half, i * spaceBetween);
  //   cubeLines3d.push([
  //     [x - half, curY, z - half],
  //     [x - half, curY, z + half],
  //     [x + half, curY, z + half],
  //     [x + half, curY, z - half],
  //     [x - half, curY, z - half],
  //   ]);
  // }

  // for (let i = 0; i < numLines; i++) {
  //   const spaceBetween = 1 / (numLines - 1);
  //   const curZ = lerp(z - half, z + half, i * spaceBetween);
  //   cubeLines3d.push([
  //     [x - half, y + half, curZ],
  //     [x + half, y + half, curZ],
  //     [x + half, y - half, curZ],
  //     [x - half, y - half, curZ],
  //     [x - half, y + half, curZ],
  //   ]);
  // }
  return cubeLines3d;
}
