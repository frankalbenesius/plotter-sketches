import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import math from "canvas-sketch-util/math";
import { settings, createGrid, createCircleLine } from "../../util";

const nodeOptions = [
  {
    kind: "circle",
    numLeafOptions: [1]
  }
];

function generateBrassTree(levels = 0) {
  if (levels === 0) {
    return null;
  }

  const nodeConfig = random.pick(nodeOptions);
  const numLeaves = random.pick(nodeConfig.numLeafOptions);

  const leafConfigs = [];
  for (let i = 0; i < numLeaves; i++) {
    const leafConfig = generateBrassTree(levels - 1);
    if (leafConfig) {
      leafConfigs.push(leafConfig);
    }
  }
  return {
    ...nodeConfig,
    leaves: leafConfigs
  };
}

function createBrassTreeLines(brassTreeHead, point, width) {
  let lines = [];
  switch (brassTreeHead.kind) {
    case "circle": {
      const circleRadius = width * 0.2;
      const circleLine = createCircleLine(
        point[0],
        point[1] + circleRadius,
        circleRadius
      );
      lines.push(circleLine);

      const numLeaves = brassTreeHead.leaves.length;
      for (let i = 0; i < numLeaves; i++) {
        const leafPoint = [point[0], point[1] + circleRadius * 2];
        const leafLines = createBrassTreeLines(
          brassTreeHead.leaves[i],
          leafPoint,
          width / numLeaves
        );
        lines.push(...leafLines);
      }
      break;
    }
    default: {
      break;
    }
  }
  return lines;
}

function createPairBrassLines(startPoint, brassPairWidth, brassTree) {
  // final lines accumulator
  const brassLines = [];

  // // rendering a dot just to show the brass starting point, can remove later
  // const dotRadius = brassPairWidth / 40;
  // const startPointCircle = createCircleLine(
  //   startPoint[0],
  //   startPoint[1],
  //   dotRadius
  // );
  // brassLines.push(startPointCircle);

  // // rendering a line just to show the entire brass width, can remove later
  // const widthGuideLine = [
  //   [startPoint[0] - brassPairWidth / 2, startPoint[1]],
  //   [startPoint[0] + brassPairWidth / 2, startPoint[1]]
  // ];
  // brassLines.push(widthGuideLine);

  // render the brass twice, one for each ear ;)
  for (let i = 0; i < 2; i++) {
    const brassWidth = brassPairWidth * 0.5;
    const startX = math.lerp(
      startPoint[0] - brassPairWidth / 4,
      startPoint[0] + brassPairWidth / 4,
      i
    );
    const brassStartPoint = [startX, startPoint[1]];

    // create and add the hook to the lines accumulator
    // this hook is the same for every brass, so it isn't part of the generator
    const hookLines = [];
    const hookLength = brassPairWidth * 0.13;
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

    // recurse through the brass tree and render each piece
    const brassTreeStartPoint = [
      brassStartPoint[0],
      brassStartPoint[1] + hookLength
    ];
    brassLines.push(
      ...createBrassTreeLines(brassTree, brassTreeStartPoint, brassWidth)
    );
  }

  return brassLines;
}

const sketch = ({ width, height }) => {
  let lines = [];
  const margin = Math.max(width, height) / 6;
  const brassPairWidth = width / 10;

  const rows = 5;
  const numLevels = 3;
  createGrid(rows, rows).map(([u, v]) => {
    const x = math.lerp(margin, width - margin, u);
    const y = math.lerp(margin, height - margin, v);
    const brassLines = createPairBrassLines(
      [x, y],
      brassPairWidth,
      generateBrassTree(numLevels)
    );
    lines.push(...brassLines);
  });

  // const box = [margin, margin, width - margin, height - margin];
  // lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings.small);
