import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { lerp } from "canvas-sketch-util/math";
import range from "lodash/range";
import {
  settings,
  distanceBetweenPoints,
  createGrid,
  logSeed,
  createNoisyLines
} from "../../../util";

const sketch = ({ width, height }) => {
  logSeed("368004");
  let lines = [];
  const margin = Math.max(width, height) / 20;

  const columns = 8;
  const rows = 5;
  const points = createGrid(columns + 1, rows + 1);

  const sections = points
    .map(uv => {
      const [u, v] = uv;
      if (u !== 1 && v !== 1) {
        const x = lerp(margin, width - margin, u);
        const y = lerp(margin, height - margin, v);
        const angle = random.noise2D(u, v, 0.08) * Math.PI * 2;
        return createNoisyLines(
          [x, y],
          [
            x + (width - margin * 2) / columns + margin / 4,
            y + (height - margin * 2) / rows + margin / 4
          ],
          4,
          0.5,
          1,
          angle
        );
      } else {
        return null;
      }
    })
    .filter(n => n !== null);
  sections.forEach((section, i) => {
    if (i % 2 === 1) {
      lines.push(...section);
    }
  });

  // const box = [margin, margin, width - margin, height - margin];
  // lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings.postcard);
