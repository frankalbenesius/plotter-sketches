import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import math from "canvas-sketch-util/math";
import { settings, createGrid, createCircleLine } from "../../../../util";

const sketch = ({ width, height }) => {
  const margin = Math.max(width, height) * 0.03;
  let lines = [];
  // const boundingLine = [
  //   [margin, margin],
  //   [width - margin, margin],
  //   [width - margin, height - margin],
  //   [margin, height - margin],
  //   [margin, margin]
  // ];
  // lines.push(boundingLine);

  const columns = 6;
  const rows = 12;
  const facesGutter = margin * 0.2;
  const faceWidth =
    (width - margin * 2 - facesGutter * (columns - 1)) / columns;
  const faceHeight = (height - margin * 2 - facesGutter * (rows - 1)) / rows;

  createGrid(columns, rows)
    .map(uv => {
      const [u, v] = uv;
      const lookAngle = random.noise2D(u, v, 0.2, 1) * Math.PI * 2;
      const eyeballNoise = random.noise2D(u + 100000, v + 999999, 1, 1);
      const mouthNoise = random.noise2D(u - 100000, v - 999999, 0.1, 1);
      return {
        center: [
          math.lerp(
            margin + faceWidth / 2,
            width - (margin + faceWidth / 2),
            u
          ),
          math.lerp(
            margin + faceHeight / 2,
            height - margin - faceHeight / 2,
            v
          )
        ],
        lookAngle,
        eyeballNoise,
        mouthNoise
      };
    })
    .map(({ center, lookAngle, eyeballNoise }) => {
      const faceOutlineNoisy = createNoiseyFaceLine(
        center,
        faceWidth,
        faceHeight
      );
      lines.push(faceOutlineNoisy);

      const eyeballLines = createEyeballLines(
        center,
        faceWidth,
        faceHeight,
        lookAngle,
        eyeballNoise
      );
      lines.push(...eyeballLines);

      const mouthLine = createMouthLine(
        center,
        faceWidth,
        faceHeight,
        lookAngle
      );
      lines.push(mouthLine);
    });

  return props =>
    renderPolylines(lines, {
      ...props
      // foreground: "#3400f1",
      // background: "#00ffa2"
    });
};

function createNoiseyFaceLine(center, faceWidth, faceHeight) {
  const faceOutlineUV = createCircleLine(0, 0, 0.5, 60);
  const faceOutlineSmooth = faceOutlineUV.map(([u, v]) => {
    const x = math.lerp(
      center[0] - faceWidth / 2,
      center[0] + faceWidth / 2,
      u + 0.5
    );
    const y = math.lerp(
      center[1] - faceHeight / 2,
      center[1] + faceHeight / 2,
      v + 0.5
    );
    return [x, y];
  });
  const faceOutlineNoisy = faceOutlineSmooth.map(([x, y]) => {
    const noise = random.noise2D(
      x,
      y,
      Math.min(faceWidth, faceHeight) * 0.01,
      Math.min(faceWidth, faceHeight) * 0.05
    );
    return [x + noise, y + noise];
  });
  return faceOutlineNoisy;
}

function createEyeballLines(
  center,
  faceWidth,
  faceHeight,
  lookAngle,
  eyeballNoise
) {
  const eyeballGap = faceWidth * 0.15;
  const maxXShift = faceWidth * 0.25;
  const maxYShift = faceHeight * 0.15;
  const eyeballRadius = Math.min(faceWidth, faceHeight) * 0.07;
  const xShift = Math.cos(lookAngle) * maxXShift;
  const yShift = Math.sin(lookAngle) * maxYShift;
  const leftEyeballLine = createCircleLine(
    center[0] - eyeballGap + xShift,
    center[1] + yShift,
    eyeballRadius
  );
  const rightEyeballLine = createCircleLine(
    center[0] + eyeballGap + xShift,
    center[1] + yShift,
    eyeballRadius
  );
  return [leftEyeballLine, rightEyeballLine];
}

function createMouthLine(center, faceWidth, faceHeight, lookAngle) {
  const mouthY =
    center[1] + faceHeight * 0.2 + Math.sin(lookAngle) * faceHeight * 0.1;
  const mouthCenterX = center[0] + Math.cos(lookAngle) * faceWidth * 0.2;
  const mouthWidth = faceWidth * 0.35;
  const mouthLine = [
    [mouthCenterX - mouthWidth / 2, mouthY],
    [mouthCenterX + mouthWidth / 2, mouthY]
  ];
  return mouthLine;
}

canvasSketch(sketch, {
  dimensions: [5, 8],
  units: "in",
  pixelsPerInch: 300
});
