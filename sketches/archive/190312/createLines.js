import random from "canvas-sketch-util/random";
import { lerp } from "canvas-sketch-util/math";

export function createVerticalLines(
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

export function createHorizontalLines(
  x = 0,
  y = 0,
  width = 100,
  height = 100,
  lineCount = 100,
  linePointCount = 100,
  frequency = 1,
  amplitude = 1
) {
  const randomInstance = random.createRandom();
  const uvDistanceBetweenLines = 1 / lineCount;
  const uvDistanceBetweenPoints = 1 / linePointCount;

  let uvLines = [];
  for (let j = 0; j <= lineCount; j++) {
    // using <= casue first line is just on [0,0]
    let v = uvDistanceBetweenLines * j;
    let uvLine = [];
    for (let k = 0; k < linePointCount; k++) {
      let u = uvDistanceBetweenPoints * k;
      const noise = randomInstance.noise2D(
        u,
        v,
        frequency,
        amplitude * uvDistanceBetweenLines
      );
      if (j > 0) {
        const lastLine = uvLines[j - 1];
        const lastPoint = lastLine[k];
        v = lastPoint[1] + uvDistanceBetweenLines + noise;
      }
      const point = [u, v];
      uvLine.push(point);
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
