import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { lerp, clamp } from "canvas-sketch-util/math";
import { settings } from "../../../../util";

const sketch = ({ width, height }) => {
  let lines = [];
  const margin = Math.max(width, height) / 30;

  const lineCount = 120;
  const linePointCount = 200;

  let verticalUVLines = [];
  for (let j = 0; j < lineCount * 0.8; j++) {
    let u = (1 / lineCount) * j;

    let line = [];
    for (let k = 0; k < linePointCount; k++) {
      let v = (1 / linePointCount) * k;

      if (j > 0) {
        const lastLine = verticalUVLines[j - 1];
        const lastPoint = lastLine[k];
        const noise = random.noise2D(u, v, 1, 1 / lineCount);
        u = lastPoint[0] + 1 / lineCount + noise;
      }

      line.push([u, v]);
    }

    verticalUVLines.push(line);
  }

  lines.push(
    ...verticalUVLines
      .map(points => points.map(toActualCoordinates(width, height)))
      .map((line, i) => {
        if (i % 2 === 0) {
          return line;
        } else {
          return line.reverse();
        }
      })
  );

  let horizontalUVLines = [];
  for (let j = 0; j < lineCount * 0.8; j++) {
    let v = (1 / lineCount) * j;

    let line = [];
    for (let k = 0; k < linePointCount; k++) {
      let u = (1 / linePointCount) * k;

      if (j > 0) {
        const lastLine = horizontalUVLines[j - 1];
        const lastPoint = lastLine[k];
        const noise = random.noise2D(u, v, 2, 1 / lineCount);
        v = lastPoint[1] + 1 / lineCount + noise;
      }

      line.push([u, v]);
    }

    horizontalUVLines.push(line);
  }

  lines.push(
    ...horizontalUVLines
      .map(points => points.map(toActualCoordinates(width, height)))
      .map((line, i) => {
        if (i % 2 === 0) {
          return line;
        } else {
          return line.reverse();
        }
      })
  );

  lines = lines.filter(() => random.value() > 0.3);

  const box = [margin, margin, width - margin, height - margin];
  lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings.postcard);

function toActualCoordinates(width, height, margin) {
  return ([u, v]) => {
    const point = [lerp(0, width - 0, u), lerp(0, height - 0, v)];
    return point;
  };
}
