import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import math from "canvas-sketch-util/math";
import { settings, angleBetweenPoints, createCircleLine } from "../../../util";

const sketch = ({ width, height }) => {
  const margin = Math.max(width, height) / 20;
  let lines = [];

  const rows = 340;
  const cols = 20;
  const hairSegmentCount = 80;
  const hairSegmentLength = margin * 0.01;

  const pointGrid = createCurvedPointGrid(rows, cols);

  pointGrid.forEach((pointRow, rowIndex) => {
    pointRow.forEach((pointData, colIndex) => {
      if (random.value() > 0.5) {
        const { uvPoint, noise } = pointData;
        const [u, v] = uvPoint;
        const startPoint = [
          math.lerp(0 + -margin, width - -margin, u),
          math.lerp(0 + -margin, height - -margin, v)
        ];

        let baseAngle = 0;
        if (colIndex > 0) {
          const pointToTheLeft = pointGrid[rowIndex][colIndex - 1];
          baseAngle = angleBetweenPoints(pointToTheLeft.uvPoint, uvPoint);
        }

        let hairLine = [startPoint];
        let curHairAngle = baseAngle - Math.PI * Math.abs(noise);
        for (let h = 0; h < hairSegmentCount * (1 + rowIndex / rows); h++) {
          const lastPoint = hairLine[h];
          curHairAngle +=
            random.noise2D(lastPoint[0], lastPoint[1], 1, 0.01) * Math.PI;
          const nextPoint = [
            lastPoint[0] + Math.cos(curHairAngle) * hairSegmentLength,
            lastPoint[1] + Math.sin(curHairAngle) * hairSegmentLength
          ];
          hairLine.push(nextPoint);
        }
        lines.push(hairLine);
      }
    });
  });

  const box = [margin, margin, width - margin, height - margin];
  lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

function createCurvedPointGrid(rows = 20, cols = 30) {
  const pointGrid = [];
  for (let row = 0; row < rows; row++) {
    let pointRow = [];
    for (let col = 0; col < cols; col++) {
      const v = row / rows;
      const u = col / cols;

      const startPtFreq = 1;
      const startPtAmp = 0.1;
      const uNoise = random.noise2D(u, v, startPtFreq, startPtAmp);
      const vNoise = random.noise2D(u + 10000000, v, startPtFreq, startPtAmp);
      const noise = random.noise2D(
        u - 10000000,
        v + 10000000,
        startPtFreq,
        startPtAmp
      );

      const uvPoint = [u + uNoise, v + vNoise];

      pointRow.push({ uvPoint, noise });
    }
    pointGrid.push(pointRow);
  }
  return pointGrid;
}

canvasSketch(sketch, settings.large);
