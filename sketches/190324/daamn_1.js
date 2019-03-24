import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import math from "canvas-sketch-util/math";
import { settings, createGrid, createCircleLine } from "../../util";

const nodeShapes = {
  circle: "circle",
  halfCircle: "halfCircle",
  rectangle: "rectangle",
  arch: "arch"
};

const nodeOptions = [
  {
    shape: nodeShapes.circle,
    numLeafOptions: [1]
  },
  {
    shape: nodeShapes.halfCircle,
    numLeafOptions: [1, 3]
  },
  {
    shape: nodeShapes.rectangle,
    numLeafOptions: [1]
  },
  {
    shape: nodeShapes.arch,
    numLeafOptions: [2]
  }
];

function generateBrassTreeConfig(
  levelsLeft = 0,
  levelNodeConfig = random.pick(nodeOptions),
  levelLeafCount = random.pick(levelNodeConfig.numLeafOptions),
  isRootNode = true
) {
  if (levelsLeft === 0) {
    return null;
  }
  const leafConfigs = [];
  const leafNodeConfig = random.pick(nodeOptions);
  const leafNodeLeafCount = random.pick(leafNodeConfig.numLeafOptions);
  for (let i = 0; i < levelLeafCount; i++) {
    const leafConfig = generateBrassTreeConfig(
      levelsLeft - 1,
      leafNodeConfig,
      leafNodeLeafCount,
      false
    );
    if (leafConfig) {
      leafConfigs.push(leafConfig);
    }
  }
  return {
    ...levelNodeConfig,
    leaves: leafConfigs,
    isRootNode
  };
}

function createBrassTreeLines(
  brassTreeConfig,
  point,
  width,
  connectorLength = width * 0.15
) {
  let lines = [];
  let numLeaves = brassTreeConfig.leaves.length;
  if (width < 0.3) {
    numLeaves = Math.min(numLeaves, 1);
  }

  let nodeOffsetFromConnector = 0;
  if (brassTreeConfig.isRootNode) {
    // if it's the root node, we need a hook for the earing
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
    // not the root node? connect it to it's parent
    nodeOffsetFromConnector = 0.015;
    const connectorLine = [
      [point[0], point[1] - connectorLength / 2 + nodeOffsetFromConnector / 2],
      [point[0], point[1] + connectorLength / 2 + nodeOffsetFromConnector / 2]
    ];
    lines.push(connectorLine);
  }

  const nodePoint = [point[0], point[1] + nodeOffsetFromConnector];
  const circleSteps = 30;

  let nodeHeight = 0;
  let nodeWidth = 0;
  let nodeMarginer = 0.5;
  switch (brassTreeConfig.shape) {
    case nodeShapes.circle: {
      const radius = width * 0.3;
      nodeHeight = radius * 2;
      nodeWidth = radius * 2;
      const circleLine = createCircleLine(
        nodePoint[0],
        nodePoint[1] + radius,
        radius,
        30
      );
      lines.push(circleLine);
      break;
    }
    case nodeShapes.halfCircle: {
      const radius = width * 0.4;
      nodeHeight = radius * 1.3;
      nodeWidth = radius * 2;
      const stopAfterStep = circleSteps / 2;
      let halfCircleLine = createCircleLine(
        nodePoint[0],
        nodePoint[1] + radius,
        radius,
        circleSteps,
        Math.PI,
        stopAfterStep
      );
      halfCircleLine.push(
        [nodePoint[0] + radius, nodePoint[1] + nodeHeight],
        [nodePoint[0] - radius, nodePoint[1] + nodeHeight],
        [nodePoint[0] - radius, nodePoint[1] + radius]
      );
      lines.push(halfCircleLine);
      break;
    }
    case nodeShapes.arch: {
      const outerRadius = width * 0.45;
      const innerRadius = width * 0.15;
      nodeHeight = outerRadius;
      nodeWidth = outerRadius * 2;
      nodeMarginer = 0.65;
      const stopAfterStep = circleSteps / 2;
      const arcLine = [
        ...createCircleLine(
          nodePoint[0],
          nodePoint[1] + outerRadius,
          outerRadius,
          circleSteps,
          Math.PI,
          stopAfterStep
        ),
        [nodePoint[0] + outerRadius, nodePoint[1] + nodeHeight],
        [nodePoint[0] + innerRadius, nodePoint[1] + nodeHeight],
        ...createCircleLine(
          nodePoint[0],
          nodePoint[1] + outerRadius,
          innerRadius,
          circleSteps,
          Math.PI,
          stopAfterStep
        ).reverse(),
        [nodePoint[0] - innerRadius, nodePoint[1] + nodeHeight],
        [nodePoint[0] - outerRadius, nodePoint[1] + nodeHeight]
      ];
      lines.push(arcLine);
      break;
    }
    case nodeShapes.rectangle: {
      nodeWidth = width * 0.3;
      nodeHeight = width * 0.9;
      const rectangleLine = [
        [nodePoint[0] - nodeWidth / 2, nodePoint[1]],
        [nodePoint[0] + nodeWidth / 2, nodePoint[1]],
        [nodePoint[0] + nodeWidth / 2, nodePoint[1] + nodeHeight],
        [nodePoint[0] - nodeWidth / 2, nodePoint[1] + nodeHeight],
        [nodePoint[0] - nodeWidth / 2, nodePoint[1]]
      ];
      lines.push(rectangleLine);
      break;
    }
    default: {
      console.warn(
        `You either forgot to add a break;, or you haven't set up a rendering plan for this node: ${
          brassTreeConfig.shape
        }!!!`
      );
      break;
    }
  }
  if (nodeHeight <= 0 || nodeWidth <= 0) {
    console.warn(
      "You forgot to set the node dimensions!!! It's for placing leaf nodes."
    );
  }

  for (let i = 0; i < numLeaves; i++) {
    const leafXPoint = math.lerp(
      nodePoint[0] - nodeWidth * nodeMarginer,
      nodePoint[0] + nodeWidth * nodeMarginer,
      (1 / numLeaves) * (i + 0.5)
    );
    const leafYPoint = nodePoint[1] + nodeHeight;
    const leafPoint = [leafXPoint, leafYPoint];
    const leafLines = createBrassTreeLines(
      brassTreeConfig.leaves[i],
      leafPoint,
      width / numLeaves,
      connectorLength
    );
    lines.push(...leafLines);
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

    brassLines.push(
      ...createBrassTreeLines(brassTree, brassStartPoint, brassWidth)
    );
  }

  return brassLines;
}

const sketch = ({ width, height }) => {
  let lines = [];
  const brassPairWidth = width / 10;

  createGrid(9, 7).map(([u, v]) => {
    let shiftedV = v;
    if (u % 0.25 === 0) {
      shiftedV += 0.125 / 2;
    }
    const x = math.lerp(0, width - 0, u);
    const y = math.lerp(0, height - 0, shiftedV);
    const brassLines = createPairBrassLines(
      [x, y],
      brassPairWidth,
      generateBrassTreeConfig(random.rangeFloor(2, 4))
    );
    lines.push(...brassLines);
  });

  const margin = Math.max(width, height) / 20;
  const box = [margin * 1.1, margin, width - margin * 1.1, height - margin];
  lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

// WARNING: this sketch only works in "inches"
canvasSketch(sketch, settings.postcard);
