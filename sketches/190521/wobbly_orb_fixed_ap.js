import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { lerp } from "canvas-sketch-util/math";
import { settings, createSphere, createGrid } from "../../util";

const sketch = ({ width, height }) => {
  let lines = [];

  const margin = Math.min(width, height) * 0.15;
  const cols = 7;
  const rows = Math.round(cols * (height / width));
  const minAmp = 0;
  const maxAmp = 10;

  const sphereSettings = {
    radius: Math.min(width, height) * 0.07,
    frequency: 1,
    shellLines: 40,
    arcSteps: 100,
    rotation: {
      x: Math.PI * 2 * random.value(),
      y: Math.PI * 2 * random.value(),
      z: Math.PI * 2 * random.value()
    },
    seed: random.getRandomSeed()
  };
  const gridPoints = createGrid(cols, rows);
  gridPoints.map(([u, v], i) => {
    const amp = lerp(minAmp, maxAmp, i / gridPoints.length);
    const point = [
      lerp(margin, width - margin, u),
      lerp(margin, height - margin, v)
    ];
    const sphereLines = createSphere({
      ...sphereSettings,
      center: point,
      amplitude: amp
    });
    lines.push(...sphereLines);
  });

  // const margin = Math.max(width, height) / 20;
  // const box = [margin, margin, width - margin, height - margin];
  // lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings.large);
