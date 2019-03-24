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

function generateBrassTreeConfig(levels = 0, isRootNode = true) {
  if (levels === 0) {
    return null;
  }

  const nodeConfig = random.pick(nodeOptions);
  const numLeaves = random.pick(nodeConfig.numLeafOptions);

  const leafConfigs = [];
  for (let i = 0; i < numLeaves; i++) {
    const leafConfig = generateBrassTreeConfig(levels - 1, false);
    if (leafConfig) {
      leafConfigs.push(leafConfig);
    }
  }
  return {
    ...nodeConfig,
    isRootNode,
    leaves: leafConfigs
  };
}

function createBrassTreeLines(brassTreeConfig, point, width) {
  let lines = [];
  const numLeaves = brassTreeConfig.leaves.length;

  let nodeOffsetFromConnector = 0;
  if (brassTreeConfig.isRootNode) {
    // create and add the hook to the lines accumulator
    // this hook is the same for every brass, so it isn't part of the generator
    const hookLines = [];
    const hookLength = width * 0.26;
    nodeOffsetFromConnector = hookLength;
    const hookRadius = hookLength * 0.3;
    const hookCircle = createCircleLine(
      point[0] + hookRadius,
      point[1] + hookRadius,
      hookRadius,
      20,
      Math.PI,
      12
    );
    const hookStem = [
      [point[0], point[1] + hookRadius],
      [point[0], point[1] + hookLength]
    ];
    hookLines.push(hookCircle, hookStem);
    lines.push(...hookLines);
  } else {
    nodeOffsetFromConnector = 0;
    const connectorLength = width * 0.2;
    const connectorLine = [
      [point[0], point[1] - connectorLength / 2],
      [point[0], point[1] + connectorLength / 2]
    ];
    lines.push(connectorLine);
  }

  switch (brassTreeConfig.kind) {
    case "circle": {
      const nodePoint = [point[0], point[1] + nodeOffsetFromConnector];
      const circleRadius = width * 0.2;
      const circleLine = createCircleLine(
        nodePoint[0],
        nodePoint[1] + circleRadius,
        circleRadius
      );
      lines.push(circleLine);

      for (let i = 0; i < numLeaves; i++) {
        const leafPoint = [nodePoint[0], nodePoint[1] + circleRadius * 2];
        const leafLines = createBrassTreeLines(
          brassTreeConfig.leaves[i],
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

  // rendering a dot just to show the brass starting point, can remove later
  const dotRadius = brassPairWidth / 40;
  const startPointCircle = createCircleLine(
    startPoint[0],
    startPoint[1],
    dotRadius
  );
  brassLines.push(startPointCircle);

  // rendering a line just to show the entire brass width, can remove later
  const widthGuideLine = [
    [startPoint[0] - brassPairWidth / 2, startPoint[1]],
    [startPoint[0] + brassPairWidth / 2, startPoint[1]]
  ];
  brassLines.push(widthGuideLine);

  // render the brass twice, one for each ear ;)
  for (let i = 0; i < 2; i++) {
    const brassWidth = brassPairWidth * 0.5;
    const startX = math.lerp(
      startPoint[0] - brassPairWidth / 4,
      startPoint[0] + brassPairWidth / 4,
      i
    );
    const brassStartPoint = [startX, startPoint[1]];

    brassLines.push(
      ...createBrassTreeLines(brassTree, brassStartPoint, brassWidth)
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
      generateBrassTreeConfig(numLevels)
    );
    lines.push(...brassLines);
  });

  // const box = [margin, margin, width - margin, height - margin];
  // lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings.small);
