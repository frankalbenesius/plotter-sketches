import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import math from "canvas-sketch-util/math";
import { settings, createGrid, createCircleLine } from "../../util";

function generateBrassConfig() {
  return [];
}

function createBrassLines(
  startPoint,
  brassWidth,
  brassConfig = generateBrassConfig()
) {
  // final lines accumulator
  const brassLines = [];

  // rendering a dot just to show the brass starting point, can remove later
  const dotRadius = brassWidth / 40;
  const startPointCircle = createCircleLine(
    startPoint[0],
    startPoint[1],
    dotRadius
  );
  brassLines.push(startPointCircle);

  // rendering a line just to show the entire brass width, can remove later
  const widthGuideLine = [
    [startPoint[0] - brassWidth / 2, startPoint[1]],
    [startPoint[0] + brassWidth / 2, startPoint[1]]
  ];
  brassLines.push(widthGuideLine);

  // render the brass twice, one for each ear ;)
  for (let i = 0; i < 2; i++) {
    const startX = math.lerp(
      startPoint[0] - brassWidth / 4,
      startPoint[0] + brassWidth / 4,
      i
    );
    console.log(startX);
    const brassStartPoint = [startX, startPoint[1]];

    // create and add the hook to the lines accumulator
    // this hook is the same for every brass, so it isn't part of the generator
    const hookLines = [];
    const hookLength = brassWidth * 0.13;
    const hookRadius = hookLength * 0.3;
    const hookCircle = createCircleLine(
      brassStartPoint[0] + hookRadius,
      brassStartPoint[1] + hookRadius,
      hookRadius,
      20,
      Math.PI,
      12
    );
    const hookStem = [
      [brassStartPoint[0], brassStartPoint[1] + hookRadius],
      [brassStartPoint[0], brassStartPoint[1] + hookLength]
    ];
    hookLines.push(hookCircle, hookStem);
    brassLines.push(...hookLines);

    // loop through the brass config and render each piece
  }

  return brassLines;
}

const sketch = ({ width, height }) => {
  let lines = [];
  const margin = Math.max(width, height) / 6;
  const brassPairWidth = width / 10;

  createGrid(5, 5).map(([u, v]) => {
    const x = math.lerp(margin, width - margin, u);
    const y = math.lerp(margin, height - margin, v);
    const brassLines = createBrassLines([x, y], brassPairWidth);
    lines.push(...brassLines);
  });

  // const box = [margin, margin, width - margin, height - margin];
  // lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings.small);
