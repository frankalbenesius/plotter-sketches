import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { lerp } from "canvas-sketch-util/math";

import {
  settings,
  createCircleLine,
  rotate3dLinesAboutOrigin,
  orthographicProjection
} from "../../util";

const sketch = ({ width, height }) => {
  let lines3D = [];

  const numShellLines = 80;
  const numShells = 2;
  const radius = 0.46;
  const radiusWiggle = 0.0;
  const steps = 100;
  const arcLength = 0.96;

  for (let j = 0; j < numShells; j++) {
    let shellLines3D = [];
    const shellRadius = lerp(
      radius - radiusWiggle,
      radius + radiusWiggle,
      j / numShells
    );

    for (let i = 1; i < numShellLines; i++) {
      const depth = lerp(-shellRadius, shellRadius, i / numShellLines);
      const lineRadius = Math.sqrt(
        Math.pow(shellRadius, 2) - Math.pow(depth, 2)
      );
      const arcLine2D = createCircleLine(
        0,
        0,
        lineRadius,
        steps,
        0,
        steps * arcLength
      );
      const arcLine3D = arcLine2D.map(([x, y]) => [x, y, depth]);
      shellLines3D.push(arcLine3D);
    }
    const rotatedShellLines3D = rotate3dLinesAboutOrigin(shellLines3D);
    lines3D.push(...rotatedShellLines3D);
  }

  const lines = orthographicProjection(lines3D, width, height).map(
    (line, i) => {
      return i % 2 === 0 ? line.reverse() : line;
    }
  );

  // const margin = Math.max(width, height) / 20;
  // const box = [margin, margin, width - margin, height - margin];
  // lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings.postcard);
