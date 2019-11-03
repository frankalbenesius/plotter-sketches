import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { lerp } from "canvas-sketch-util/math";
import { settings } from "../../../util";

const sketch = ({ width, height }) => {
  let lines = [];
  const margin = Math.max(width, height) / 30;

  const leftLines = createAdditiveNoiseLines(
    width * 0.6,
    0,
    -width / 2,
    height
  );
  lines.push(...leftLines);

  const rightLines = createAdditiveNoiseLines(
    width * 0.6,
    0,
    width / 3,
    height,
    80
  );
  lines.push(...rightLines);

  lines = lines.filter(() => random.value() > 0.3);

  const box = [margin, margin, width - margin, height - margin];
  lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings.postcard);

function createAdditiveNoiseLines(
  x = 0,
  y = 0,
  width = 100,
  height = 100,
  lineCount = 100,
  linePointCount = 200,
  frequency = 1,
  amplitude = 1
) {
  const randomInstance = random.createRandom();
  let uvLines = [];
  for (let j = 0; j < lineCount; j++) {
    let u = (1 / lineCount) * j;
    let uvLine = [];
    for (let k = 0; k < linePointCount; k++) {
      let v = (1 / linePointCount) * k;
      if (j > 0) {
        const lastLine = uvLines[j - 1];
        const lastPoint = lastLine[k];
        const noise = randomInstance.noise2D(
          u,
          v,
          frequency,
          amplitude / lineCount
        );
        u = lastPoint[0] + 1 / lineCount + noise;
      }

      uvLine.push([u, v]);
    }

    uvLines.push(uvLine);
  }

  function toActualCoordinates(x, y, width, height, margin = 0) {
    return ([u, v]) => {
      const point = [
        lerp(x + margin, x + width - margin, u),
        lerp(y + margin, y + height - margin, v)
      ];
      return point;
    };
  }

  let lines = [];
  lines.push(
    ...uvLines
      .map(points => points.map(toActualCoordinates(x, y, width, height)))
      .map((line, i) => {
        if (i % 2 === 0) {
          return line;
        } else {
          return line.reverse();
        }
      })
  );
  return lines;
}
