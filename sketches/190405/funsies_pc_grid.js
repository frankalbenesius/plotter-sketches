import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { lerp } from "canvas-sketch-util/math";
import { settings, createGrid, createCircleLine } from "../../util";
import createDonutLines from "../../util/createDonutLines";

const sketch = ({ width, height }) => {
  let lines = [];

  const cols = 12;
  const pieces = 15;
  const resolution = 100;
  const innerFreq = 2;
  const innerAmp = 1;
  const outerFreq = 0.5;
  const outerAmp = 1;
  const radius = Math.min(width, height) * 0.03;
  const margin = Math.max(width, height) * 0.12;

  const points = [
    ...createGrid(cols, Math.round((height / width) * cols)).map(([u, v]) => {
      const m = margin * 1;
      return [lerp(m, width - m, u), lerp(m, height - m, v)];
    })
    // ...createGrid(cols - 1, Math.round((height / width) * (cols - 1))).map(
    //   ([u, v]) => {
    //     const m = margin * 1.75;
    //     return [lerp(m, width - m, u), lerp(m, height - m, v)];
    //   }
    // )
  ];
  const outerRandom = random.createRandom();
  points.forEach(point => {
    const noise = outerRandom.noise2D(point[0], point[1], outerFreq, outerAmp);
    const radiusMultiplier = lerp(0.6, 1.5, Math.abs(noise));
    lines.push(
      ...createDonutLines(
        point,
        pieces,
        resolution,
        radius * radiusMultiplier,
        random.getRandomSeed(),
        0,
        innerFreq,
        innerAmp
      )
    );
  });

  // const box = [margin, margin, width - margin, height - margin];
  // lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings.postcard);
