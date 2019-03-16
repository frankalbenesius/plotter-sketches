import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { settings } from "../../util";
import { createVerticalLines, createHorizontalLines } from "./createLines.js";

const sketch = ({ width, height }) => {
  let lines = [];
  const margin = Math.max(width, height) / 30;

  const leftLines = createVerticalLines(width * 0.45, 0, -width * 0.45, height);
  lines.push(...leftLines);

  const rightLines = createHorizontalLines(width * 0.5, 0, width / 2, height);
  lines.push(...rightLines);

  // lines = lines.filter(() => random.value() > 0.3);

  const box = [margin, margin, width - margin, height - margin];
  lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings.postcard);
