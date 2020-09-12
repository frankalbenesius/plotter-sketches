import canvasSketch from "canvas-sketch";
import { renderPaths } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import { lerp } from "canvas-sketch-util/math";

import random from "canvas-sketch-util/random";
import { settings, createCircleLine, logSeed } from "../../util";

function createDiamond({ x, y, radius, theta }) {
  const diamondLine = createCircleLine(x, y, radius, 4, theta);
  return diamondLine;
}

function nearestOdd(x) {
  return 2 * Math.floor(x / 2) + 1;
}

const sketch = ({ width, height }) => {
  logSeed("404238");
  let lines = [];

  const sizer = Math.min(width, height);
  const margin = sizer * 0.1;

  const MODE = {
    GREEN: "green",
    BLACK: "black",
    BOTH: "both",
  };

  const mode = MODE.BOTH;
  const colCount = 35;
  const freq = 0.1;
  const amp = 1;
  const radiusModifier = 1.3;

  const rowCount = nearestOdd(colCount * 0.66);
  const radius = ((sizer - margin * 2) / colCount) * radiusModifier;

  for (let col = 0; col < colCount; col++) {
    for (let row = 0; row < rowCount; row++) {
      const isCorrectOffset =
        (col % 2 === 0 && row % 2 === 0) || (col % 2 === 1 && row % 2 === 1);
      const posX = col % 4;
      const posY = row % 6;
      const isGreenDiamond =
        (posY < 3 && posX === posY) ||
        (posY === 3 && posX === 1) ||
        (posY === 4 && posX === 0);
      const isNotAGutterSpace = posX !== 3 && posY !== 5;

      let isPartOfCurrentMode = true;
      switch (mode) {
        case "green": {
          isPartOfCurrentMode = isGreenDiamond;
          break;
        }
        case "black": {
          isPartOfCurrentMode = !isGreenDiamond;
          break;
        }
        default: {
          isPartOfCurrentMode = true;
          break;
        }
      }

      if (isCorrectOffset && isNotAGutterSpace && isPartOfCurrentMode) {
        const u = col / (colCount - 1);
        const v = row / (rowCount - 1);
        const x = lerp(margin, width - margin, u);
        const y = lerp(margin, height - margin, v);

        const noise = random.noise2D(u, v, freq, amp);
        const theta = Math.PI * 2 * Math.abs(noise);

        const diamond = createDiamond({ x, y, radius, theta });
        lines.push(diamond);
      }
    }
  }

  // Clip all the lines to a margin
  const clipMargin = 0;
  const box = [clipMargin, clipMargin, width - clipMargin, height - clipMargin];
  lines = clipPolylinesToBox(lines, box);

  return (props) => renderPaths(lines, props);
};

canvasSketch(sketch, settings.postcard);
