import { lerp, clamp } from "canvas-sketch-util/math";
import random from "canvas-sketch-util/random";

import { createCircleLine, rotate3DLines, projectUVLines } from "./";

const configDefaults = {
  frequency: 1,
  amplitude: 0,
  shells: 1,
  rotation: undefined,
  shellLines: 50,
  arcSteps: 50,
  arcLength: 1,
  fillLength: 1
};

const UV_ORIGIN = [0.5, 0.5, 0.5];

export default function createSphere(shellConfig) {
  const {
    center, // required
    radius, // required
    shellLines,
    shells,
    arcSteps,
    arcLength,
    rotation,
    frequency,
    amplitude,
    seed,
    fillLength
  } = {
    ...configDefaults,
    ...shellConfig
  };
  const noiseRandom = random.createRandom(seed || random.getRandomSeed());
  const amplitudeClamp = shellConfig.amplitudeClamp || shellConfig.amplitude;

  let lines3D = [];

  for (let j = 0; j < shells; j++) {
    let shellLines3D = [];
    const shellRadius = 0.5; // half of UV space between 0 and 1

    const shellLinesCount = Math.ceil(shellLines * fillLength);
    for (let i = 0; i <= shellLinesCount; i++) {
      const depth = lerp(0.5 - shellRadius, 0.5 + shellRadius, i / shellLines);
      const arcLineRadius = Math.sqrt(
        Math.pow(shellRadius, 2) - Math.pow(shellRadius - depth, 2)
      );
      const arcLine2D = createCircleLine(
        0.5,
        0.5,
        arcLineRadius,
        arcSteps,
        0,
        arcSteps * arcLength
      );
      const arcLine3D = arcLine2D.map(([x, y]) => [x, y, depth]);

      const noisyArcLine3d = arcLine3D.map(point3D => {
        const noise = noiseRandom.noise3D(...point3D, frequency, amplitude);
        const clampedNoise = clamp(noise, -amplitudeClamp, amplitudeClamp);

        const [x, y, z] = point3D;
        const factor = 0.15;
        const newX = lerp(0.5, x, clampedNoise * factor + 1);
        const newY = lerp(0.5, y, clampedNoise * factor + 1);
        const newZ = lerp(0.5, z, clampedNoise * factor + 1);

        const newPoint = [newX, newY, newZ];
        return newPoint;
      });

      shellLines3D.push(noisyArcLine3d);
    }

    const rotatedShellLines3D = rotate3DLines(
      shellLines3D,
      rotation,
      UV_ORIGIN
    );
    lines3D.push(...rotatedShellLines3D);
  }

  // plot every other line in reverse for efficiency's sake
  return projectUVLines(lines3D, center, radius * 2).map(reverseEveryOther);
}

const reverseEveryOther = (line, i) => (i % 2 === 0 ? line.reverse() : line);
