import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { lerp } from "canvas-sketch-util/math";
import { settings, createCircleLine } from "../../util";
import createDonutLines from "../../util/createDonutLines";

const sketch = ({ width, height }) => {
  let lines = [];
  const seed = random.getSeed();

  const parts = 240;
  const resolution = 500;
  const t = 1;
  const freq = 0.1;
  const amp = 1.5;
  const donutRadius = Math.min(width, height) * 1;

  const donutLinesA = createDonutLines(
    [width * 0.5, height * 0.5],
    parts,
    resolution,
    donutRadius,
    seed,
    t,
    freq,
    amp
  );
  lines.push(...donutLinesA);
  // const donutLinesB = createDonutLines(
  //   [width * 0.35, height * random.range(0.4, 0.6)],
  //   parts,
  //   resolution,
  //   donutRadius,
  //   seed,
  //   t,
  //   freq,
  //   amp
  // );
  // lines.push(...donutLinesB);

  const margin = 0.25;
  const box = [margin, margin, width - margin, height - margin];
  lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, {
  dimensions: [6, 4],
  units: "in",
  pixelsPerInch: 300,
  scaleToView: true
});
