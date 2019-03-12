import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import util from "../../util";

const settings = {
  dimensions: [1024, 1024]
};

const sketch = ({ width, height }) => {
  let lines = [];

  const margin = Math.max(width, height) / 20;
  const box = [margin, margin, width - margin, height - margin];
  lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings);
